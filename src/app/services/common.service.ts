import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor() { }

    isMobile(): boolean {
        const ua = navigator.userAgent;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
    }
}