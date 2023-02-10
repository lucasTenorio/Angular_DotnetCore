import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {getBaseUrl} from "../../main";
import {firstValueFrom, Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{
  formGroup!: FormGroup;
  countryData: CountryData[] = [];
  loading : boolean = true;
  vatList : number[] | undefined;
  constructor(
    private readonly builder : FormBuilder,
    private readonly httpClient : HttpClient,
    private readonly snackbar : MatSnackBar
  ) {

  }
  async ngOnInit() : Promise<void>{
    this.countryData = await firstValueFrom(this.httpClient.get<CountryData[]>(getBaseUrl()+ "country"));

    this.formGroup = this.builder.group(
      {
        country : new FormControl("", [Validators.required]),
        vatRate : new FormControl("", [Validators.required]),
        radioRateTax : new FormControl("", [Validators.required]),
        withoutTaxText : new FormControl({value : "", disabled : true}, [Validators.required]),
        addedTaxText : new FormControl({value : "", disabled : true}, [Validators.required]),
        priceIncludedVatText : new FormControl({value : "", disabled : true}, [Validators.required])
      }
    )
    this.loading = false;
  }

  loadVatRate(list : any, event : any){
    if(event.isUserInput)
      this.vatList = list;
  }
  enableInputTax(){
    switch (this.formGroup.get("radioRateTax")?.value) {
      case "withoutTax":
        this.formGroup.get("withoutTaxText")?.enable();
        this.formGroup.get("addedTaxText")?.disable();
        this.formGroup.get("priceIncludedVatText")?.disable();
        break;
      case "valueAdded":
        this.formGroup.get("addedTaxText")?.enable();
        this.formGroup.get("withoutTaxText")?.disable();
        this.formGroup.get("priceIncludedVatText")?.disable();
        break;
      case "priceIncluded":
        this.formGroup.get("priceIncludedVatText")?.enable();
        this.formGroup.get("addedTaxText")?.disable();
        this.formGroup.get("withoutTaxText")?.disable();
        break;
    }
  }

  updateTaxesInput(event : Event) {
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
      alert("The following red fields needs to be filled ")
      return
    }

    const valueWithTax = parseInt((event.target as HTMLInputElement).value);
    if (!this.formGroup.get("withoutTaxText")?.disabled) {
      if (this.vatList) {
        const value = valueWithTax - (valueWithTax*this.vatList[0])/100;
        this.formGroup.patchValue(
          {
            "addedTaxText": this.vatList.length >= 1 ? value + (value * this.vatList[1]) / 100 : "",
            "priceIncludedVatText": this.vatList.length > 2 ? value + (value * this.vatList[2]) / 100 : value
          })
      }
    }
    else if(!this.formGroup.get("addedTaxText")?.disabled){
      if (this.vatList) {
        const value = valueWithTax - (valueWithTax*this.vatList[1])/100;
        this.formGroup.patchValue(
          {
            "withoutTaxText": this.vatList.length >= 0 ?value + (value * this.vatList[0]) / 100 : "",
            "priceIncludedVatText" : this.vatList.length > 2 ? value + (value * this.vatList[2]) / 100 : value})
      }
    }
    else if(!this.formGroup.get("priceIncludedVatText")?.disabled)
    {
      if (this.vatList) {
        const value = this.vatList?.length > 2 ? valueWithTax - (valueWithTax*this.vatList[2])/100 : valueWithTax;
        this.formGroup.patchValue(
          {
            "withoutTaxText": this.vatList.length >= 0 ?value + (value * this.vatList[0]) / 100 : "",
            "addedTaxText" : this.vatList.length >= 1 ? value + (value * this.vatList[1]) / 100 : ""})
      }
    }
  }
}
interface CountryData
{
  name? : string;
  vatRate? : any[];
}
