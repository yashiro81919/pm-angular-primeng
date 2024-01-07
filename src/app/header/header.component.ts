import { Component, OnInit } from '@angular/core';
import packageInfo from '../../../package.json';
import { environment } from '../../environments/environment';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  name: string = '';
  version: string = '';

  constructor(private readonly cs: CommonService) { }

  ngOnInit(): void {
    this.name = packageInfo.name;
    this.version = 'Version: ' + (environment.production ? 'prd ' : 'dev ') + packageInfo.version;
  }

  toggleMenu(): void {
    this.cs.setMenuBarStatus(true);
  }
    
}
