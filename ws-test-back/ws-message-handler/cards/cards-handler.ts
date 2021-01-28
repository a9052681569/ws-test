import {createHandler} from '../../ws-router/createHandler';
import {CARDS, WSMessage} from '../../index';
import * as WebSocket from 'ws';
import {WSMessageHandler} from '../../ws-router/ws-message-handler';
import {getCardsHandler} from './handlers/get';
import {removeCardHandler} from './handlers/remove';

const handlers: WSMessageHandler[] = [
	getCardsHandler,
	removeCardHandler
]

export const cardsHandler = createHandler('cards', ...handlers)

cardsHandler.on((message: WSMessage<unknown>, ws: WebSocket) => {
	message = {
		event: 'cards',
		data: CARDS
	}

	ws.send(JSON.stringify(message));
})
