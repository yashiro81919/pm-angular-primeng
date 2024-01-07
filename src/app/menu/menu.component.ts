import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  hidden!: boolean;

  subscriptions: Array<Subscription> = [];

  constructor(readonly cs: CommonService) { }

  ngOnInit(): void {
    if (this.cs.isMobile()) {
      this.hidden = true;
    } else {
      this.hidden = false;
    }
    this.listenMenuBarStatus();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  listenMenuBarStatus(): void {
    const sub = this.cs.menuBarStatus.subscribe({next: status => {
      this.hidden = !this.hidden;
    }});
    this.subscriptions.push(sub);
  }  
}
