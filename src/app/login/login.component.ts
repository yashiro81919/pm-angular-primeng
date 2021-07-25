import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  keyForm = new FormGroup({
    key1: new FormControl(''),
    key2: new FormControl(''),
  });  
  
  get key1() { return this.keyForm.get('key1'); }
  get key2() { return this.keyForm.get('key2'); }  
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
