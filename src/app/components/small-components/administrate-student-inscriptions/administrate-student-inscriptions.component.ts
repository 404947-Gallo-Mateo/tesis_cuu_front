import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { BackStudentInscriptionService } from '../../../services/backend-helpers/student-inscription/back-student-inscription.service';
import { StudentInscriptionDTO } from '../../../models/StudentInscriptionDTO';
import { AgePipe } from '../../../CustomPipes/age.pipe';
import { GenrePipe } from '../../../CustomPipes/genre.pipe';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-administrate-student-inscriptions',
  imports: [CommonModule, NgxPaginationModule, AgePipe, GenrePipe],
  templateUrl: './administrate-student-inscriptions.component.html',
  styleUrl: './administrate-student-inscriptions.component.css'
})
export class AdministrateStudentInscriptionsComponent {
private inscriptionService = inject(BackStudentInscriptionService);

  Math = Math;
  
  // Input para controlar la visibilidad del modal
  @Input() show: boolean = false;
  
  // Input para recibir el ID de la disciplina
  @Input() disciplineId!: string;
  
  // Output para cerrar el modal
  @Output() close = new EventEmitter<void>();
  
  // Output para notificar actualizaciones
  @Output() updateSuccess = new EventEmitter<void>();

  // Señales reactivas
  inscriptions = signal<StudentInscriptionDTO[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // Paginación
  currentPage = signal(1);
  itemsPerPage = signal(10);
  totalItems = signal(0);

   // Nueva señal para el término de búsqueda
  searchTerm = signal('');

  // Computed signal para las inscripciones filtradas
  filteredInscriptions = computed(() => {
    if (!this.searchTerm()) {
      return this.inscriptions();
    }
    
    const term = this.searchTerm().toLowerCase();
    return this.inscriptions().filter(ins => {
      const fullName = `${ins.student.firstName} ${ins.student.lastName}`.toLowerCase();
      const email = ins.student.email.toLowerCase();
      
      return fullName.includes(term) || email.includes(term);
    });
  });

  // Computed signal para el total de items filtrados
  filteredTotalItems = computed(() => this.filteredInscriptions().length);

  // Método para manejar cambios en el buscador
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.currentPage.set(1); // Resetear a la primera página al buscar
  }


  ngOnChanges() {
    if (this.show && this.disciplineId) {
      this.loadInscriptions();
    }
  }

  loadInscriptions(): void {
    this.loading.set(true);
    this.error.set(null);

    this.inscriptionService.getAllByDisciplineId(this.disciplineId).subscribe({
      next: (data) => {
        this.inscriptions.set(data);
        this.totalItems.set(data.length);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las inscripciones');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  // private transformData(data: StudentInscriptionDTO[]): any[] {
  //   return data.map(inscription => ({     
  //     studentName: `${inscription.student.firstName} ${inscription.student.lastName}`,
  //     studentEmail: inscription.student.email,
  //     categoryName: inscription.category.name,
  //   }));
  // }

  private formatDate(dateString: string): string {
    // Formatear fecha según necesidad
    return new Date(dateString).toLocaleDateString('es-ES');
  }

  onClose(): void {
    this.close.emit();
  }

  // Método para manejar acciones (ej. eliminar inscripción)

removeInscription(studentKeycloakId: string, disciplineId: string, categoryId: string): void {
  Swal.fire({
    title: '¿Está seguro?',
    text: 'Esta acción eliminará la inscripción del estudiante',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.inscriptionService.deleteStudentInscription(studentKeycloakId, disciplineId, categoryId).subscribe({
        next: () => {
          this.loadInscriptions(); // Recargar datos
          this.updateSuccess.emit(); // Notificar al padre
          
          // Mostrar confirmación de éxito
          Swal.fire(
            '¡Eliminado!',
            'La inscripción ha sido eliminada.',
            'success'
          );
        },
        error: (err) => {
          console.error('Error eliminando inscripción:', err);
          this.error.set('Error al eliminar la inscripción');
          
          // Mostrar error
          Swal.fire(
            'Error',
            'No se pudo eliminar la inscripción',
            'error'
          );
        }
      });
    }
  });
}
}
