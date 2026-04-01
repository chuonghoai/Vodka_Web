import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'favorites',
  standalone: true
})
export class FavoritesPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) return '0';

    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';

    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 't';
    }

    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'tr';
    }

    if (num >= 100_000) {
      return (num / 1_000).toFixed(0) + 'k';
    }
    return new Intl.NumberFormat('vi-VN').format(num);
  }
}
