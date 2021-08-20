import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { KeyService } from '../services/key.service';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss']
})
export class KeyComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('filterInput') filterElement!: ElementRef;

  keys: any[] = [];
  filter = new FormControl();
  keyForm!: FormGroup;
  subscriptions: Array<Subscription> = [];
  showSpinner = false;
  isEdit = false;
  displayModal = false;

  constructor(private keyService: KeyService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.keyForm = new FormGroup({
      name: new FormControl('', Validators.required),
      key: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngAfterViewInit() {
    this.filterElement.nativeElement.focus();
  }

  get name() { return this.keyForm.get('name'); }
  get key() { return this.keyForm.get('key'); }
  get value() { return this.keyForm.get('value'); }

  isInvalid(name: string) {
    const control = this.keyForm.get(name);
    return control?.invalid && (control?.dirty || control?.touched) && control?.errors?.required;
  }

  searchKeys() {
    this.showSpinner = true;
    const sub = this.keyService.searchKeys(this.filter.value).subscribe(data => {
      this.keys = data;
      this.showSpinner = false;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      this.showSpinner = false;
    });
    this.subscriptions.push(sub);
  }

  confirmDialog(event: Event, name: string) {
    this.confirmationService.confirm({
      target: event.target === null ? undefined : event.target,
      message: 'Are you sure to delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const sub = this.keyService.deleteKey(name).subscribe(() => {
          this.searchKeys();
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
        });
        this.subscriptions.push(sub);
      },
      reject: () => {

      }
    });
  }

  openDialog(key: any) {
    if (key) {
      this.isEdit = true;

      this.name?.disable();

      this.name?.setValue(key.name);
      this.key?.setValue(key.key);
      this.value?.setValue(key.value);
    } else {
      this.isEdit = false;

      this.keyForm.reset();
      this.name?.enable();
    }
    this.displayModal = true;
  }

  submitChange() {
    this.keyForm.markAllAsTouched();
    if (!this.keyForm.valid) {
      return;
    }
    const keyObject = { name: this.name?.value, key: this.key?.value, value: this.value?.value };
    if (this.isEdit) {
      const sub = this.keyService.updateKey(keyObject).subscribe(() => {
        this.searchKeys();
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      });
      this.subscriptions.push(sub);
    } else {
      const sub = this.keyService.addKey(keyObject).subscribe(() => {
        this.searchKeys();
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      });
      this.subscriptions.push(sub);
    }
    this.displayModal = false;
  }
}
