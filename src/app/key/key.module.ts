import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { KeyComponent } from './key.component';
import { KeyRoutingModule } from './key-routing.module';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';


@NgModule({
  declarations: [
    KeyComponent
  ],
  imports: [
    CommonModule,
    KeyRoutingModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    TableModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class KeyModule { }