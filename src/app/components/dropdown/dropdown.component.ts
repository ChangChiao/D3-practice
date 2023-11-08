import { CountryData } from './../../model/country.model';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AppService } from 'src/app/service';
import { map, single, tap } from 'rxjs';
import { TownData, VillageData } from 'src/app/model';
import { LetDirective } from '@ngrx/component';

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
  #service = inject(AppService);
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

  vm$ = this.#service.getVoteData().pipe(
    tap(([country, town, village]) => {
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

  constructor() {
    this.countryFormControl.valueChanges.subscribe((value) => {
      if (!value) return;
      const filterArray = this.townList().filter(
        (item) => item.id.slice(0, 5) === value
      );
      this.townDropdown.set(filterArray);
    });
    this.townFormControl.valueChanges.subscribe((value) => {
      if (!value) return;

      const filterArray = this.villageList().filter(
        (item) => item.id.slice(0, 7) === value
      );
      this.villageDropdown.set(filterArray);
    });
  }

  createCountryList(country: CountryData) {
    return country.objects.counties.geometries.map((item) => ({
      id: item.id,
      name: item.properties.name,
    }));
  }

  createTownList(town: TownData) {
    return town.objects.town.geometries.map((item) => ({
      id: item.id,
      name: item.properties.name.slice(3),
    }));
  }

  createVillageList(village: VillageData) {
    return village.objects.tracts.geometries.map((item) => ({
      id: item.id,
      name: item.properties.name.slice(6),
    }));
  }
}
