import { WSMessage } from "..";
import * as WebSocket from 'ws';

export class WSMessageHandler {

	eventName: string;

	private handlers: WSMessageHandler[] = [];

	private errMessage: WSMessage<string> = {
		event: 'error',
		data: 'unknown event name'
	}

	private userHandle: ((message: WSMessage<unknown>, ws: WebSocket) => void) | null = null;

	constructor(eventName?: string, ...handlers: WSMessageHandler[]) {
		this.eventName = eventName || '';

		this.handlers = handlers || [];
	}

	handle(message: WSMessage<unknown>, ws: WebSocket): void {
		if (this.eventName && message.event.startsWith(this.eventName)) {
			if (message.event === this.eventName) {
				if (this.userHandle) {
					this.userHandle(message, ws);
				} else {
					this.exeption(ws);
				}
			} else {
				const currentHandler = this.handlers.find(h => message.event.startsWith(h.eventName));

				if (currentHandler) {
					const newMessage = {
						event: message.event.slice(currentHandler.eventName.length),
						data: message.data
					}
					currentHandler.handle(newMessage, ws);
				} else {
					this.exeption(ws);
				}
			}

			
		} else {
			this.exeption(ws);
		}
	}

	on(fun: (message: WSMessage<unknown>, ws: WebSocket) => void): void {
		this.userHandle = fun;
	}

	private exeption(ws: WebSocket): void {
		ws.send(JSON.stringify(this.errMessage));
	}
}