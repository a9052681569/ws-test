import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { AddressInfo } from 'ws';
import { mainHandler } from './ws-message-handler/ws-message-handler';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
	
    ws.on('message', (message: string) => {
		const wsMessage: WSMessage<unknown> = JSON.parse(message);
	   
		mainHandler.handle(wsMessage, ws)
		
	});
    
});

app.post('/get/cards', (req, res) => {
	console.log('rest cards');
	res.send({ cards: CARDS });
})

//start our server
server.listen(80 || 8999, () => {
	const address = server.address() as AddressInfo;
    console.log(`Server started on port ${address.port} :)`);
});

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

export interface Card {
	name: string;
	discription: string;
	avatar: string;
	phone: string;
	id: string;
}

export let CARDS: Card[] = [
	{
		name: 'васян',
		discription: 'немного пидор',
		avatar: '',
		phone: '79213935478',
		id: '1'
	},
	{
		name: 'стасян',
		discription: 'сильно пидор',
		avatar: '',
		phone: '85489623456',
		id: '2'
	},
	{
		name: 'пупсян',
		discription: 'сладкий сладун пупун',
		avatar: '',
		phone: '74569871263',
		id: '3'
	},
	{
		name: 'кисюлян',
		discription: 'ляля ля ляля ляляля',
		avatar: '',
		phone: '83241758964',
		id: '4'
	},
]

for (let i = 0; i < 1; i++) {
	CARDS.push(...CARDS);
}
console.log(mainHandler);
