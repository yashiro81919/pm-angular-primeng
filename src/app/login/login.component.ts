import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { User } from '../models/user';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  keyForm!: FormGroup;
  subscriptions: Array<Subscription> = [];

  get name() { return this.keyForm.get('name'); }
  get password() { return this.keyForm.get('password'); }

  constructor(private loginService: LoginService, private messageService: MessageService,) { }

  ngOnInit(): void {
    this.keyForm = new FormGroup({
      name: new FormControl(''),
      password: new FormControl(''),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }  

  confirmLogin(): void {
    const user: User = {name: this.name?.value, password: this.password?.value};
    const sub = this.loginService.login(user).subscribe({
      next: data => {
        if (data === '') {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Wrong user name/password.' });
        } else {
          localStorage.setItem('token', data);
        }
      }, error: e => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
      }
    });
    this.subscriptions.push(sub);
  }

}
