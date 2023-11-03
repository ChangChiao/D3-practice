import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadVoteData } from '../store/app.actions';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  #store = inject(Store);

  initialize(resolve: () => void) {
    this.#store.dispatch(loadVoteData());
    resolve();
  }
}
