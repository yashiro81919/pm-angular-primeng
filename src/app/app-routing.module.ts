import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule)},
  { path: 'key', loadChildren: () => import('./key/key.module').then(m => m.KeyModule)},
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
