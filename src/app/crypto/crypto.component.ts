import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('searchButton') searchElement!: ElementRef;

  cryptos: any[] = [];
  total: number = 0;
  cryptoForm!: FormGroup;
  subscriptions: Array<Subscription> = [];
  showSpinner = false;
  isEdit = false;
  displayModal = false;

  constructor(private cryptoService: CryptoService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.cryptoForm = new FormGroup({
      cmc_id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      remark: new FormControl(''),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.searchElement.nativeElement.focus();
  }  

  get cmc_id() { return this.cryptoForm.get('cmc_id'); }
  get name() { return this.cryptoForm.get('name'); }
  get quantity() { return this.cryptoForm.get('quantity'); }
  get remark() { return this.cryptoForm.get('remark'); }

  isInvalid(name: string) {
    const control = this.cryptoForm.get(name);
    return control?.invalid && (control?.dirty || control?.touched) && control?.errors?.required;
  }

  listCryptos() {
    this.showSpinner = true;
    const sub = this.cryptoService.listCryptos().subscribe(data => {
      this.cryptos = data;
      this.total = 0;

      //calculate total
      data.forEach(element => {
        this.total += element.total;
      });

      this.showSpinner = false;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      this.showSpinner = false;
    });
    this.subscriptions.push(sub);
  }

  confirmDialog(event: Event, cmc_id: number) {
    this.confirmationService.confirm({
      target: event.target === null ? undefined : event.target,
      message: 'Are you sure to delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const sub = this.cryptoService.deleteCrypto(cmc_id).subscribe(() => {
          this.listCryptos();
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
        });
        this.subscriptions.push(sub);
      },
      reject: () => {

      }
    });
  }

  openDialog(crypto: any) {
    if (crypto) {
      this.isEdit = true;

      this.cmc_id?.disable();

      this.cmc_id?.setValue(crypto.cmc_id);
      this.name?.setValue(crypto.name);
      this.quantity?.setValue(crypto.quantity);
      this.remark?.setValue(crypto.remark);
    } else {
      this.isEdit = false;

      this.cryptoForm.reset();
      this.cmc_id?.enable();
    }
    this.displayModal = true;
  }

  submitChange() {
    this.cryptoForm.markAllAsTouched();
    if (!this.cryptoForm.valid) {
      return;
    }
    const cryptoObject = { cmc_id: this.cmc_id?.value, name: this.name?.value, quantity: this.quantity?.value, remark: this.remark?.value };
    if (this.isEdit) {
      const sub = this.cryptoService.updateCrypto(cryptoObject).subscribe(() => {
        this.listCryptos();
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      });
      this.subscriptions.push(sub);
    } else {
      const sub = this.cryptoService.addCrypto(cryptoObject).subscribe(() => {
        this.listCryptos();
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      });
      this.subscriptions.push(sub);
    }
    this.displayModal = false;
  }
}
