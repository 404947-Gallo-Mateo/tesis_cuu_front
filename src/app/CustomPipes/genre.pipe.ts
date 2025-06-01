import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genre'
})
export class GenrePipe implements PipeTransform {
transform(value: string): string {
    if (!value) return 'No especificado';

    switch (value.toUpperCase()) {
      case 'MALE':
        return 'Masculino';
      case 'FEMALE':
        return 'Femenino';
      case 'MIXED':
        return 'Mixto';
      default:
        return value; // Retorna el valor original si no coincide
    }
  }
}
