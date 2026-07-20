import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import {
  TYPICAL_CAP_RATE_MAX,
  TYPICAL_CAP_RATE_MIN,
  isTypicalCapRate,
} from '../../../features/deals/domain/deal-rules';
import { CapRatePipe } from '../../pipes/cap-rate.pipe';

const RAIL_MAX = 16;

@Component({
  selector: 'app-cap-rate-rail',
  standalone: true,
  imports: [CapRatePipe],
  templateUrl: './cap-rate-rail.component.html',
  styleUrl: './cap-rate-rail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapRateRailComponent {
  @Input({ required: true }) rate = 0;
  @Input() compact = false;

  readonly typicalMinimum = TYPICAL_CAP_RATE_MIN;
  readonly typicalMaximum = TYPICAL_CAP_RATE_MAX;
  readonly typicalStart = `${(TYPICAL_CAP_RATE_MIN / RAIL_MAX) * 100}%`;
  readonly typicalWidth = `${((TYPICAL_CAP_RATE_MAX - TYPICAL_CAP_RATE_MIN) / RAIL_MAX) * 100}%`;

  get typical(): boolean {
    return isTypicalCapRate(this.rate);
  }

  get position(): string {
    const clamped = Math.min(Math.max(this.rate, 0), RAIL_MAX);
    return `${(clamped / RAIL_MAX) * 100}%`;
  }
}
