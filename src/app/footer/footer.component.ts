import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  description: string = '';

  constructor() { }

  ngOnInit(): void {
    this.description = '© 2024 Tim Shi for a better life';
  }

}
