import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CryptoService } from '../service/crypto.service';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit, OnDestroy {

  cryptos : any[] = [];
  total : number = 0;
  cryptoForm = new FormGroup({
    cmc_id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    remark: new FormControl(''),
  });  
  subscriptions: Array<Subscription> = [];
  showSpinner = false;
  isEdit = false;
  errorMessage = null;

  constructor(private cryptoService : CryptoService, private ngb : NgbModal) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  get cmc_id() { return this.cryptoForm.get('cmc_id'); }
  get name() { return this.cryptoForm.get('name'); }
  get quantity() { return this.cryptoForm.get('quantity'); }  
  get remark() { return this.cryptoForm.get('remark'); }  

  listCryptos() {
    this.showSpinner = true;
    const sub = this.cryptoService.listCryptos().subscribe(data => {
      this.cryptos = data;

      //calculate total
      data.forEach(element => {
        this.total += element.total;  
      });

      this.showSpinner = false;
    }, error => {
      this.errorMessage = error.message;
      this.showSpinner = false;
    });
    this.subscriptions.push(sub);    
  }

  confirmDialog(content: any, cmc_id: number) {
    this.ngb.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(result => {
      const sub = this.cryptoService.deleteCrypto(cmc_id).subscribe(() => {
        this.listCryptos();
      });
      this.subscriptions.push(sub);
      console.log(result);
    }, reason => {
      console.log(reason);
    });
  }

  editDialog(content: any, crypto: any) {
    this.isEdit = true;
    this.cmc_id?.disable();

    this.cmc_id?.setValue(crypto.cmc_id); 
    this.name?.setValue(crypto.name); 
    this.quantity?.setValue(crypto.quantity); 
    this.remark?.setValue(crypto.remark); 

    this.ngb.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(result => {
      const cryptoObject = {cmc_id: this.cmc_id?.value, name: this.name?.value, quantity: this.quantity?.value, remark: this.remark?.value};
      const sub = this.cryptoService.updateCrypto(cryptoObject).subscribe(() => {
        this.listCryptos();
      });
      this.subscriptions.push(sub);
      console.log(result);
    }, reason => {
      console.log(reason);
    });     
  }

  addDialog(content: any) {
    this.isEdit = false;
    this.cryptoForm.reset();
    this.cmc_id?.enable();

    this.ngb.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(result => {
      const cryptoObject = {cmc_id: this.cmc_id?.value, name: this.name?.value, quantity: this.quantity?.value, remark: this.remark?.value};
      const sub = this.cryptoService.addCrypto(cryptoObject).subscribe(() => {
        this.listCryptos();
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
