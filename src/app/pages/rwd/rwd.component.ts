import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-rwd',
  standalone: true,
  imports: [CommonModule],
  template: `<p>rwd works!</p>`,
  styleUrls: ['./rwd.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RwdComponent implements OnInit {
  #responsive = inject(BreakpointObserver);
  hideSideMenu = false;
  ngOnInit() {
    this.#responsive
      .observe([Breakpoints.WebLandscape, Breakpoints.TabletLandscape])
      .subscribe((result) => {
        this.hideSideMenu = false;

        if (result.matches) {
          this.hideSideMenu = true;
        }
      });
  }
}
