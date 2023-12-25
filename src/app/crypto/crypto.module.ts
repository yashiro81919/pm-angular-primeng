import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CryptoComponent } from './crypto.component';
import { CryptoRoutingModule } from './crypto-routing.module';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';


@NgModule({
  declarations: [
    CryptoComponent
  ],
  imports: [
    CommonModule,
    CryptoRoutingModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ConfirmPopupModule,
    AutoCompleteModule,
    TableModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class CryptoModule { }