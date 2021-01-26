import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsocketService } from './websocket.service';
import { config } from './websocket.config';
import {WSConfig} from '../../../models/websocket';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [],
	providers: [
		WebsocketService
	]
})
export class WebsocketModule {
	static config(wsConfig: WSConfig): ModuleWithProviders<WebsocketModule> {
		return {
			ngModule: WebsocketModule,
			providers: [{ provide: config, useValue: wsConfig }]
		};
	}
}
