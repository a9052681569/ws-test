import {createHandler} from '../../../ws-router/createHandler';
import {CARDS, WSMessage} from '../../../index';
import * as WebSocket from 'ws';

const getCardByIdHandler = createHandler('id');

getCardByIdHandler.on((message: WSMessage<string>, ws: WebSocket) => {
	const resMessage = {
		event: 'cards',
		data: CARDS.filter(c => c.id === message.data)
	}

	ws.send(JSON.stringify(resMessage));
})

export const getCardsHandler = createHandler('get', getCardByIdHandler)

getCardsHandler.on((message: WSMessage<unknown>, ws: WebSocket) => {
	message = {
		event: 'cards',
		data: CARDS
	}

	ws.send(JSON.stringify(message));
})
