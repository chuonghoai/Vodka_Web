import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(seconds: number | null | undefined): string {
    if (!seconds) return '';

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      if (m <= 0)
        return `${h} giờ`;
      else if (s <= 0)
        return `${h} giờ ${m} phút`;
      return `${h} giờ ${m} phút ${s} giây`;
    }

    if (m > 0) {
      if (s <= 0)
        return `${m} phút`;
      return `${m} phút ${s} giây`;
    }

    return `${s} giây`;
  }
}
