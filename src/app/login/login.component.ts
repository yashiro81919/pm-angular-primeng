import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { KeyService } from '../services/key.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  keyForm!: FormGroup;
  displayModal = false;

  get key1() { return this.keyForm.get('key1'); }
  get key2() { return this.keyForm.get('key2'); }

  constructor(private keyService: KeyService) { }

  ngOnInit(): void {
    this.keyForm = new FormGroup({
      key1: new FormControl(''),
      key2: new FormControl(''),
    });

    this.displayModal = true;
  }

  confirmLogin(): void {
    const apiKey = this.keyService.encrypt(this.key1?.value + this.key2?.value);
    localStorage.setItem('key', apiKey);

    this.displayModal = false;
  }

}
