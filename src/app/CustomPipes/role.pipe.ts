import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {

  transform(value: string): string {
      switch(value?.toUpperCase()) {
        case 'SUPER_ADMIN_CUU': return 'SuperAdmin';
        case 'ADMIN_CUU': return 'Admin';
        case 'TEACHER': return 'Profesor';
        case 'STUDENT': return 'Alumno';
        default: return value || 'Sin rol';
    }
  }
}
