import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textCut',
  standalone: true
})
export class TextCutPipe implements PipeTransform {
  transform(value: string | undefined | null, limit: number = 2): string {
    if (!value) {
      return '';
    }
    const words = value.trim().split(/\s+/);
    if (words.length <= limit) {
      return value;
    }
    return words.slice(0, limit).join(' ') + '...';
  }
}

