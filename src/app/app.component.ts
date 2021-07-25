import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import packageInfo from '../../package.json';
import { KeyService } from './key.service';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = packageInfo.name;

  constructor(private keyService : KeyService, private ngb: NgbModal) {}

  ngOnInit(): void {
    const loginDialog = this.ngb.open(LoginComponent);
    const loginCom = loginDialog.componentInstance;
    loginDialog.result.then(data => {
      const apiKey = this.keyService.encrypt(loginCom.key1.value + loginCom.key2.value);
      localStorage.setItem('key', apiKey);
    }).catch(err => {
      console.log(err);
    });
  } 
}
