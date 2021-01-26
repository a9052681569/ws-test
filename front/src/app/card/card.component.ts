import { Component, Input, OnInit } from '@angular/core';
import { WebsocketService } from '../core/modules/websocket/websocket.service';
import { Card } from '../models/card';

@Component({
	selector: 'app-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

	@Input() card: Card;

	constructor(private ws: WebsocketService) { }

	ngOnInit(): void {
	}

	remove(): void {
		// tslint:disable-next-line:no-console
		console.time('ws');
		this.ws.send('cards/remove', this.card.id);
	}

}
