import { createHandler } from "../ws-router/createHandler";
import { WSMessageHandler } from "../ws-router/ws-message-handler";
import {cardsHandler} from './cards/cards-handler';


const handlers: WSMessageHandler[] = [
	cardsHandler
]

export const mainHandler = createHandler('', ...handlers);

