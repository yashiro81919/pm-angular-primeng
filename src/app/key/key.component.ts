import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { KeyService } from '../service/key.service';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss']
})
export class KeyComponent implements OnInit, OnDestroy {

  keys : any[] = [];
  filter = new FormControl();
  keyForm = new FormGroup({
    name: new FormControl('', Validators.required),
    key: new FormControl('', Validators.required),
    value: new FormControl('', Validators.required),
  });
  subscriptions: Array<Subscription> = [];
  showSpinner = false;
  isEdit = false;
  errorMessage = null;

  constructor(private keyService : KeyService, private ngb : NgbModal) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  get name() { return this.keyForm.get('name'); }
  get key() { return this.keyForm.get('key'); }
  get value() { return this.keyForm.get('value'); }

  searchKeys() {
    this.showSpinner = true;
    const sub = this.keyService.searchKeys(this.filter.value).subscribe(data => {
      this.keys = data;
      this.showSpinner = false;
    }, error => {
      this.errorMessage = error.message;
      this.showSpinner = false;
    });
    this.subscriptions.push(sub);    
  }

  confirmDialog(content: any, name: string) {
    this.ngb.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(result => {
      const sub = this.keyService.deleteKey(name).subscribe(() => {
        this.searchKeys();
      });
      this.subscriptions.push(sub);
      console.log(result);
    }, reason => {
      console.log(reason);
    });
  }

  editDialog(content: any, key: any) {
    this.isEdit = true;
    this.name?.disable();

    this.name?.setValue(key.name); 
    this.key?.setValue(key.key); 
    this.value?.setValue(key.value); 

    this.ngb.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(result => {
      const keyObject = {name: this.name?.value, key: this.key?.value, value: this.value?.value};
      const sub = this.keyService.updateKey(keyObject).subscribe(() => {
        this.searchKeys();
      });
      this.subscriptions.push(sub);
      console.log(result);
    }, reason => {
      console.log(reason);
    });     
  }

  addDialog(content: any) {
    this.isEdit = false;
    this.keyForm.reset();
    this.name?.enable();

    this.ngb.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(result => {
      const keyObject = {name: this.name?.value, key: this.key?.value, value: this.value?.value};
      const sub = this.keyService.addKey(keyObject).subscribe(() => {
        this.searchKeys();
      }, error => {
        this.errorMessage = error.message;  
      });
      this.subscriptions.push(sub);
      console.log(result);
    }, reason => {
      console.log(reason);
    });    
  }  
}
