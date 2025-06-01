import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {
transform(birthDateString: string): number | string {
    // Implementar la misma lógica de calculateAge aquí
    try {
      if (!birthDateString) return 'N/A';
      
      const parts = birthDateString.split('-');
      if (parts.length !== 3) return 'N/A';
      
      const birthDate = new Date(
        parseInt(parts[2]), // año
        parseInt(parts[1]) - 1, // mes
        parseInt(parts[0]) // día
      );
      
      if (isNaN(birthDate.getTime())) return 'N/A';
      
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 'N/A';
    }
  }
}
