import { Observable } from 'rxjs';

/**
 * API сервиса работы с websocket подключением
 */
export interface WSService {
	/**
	 * Поток статусов подключения. true - подключение открыто, false - закрыто.
	 */
	status: Observable<boolean>;

	/**
	 * Подписывает на сообщения казанного типа.
	 * @param event тип сообщения, указанный в поле {@link WSMessage.event}.
	 */
	on<T>(event: string): Observable<T>;

	/**
	 * Отправляет сообщение на бекенд
	 * @param event тип события, указанный в поле {@link WSMessage.event}
	 * @param data любая информация, которую нужно отправить с сообщением указанного типа
	 */
	send(event: string, data: unknown): void;
}

/**
 * Конфиг для {@link WebsocketModule}
 */
export interface WSConfig {
	/**
	 * Задаёт url для открытия сокета
	 */
	url: string;
	/**
	 * Интервал между попытками восстановить подключение. Миллисекунды.
	 */
	reconnectInterval?: number;
	/**
	 * Количество попыток восстановить подключение. Штуки.
	 */
	reconnectAttempts?: number;
	/**
	 * Флаг включения дебага
	 */
	debug?: boolean;
}

/**
 * Сообщение пересылаемое посредством websocket
 */
export interface WSMessage<T> {
	/**
	 * Тип события
	 */
	event: string;
	/**
	 * Полезная нагрузка. Основное тело сообщения.
	 */
	data: T;
}
