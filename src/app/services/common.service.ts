import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    menuBarStatus = new Subject<boolean>();

    constructor() { }

    isMobile(): boolean {
        const ua = navigator.userAgent;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
    }

    setMenuBarStatus(status: boolean): void {
        this.menuBarStatus.next(status);
    }
}