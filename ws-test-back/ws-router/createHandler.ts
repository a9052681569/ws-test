import { WSMessageHandler } from "./ws-message-handler";

export const createHandler = (eventName: string, ...handlers: WSMessageHandler[]): WSMessageHandler => {
	return new WSMessageHandler(eventName, ...handlers)
}
