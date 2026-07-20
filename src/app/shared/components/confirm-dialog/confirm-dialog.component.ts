import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { AutofocusDirective } from '../../directives/autofocus.directive';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [AutofocusDirective],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) message = '';
  @Input() confirmLabel = 'Confirm';
  @Input() tone: 'danger' | 'primary' = 'danger';

  @Output() readonly confirmed = new EventEmitter<void>();
  @Output() readonly cancelled = new EventEmitter<void>();
}
