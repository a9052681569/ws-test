import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CdkTableModule } from '@angular/cdk/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import {MatCardModule} from '@angular/material/card';

const MATERIAL_MODULES = [
	MatButtonModule,
	MatIconModule,
	MatInputModule,
	MatToolbarModule,
	MatTabsModule,
	MatSelectModule,
	MatMenuModule,
	MatChipsModule,
	DragDropModule,
	MatListModule,
	OverlayModule,
	MatRippleModule,
	MatTooltipModule,
	MatAutocompleteModule,
	MatRadioModule,
	MatSidenavModule,
	MatSlideToggleModule,
	MatCheckboxModule,
	MatSnackBarModule,
	CdkTableModule,
	CdkTreeModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	ScrollingModule,
	MatProgressBarModule,
	MatDialogModule,
	MatExpansionModule,
	MatBottomSheetModule,
	MatCardModule
];

@NgModule({
	imports: [
		CommonModule,
		...MATERIAL_MODULES
	],
	exports: [
		...MATERIAL_MODULES
	],
	declarations: []
})
export class MaterialModule {
}
