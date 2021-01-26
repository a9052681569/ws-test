import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './core/modules/websocket/websocket.service';
import { Card } from './models/card';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'ws-test';

	cards: Card[] = [];

	canWs = false;

	loading = false;

	constructor(
		private http: HttpClient,
		public ws: WebsocketService) {
	}

	ngOnInit(): void {

		this.ws.status.subscribe(e => {
			this.canWs = e;
		});

		this.ws.on<Card[]>('cards')
			.subscribe(e => {
				// tslint:disable-next-line:no-console
				console.timeEnd('ws');

				this.cards = e;
				this.loading = false;
			});

		this.ws.loading.subscribe(e => console.log(e));
	}

	getCardsWs(): void {
		// tslint:disable-next-line:no-console
		console.time('ws');
		this.loading = true;
		this.ws.send('cards/get');
	}
	getCardsRest(): void {
		// tslint:disable-next-line:no-console
		console.time('rest');

		this.loading = true;
		this.http.post<{cards: Card[]}>('cors/get/cards', {})
			.subscribe(e => {
				// tslint:disable-next-line:no-console
				console.timeEnd('rest');

				this.loading = false;
				this.cards = e.cards;
			});
	}

	clearCards(): void {
		this.cards = [];
	}
}
