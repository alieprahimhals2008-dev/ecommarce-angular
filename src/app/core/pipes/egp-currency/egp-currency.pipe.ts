import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'egpCurrency',
  standalone: true
})
export class EgpCurrencyPipe implements PipeTransform {
  transform(value: number | string | undefined | null): string {
    if (value === null || value === undefined || value === '') {
      return '0 EGP';
    }
    const num = Number(value);
    if (isNaN(num)) {
      return `${value} EGP`;
    }
    return `${num.toLocaleString('en-US')} EGP`;
  }
}

