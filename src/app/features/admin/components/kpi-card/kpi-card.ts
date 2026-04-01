import { Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  templateUrl: './kpi-card.html',
})
export class KpiCardComponent {
  icon = input.required<string>();
  label = input.required<string>();
  value = input.required<string>();
  trend = input<string>();                    // '+12', '-5', '+18%'
  trendDirection = input<'up' | 'down'>();    // up = green, down = red
  iconColor = input('text-red-600');          // mặc định đỏ
}
