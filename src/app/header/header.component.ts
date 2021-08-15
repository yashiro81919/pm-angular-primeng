import { Component, OnInit } from '@angular/core';
import packageInfo from '../../../package.json';
import { MenuItem } from 'primeng/api';

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
    this.version = packageInfo.version;

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
