import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  menuClass?: string;
  outletClass?: string;

  subscriptions: Array<Subscription> = [];

  constructor(private readonly cs: CommonService) { }

  ngOnInit(): void {
    localStorage.clear();
    this.initWidth();
    this.listenMenuBarStatus();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  initWidth(): void {
    if (this.cs.isMobile()) {
      this.menuClass = 'col-0';
      this.outletClass = 'col-12';
    } else {
      this.menuClass = 'col-2';
      this.outletClass = 'col-10';
    }
  }

  listenMenuBarStatus(): void {
    const sub = this.cs.menuBarStatus.subscribe({
      next: status => {
        if (!this.cs.isMobile()) {
          this.menuClass = this.menuClass === 'col-2' ? 'col-0' : 'col-2';
          this.outletClass = this.outletClass === 'col-10' ? 'col-12' : 'col-10';
        }
      }
    });
    this.subscriptions.push(sub);
  }
}
