import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], term: string, property: string = 'title'): any[] {
    if (!items || !term) {
      return items;
    }
    const cleanTerm = term.toLowerCase().trim();
    return items.filter(item => {
      const val = item?.[property];
      return typeof val === 'string' && val.toLowerCase().includes(cleanTerm);
    });
  }
}

