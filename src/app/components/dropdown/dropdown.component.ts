import { CountryData } from './../../model/country.model';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AppService } from '../../service';
import { map, single, tap } from 'rxjs';
import { DropdownEmitData, TownData, VillageData } from '../../model';
import { LetDirective } from '@ngrx/component';
import { AppComponentStore } from 'src/app/store/app.state';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  template: `
    <form [formGroup]="form" *ngrxLet="vm$ as vm">
      <mat-form-field floatLabel="always" hideRequiredMarker="true" class="">
        <mat-label> 縣/市 </mat-label>
        <mat-select formControlName="country">
          <mat-option *ngFor="let area of countryDropdown()" [value]="area.id">
            {{ area.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field floatLabel="always" hideRequiredMarker="true" class="">
        <mat-label> 鎮/區 </mat-label>
        <mat-select formControlName="town">
          <mat-option *ngFor="let area of townDropdown()" [value]="area.id">
            {{ area.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field floatLabel="always" hideRequiredMarker="true" class="">
        <mat-label> 村/里 </mat-label>
        <mat-select formControlName="village">
          <mat-option *ngFor="let area of villageDropdown()" [value]="area.id">
            {{ area.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </form>
  `,
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  @Output() selectData: EventEmitter<DropdownEmitData> = new EventEmitter();
  #service = inject(AppService);
  #store = inject(AppComponentStore);
  fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    country: [''],
    town: [''],
    village: [''],
  });
  countryDropdown = signal([]);
  townList = signal([]);
  villageList = signal([]);

  townDropdown = signal([]);
  villageDropdown = signal([]);

  vm$ = this.#store.vm$.pipe(
    tap(({ voteData }) => {
      const { country, town, village } = voteData;
      this.countryDropdown.set(this.createCountryList(country));
      this.townList.set(this.createTownList(town));
      this.villageList.set(this.createVillageList(village));
    })
  );

  get countryFormControl() {
    return this.form.get('country');
  }

  get townFormControl() {
    return this.form.get('town');
  }

  get villageFormControl() {
    return this.form.get('village');
  }

  setSelectedOption(key, value) {
    this.#store.setSelectedOption({ key, value });
  }

  constructor() {
    this.countryFormControl.valueChanges.subscribe((value) => {
      this.setSelectedOption('country', value);
      if (!value) return;
      const filterArray = this.townList().filter(
        (item) => item.properties.countyId === value
      );
      this.townDropdown.set(filterArray);
      this.townFormControl.setValue(null);
      this.villageFormControl.setValue(null);
    });
    this.townFormControl.valueChanges.subscribe((value) => {
      this.setSelectedOption('town', value);
      if (!value) return;
      const filterArray = this.villageList().filter(
        (item) => item.properties.townId === value
      );
      this.villageDropdown.set(filterArray);
      this.villageFormControl.setValue(null);
    });
    this.villageFormControl.valueChanges.subscribe((value) => {
      this.setSelectedOption('village', value);
    });
  }

  createCountryList(country: CountryData) {
    return country.objects.counties.geometries.map((item) => ({
      id: item.id,
      name: item.properties.countryName,
    }));
  }

  createTownList(town: TownData) {
    return town.objects.town.geometries.map((item) => ({
      id: item.id,
      name: item.properties.townName,
    }));
  }

  createVillageList(village: VillageData) {
    return village.objects.village.geometries.map((item) => ({
      id: item.id,
      name: item.properties.villageName,
    }));
  }

  sendSelectedData() {
    this.selectData.emit({
      country: this.countryFormControl.value,
      town: this.townFormControl.value,
      village: this.villageFormControl.value,
    });
  }
}
