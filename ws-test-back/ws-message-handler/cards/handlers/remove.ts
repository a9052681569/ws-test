import {createHandler} from '../../../ws-router/createHandler';
import {Card, CARDS, WSMessage} from '../../../index';
import * as WebSocket from 'ws';

export const removeCardHandler = createHandler('remove')

removeCardHandler.on((message: WSMessage<unknown>, ws: WebSocket) => {


	// @ts-ignore
	CARDS = CARDS.filter(card => card.id !== message.data)

	const resMessage: WSMessage<Card[]> = {
		event: 'cards',
		data: CARDS
	}

	ws.send(JSON.stringify(resMessage));
})
