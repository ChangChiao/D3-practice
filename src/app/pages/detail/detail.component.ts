import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  template: `<p>detail works!</p>`,
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent {}
