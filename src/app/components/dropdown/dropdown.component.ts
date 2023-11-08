import { CountryData } from './../../model/country.model';
import {
  ChangeDetectionStrategy,
  Component,
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
        <mat-select formControlName="timezone">
          <mat-option *ngFor="let zone of timeZoneOption" [value]="zone.value">
            {{ zone.label }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field floatLabel="always" hideRequiredMarker="true" class="">
        <mat-label> 鎮/區 </mat-label>
        <mat-select formControlName="timezone">
          <mat-option *ngFor="let zone of timeZoneOption" [value]="zone.value">
            {{ zone.label }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field floatLabel="always" hideRequiredMarker="true" class="">
        <mat-label> 村/里 </mat-label>
        <mat-select formControlName="timezone">
          <mat-option *ngFor="let zone of timeZoneOption" [value]="zone.value">
            {{ zone.label }}
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
  countryDropdown = signal(null);
  townDropdown = signal(null);
  villageDropdown = signal(null);

  vm$ = this.#service.getVoteData().pipe(
    tap(([country, town, village]) => {
      this.countryDropdown.set(country);
      this.townDropdown.set(town);
      this.villageDropdown.set(village);
    })
  );

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
