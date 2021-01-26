import { Injectable, OnDestroy, Inject } from '@angular/core';
import {Observable, Subject, Observer, interval, throwError} from 'rxjs';
import {catchError, filter, finalize, map, shareReplay, takeUntil, tap} from 'rxjs/operators';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';

import { share, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { config } from './websocket.config';
import {WSService, WSMessage, WSConfig} from '../../../models/websocket';
import {environment} from '../../../../environments/environment';

/**
 * Открывает и поддерживает соединение по протоколу websocket
 */
@Injectable()
export class WebsocketService implements WSService, OnDestroy {

	private destroy$$ = new Subject();

	/**
	 * Конфиг для {@link WebSocketSubject}. Задаёт url для открытия сокета, действия при открытии/закрытии соединения.
	 */
	private wsConfig: WebSocketSubjectConfig<WSMessage<unknown>>;

	/**
	 * Интервальный поток. Используется для отправки попыток восстановить соединение.
	 */
	private reconnection$$: Observable<number> | null;

	/**
	 * Основной поток, управляющий работой с сокетами.
	 */
	private ws$$: WebSocketSubject<WSMessage<unknown>> | null;

	/**
	 * Вспомогательный поток для работы с открытым сокетом. Используется для фильтрации сообщений и распределения их между подписчиками.
	 *
	 * Именно на него подписываются внешние подписчики.
	 */
	private wsMessages$$ = new Subject<WSMessage<unknown>>();

	/**
	 * Буфер типов сообщений с активной подпиской.
	 *
	 */
	private activeSubscriptions = new Set<string>();

	/**
	 * Поток новых типов сообщений. Используется для подписки/отписки при наличии подключения.
	 *
	 */
	private subscriptions$$: Subject<WSMessage<unknown>> | null = new Subject<WSMessage<unknown>>();

	/**
	 * Вспомогательный поток для мониторинга статуса подключения.
	 */
	private connection$$: Observer<boolean>;

	/**
	 * Пауза между попытками открыть соединение. Миллисекунды.
	 */
	private reconnectInterval: number;

	/**
	 * Количество попыток восстановить соединение прежде, чем перестать пытаться.
	 */
	private reconnectAttempts: number;

	/**
	 * Вспомогательный синхронный флаг состояния статуса подключения.
	 */
	private isConnected: boolean;

	/**
	 * Основной поток статусов подключения.
	 */
	status: Observable<boolean>;

	loading = new Subject<boolean>();

	constructor(@Inject(config) private moduleConfig: WSConfig) {
		const protocol = environment.production ? 'wss://' : 'ws://';

		this.reconnectInterval = moduleConfig.reconnectInterval || 5000;
		this.reconnectAttempts = moduleConfig.reconnectAttempts || 10;

		// инициализируем конфиг WebSocketSubject
		this.wsConfig = {
			url: protocol + location.host + moduleConfig.url,
			openObserver: {
				next: () => {
					if (this.moduleConfig.debug) {
						console.log('[WS] подключен к ', this.wsConfig.url);
					}

					this.connection$$.next(true);
				}
			},
			closeObserver: {
				next: () => {
					if (this.moduleConfig.debug) {
						console.log('[WS] отключен от ', this.wsConfig.url);
					}

					this.ws$$ = null;
					this.connection$$.next(false);
				}
			}
		};

		// создаём Observable, доступный извне, для получения статуса подключения
		this.status = new Observable<boolean>(observer => this.connection$$ = observer)
			.pipe(
				share(),
				distinctUntilChanged()
			);

		// мониторим статус подключения
		this.status
			.pipe(takeUntil(this.destroy$$))
			.subscribe(isConnected => {
				this.isConnected = isConnected;

				// пробуем восстановить подключение при его отсутствии
				if (!this.reconnection$$ && !this.isConnected) {
					this.reconnect();
				}
			});

		// говорим, что что-то пошло не так
		this.wsMessages$$
			.pipe(
				takeUntil(this.destroy$$),
				catchError((error: ErrorEvent) => {
					console.error('WebSocket error!', error);

					return throwError(error);
				})
			)
			.subscribe();

		this.connect();
	}

	ngOnDestroy(): void {
		this.destroy$$.next();
		this.destroy$$.complete();
	}

	/**
	 * Пытается открыть websocket соединение, используя параметры, указанные в {@link wsConfig}.
	 * Отправляет новые события подписки/отмены подписки, при наличии подключения.
	 */
	private connect(): void {
		this.ws$$ = new WebSocketSubject(this.wsConfig);

		// запускаем поток для прослушивания сообщений, подбрасываем новые сообщения внешним подписчикам
		this.ws$$
			.pipe(
				takeUntil(this.destroy$$),
				tap(message => this.wsMessages$$.next(message)),
				catchError(err => {
					if (!this.ws$$) {
						// при ошибке пробуем ещё
						this.reconnect();
					}

					return throwError(err);
				})
			)
			.subscribe();
	}

	/**
	 * Пытается восстановить websocket соединение, используя параметры, указанные в {@link wsConfig}.
	 */
	private reconnect(): void {
		this.reconnection$$ = interval(this.reconnectInterval)
			.pipe(takeWhile((v, index) => index < this.reconnectAttempts && !this.ws$$));

		this.reconnection$$
			.pipe(
				tap(() => this.connect()),
				finalize(() => {
					// закрываем поток, если количество попыток исчерпано
					this.reconnection$$ = null;
					if (!this.ws$$) {
						this.wsMessages$$.complete();
						this.connection$$.complete();
					}
				})
			)
			.subscribe();
	}

	/**
	 * Отправляет сообщения с запросом подписки/отписки по переданному типу события, фильтрует получаемые сообщения по переданному типу.
	 * Отписка от указанного типа события с отправлением соответствующего сообщения
	 * происходит автоматически при отсутствии хотя бы одного подписчика.
	 * Отдаёт только содержимое поля {@link WSMessage.data} из полученного события.
	 * @param eventType тип сообщения, указанный в поле {@link WSMessage.event}
	 */
	on<T>(eventType: string): Observable<T> {

		if (!eventType.trim()) {
			throwError('[WS] не задан тип события при подписке');
		}

		return (this.wsMessages$$ as Subject<WSMessage<T>>)
			.pipe(
				tap(() => {
					this.loading.next(false);
				}),
				filter(message => message.event === eventType),
				map(message => message.data)
			);
	}

	/**
	 * Отправляет сообщение на бекенд
	 * @param event тип события, указанный в поле {@link WSMessage.event}
	 * @param data любая информация, которую нужно отправить с сообщением указанного типа
	 */
	send(event: string, data: unknown = {}): void {
		this.loading.next(true);
		if (event && this.isConnected) {
			if (this.moduleConfig.debug) {
				console.log('[WS] отправлено сообщение', { event, data });
			}
			if (this.ws$$) {
				this.ws$$.next({ event, data });
			}

		} else {
			console.error('[WS] ошибка при отправке сообщения. Не указан тип, либо отсутствует подключение.');
		}
	}
}
