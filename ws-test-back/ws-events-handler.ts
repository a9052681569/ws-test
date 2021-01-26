import { CARDS, WSMessage } from ".";
import { createHandler } from "./ws-router/createHandler";
import { WSMessageHandler } from "./ws-router/ws-message-handler";
import * as WebSocket from 'ws';

const cardsHandler = createHandler('cards/get')

cardsHandler.on((message: WSMessage<unknown>, ws: WebSocket) => {
	message = {
		event: 'cards',
		data: CARDS
	}

	ws.send(JSON.stringify(message));
})



const handlers: WSMessageHandler[] = [
	cardsHandler
]

export const mainHandler = createHandler('', ...handlers);

