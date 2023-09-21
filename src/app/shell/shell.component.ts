import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  template: `
    <ng-container>
      <mat-toolbar>
        <span>My Application</span>
      </mat-toolbar>
    </ng-container>
  `,
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {}
