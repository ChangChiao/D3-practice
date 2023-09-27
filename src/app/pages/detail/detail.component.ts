import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  template: `<p>detail works!</p>`,
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent implements OnInit {
  #route = inject(ActivatedRoute);

  ngOnInit() {
    this.#route.queryParams.subscribe((params) => {
      console.log(params);
    });
  }
}
