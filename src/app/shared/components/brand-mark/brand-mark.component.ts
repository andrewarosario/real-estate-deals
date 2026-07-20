import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-brand-mark',
  standalone: true,
  templateUrl: './brand-mark.component.html',
  styleUrl: './brand-mark.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandMarkComponent {
  @Input() inverse = false;
  @Input() compact = false;
}
