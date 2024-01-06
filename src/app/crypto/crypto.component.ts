import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Cmc } from '../models/cmc';
import { Crypto } from '../models/crypto';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('addButton') searchElement!: ElementRef;

  cryptos: Crypto[] = [];
  cmcObjs: Cmc[] = [];
  filteredCmcs: Cmc[] = [];
  total: number = 0;
  cryptoForm!: FormGroup;
  subscriptions: Array<Subscription> = [];
  showSpinner = false;
  isEdit = false;
  displayModal = false;

  constructor(private cryptoService: CryptoService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.cryptoForm = new FormGroup({
      cmc: new FormControl({}, [Validators.required, this.cmcValidator()]),
      quantity: new FormControl('', Validators.required),
      remark: new FormControl(''),
    });

    this.showSpinner = true;

    const sub = this.cryptoService.listCmcObjects().subscribe({next: data => {
      this.cmcObjs = data;
      //search cryptos
      this.listCryptos();
    }, error: e => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
    }});
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.searchElement.nativeElement.focus();
  }

  get cmc() { return this.cryptoForm.get('cmc'); }
  get quantity() { return this.cryptoForm.get('quantity'); }
  get remark() { return this.cryptoForm.get('remark'); }

  isInvalid(name: string) {
    const control = this.cryptoForm.get(name);
    let status = control?.invalid && (control?.dirty || control?.touched) && control?.errors?.required;
    if (name === 'cmc') {
      status = status || control?.errors?.cmc;
    }
    return status;
  }

  cmcValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const type = typeof control.value;
      return type !== 'object' ? { cmc: { value: control.value } } : null;
    };
  }

  filterCmc(event: any) {
    this.filteredCmcs = this.cmcObjs.filter(cmc => {
      if (cmc.name.toLowerCase().includes(event.query.toLowerCase())) {
        return cmc;
      }
      return null;
    });
  }

  listCryptos() {
    const sub = this.cryptoService.listCryptos().subscribe({next: data => {
      this.cryptos = data;
      this.total = 0;

      //merge cryto with cmc
      this.cryptos.forEach(crypto => {
        const cmc = this.cmcObjs.find(cmc => cmc.cmcId === crypto.cmcId);
        crypto.name = cmc?.name ? cmc.name : '';
        crypto.price = cmc?.price ? cmc.price : 0;
      });

      //calculate total
      this.cryptos.forEach(element => {
        this.total += element.quantity * element.price;
      });

      this.showSpinner = false;
    }, error: e => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
      this.showSpinner = false;
    }});
    this.subscriptions.push(sub);
  }

  confirmDialog(event: Event, cmcId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure to delete "${cmcId}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass:"p-button-danger p-button-outlined p-button-rounded",
      rejectButtonStyleClass:"p-button-text p-button-outlined p-button-rounded",
      accept: () => {
        const sub = this.cryptoService.deleteCrypto(cmcId).subscribe({next: () => {
          this.listCryptos();
        }, error: e => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
        }});
        this.subscriptions.push(sub);
      },
      reject: () => {

      }
    });
  }

  openDialog(crypto: Crypto | null) {
    if (crypto) {
      this.isEdit = true;

      this.cmc?.disable();

      this.cmc?.setValue({ cmcId: crypto.cmcId, name: crypto.name, price: crypto.price });
      this.quantity?.setValue(crypto.quantity);
      this.remark?.setValue(crypto.remark);
    } else {
      this.isEdit = false;

      this.cryptoForm.reset();
      this.cmc?.enable();
    }
    this.displayModal = true;
  }

  submitChange() {
    this.cryptoForm.markAllAsTouched();
    if (!this.cryptoForm.valid) {
      return;
    }
    const cryptoObject: Crypto = { cmcId: this.cmc?.value.cmcId, name: '', price: 0, quantity: this.quantity?.value, remark: this.remark?.value };
    if (this.isEdit) {
      const sub = this.cryptoService.updateCrypto(cryptoObject).subscribe({next: () => {
        this.listCryptos();
      }, error: e => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
      }});
      this.subscriptions.push(sub);
    } else {
      const sub = this.cryptoService.addCrypto(cryptoObject).subscribe({next: () => {
        this.listCryptos();
      }, error: e => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
      }});
      this.subscriptions.push(sub);
    }
    this.displayModal = false;
  }
}
