import { WSMessage } from "..";
import * as WebSocket from 'ws';

export class WSMessageHandler {

	eventName: string = '';

	private handlers: WSMessageHandler[] = [];

	private errMessage: WSMessage<string> = {
		event: 'error',
		data: 'unknown event name'
	}

	private userHandle: ((message: WSMessage<unknown>, ws: WebSocket) => void) | null = null;

	constructor(eventName?: string, ...handlers: WSMessageHandler[]) {
		if (eventName) {
			this.eventName = eventName.startsWith('/') ? eventName : '/' + eventName;
		}


		this.handlers = handlers || [];
	}

	handle(message: WSMessage<unknown>, ws: WebSocket): void {
		if (!this.eventName || message.event.startsWith(this.eventName)) {

			if (message.event === this.eventName) {

				if (this.userHandle) {

					this.userHandle(message, ws);
				} else {

					this.exeption(ws);
				}
			} else {

				const nextEventName = message.event.slice(this.eventName.length)
				const nextHandler = this.handlers.find(h => nextEventName.startsWith(h.eventName));

				if (nextHandler) {

					const newMessage = {
						event: nextEventName,
						data: message.data
					}

					nextHandler.handle(newMessage, ws);
				} else {
					this.exeption(ws);
				}
			}

			
		} else {
			this.exeption(ws);
		}
	}

	on(fun: (message: WSMessage<any>, ws: WebSocket) => void): void {
		this.userHandle = fun;
	}

	private exeption(ws: WebSocket): void {
		console.log('handle exeption')
		ws.send(JSON.stringify(this.errMessage));
	}
}
