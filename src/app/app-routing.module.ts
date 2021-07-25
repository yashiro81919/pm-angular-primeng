import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CryptoComponent } from './crypto/crypto.component';
import { KeyComponent } from './key/key.component';

const routes: Routes = [
  { path: 'crypto', component: CryptoComponent},
  { path: 'key', component: KeyComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
