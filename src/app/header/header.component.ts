import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import packageInfo from '../../../package.json';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  name: string = '';
  version: string = '';
  items: MenuItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.name = packageInfo.name;
    this.version = 'Version: ' + (environment.production ? 'prd ' : 'dev ') + packageInfo.version;

    this.items = [{
      label: 'Navigate',
      items: [{
        label: 'Crypto',
        icon: 'pi pi-dollar',
        routerLink: '/crypto'
      },
      {
        label: 'Key',
        icon: 'pi pi-key',
        routerLink: '/key'
      }]
    }];
  }

}
