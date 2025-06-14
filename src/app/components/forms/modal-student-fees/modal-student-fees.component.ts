import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FeeDTO } from '../../../models/backend/FeeDTO';
import { FeeService } from '../../../services/backend-helpers/fee/fee.service';
import { Role } from '../../../models/backend/embeddables/Role';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-student-fees',
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './modal-student-fees.component.html',
  styleUrl: './modal-student-fees.component.css'
})
export class ModalStudentFeesComponent {

  @Input() inscriptionFees: FeeDTO[] = [];
  @Input() currentUserRole!: string | undefined;
  @Output() feesUpdated = new EventEmitter<FeeDTO>();
  
  page = 1;
  itemsPerPage = 5;
  selectedFee: FeeDTO | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private feeService: FeeService) {}

  getRole(roleString: string | undefined): Role{
    if(roleString){
      if(roleString === "SUPER_ADMIN_CUU"){
          return Role.SUPER_ADMIN_CUU;
      }
      else if(roleString === "ADMIN_CUU"){
          return Role.ADMIN_CUU;
      }
      else if(roleString === "TEACHER"){
          return Role.TEACHER;
      }
      else {
          return Role.STUDENT;
      }
    }
    else {
      return Role.STUDENT;
    }    
  }

 updateFeePaidState(fee: FeeDTO): void {
  this.selectedFee = fee;
  this.isLoading = true;
  this.errorMessage = null;

  const role: Role = this.getRole(this.currentUserRole);

  this.feeService.Update_Discipline_FeePaidState(
    fee.userKeycloakId,
    fee.feeType,
    fee.disciplineId,
    fee.period,
    role
  ).subscribe({
    next: (updatedFee) => {
      // Filtrar la cuota actualizada (quitarla de la lista)
      this.inscriptionFees = this.inscriptionFees.filter(f => 
        !(f.feeType === updatedFee.feeType &&
          f.disciplineId === updatedFee.disciplineId &&
          f.period === updatedFee.period)
      );
      
      this.feesUpdated.emit(updatedFee);
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error al actualizar cuota:', error);
      this.errorMessage = 'Error al actualizar el estado de pago';
      this.isLoading = false;
    }
  });
}

@Output() closeModalEvent = new EventEmitter<void>();

closeModal() {
  this.closeModalEvent.emit(); // Notificar al padre
  this.inscriptionFees = [];
  this.currentUserRole = Role.STUDENT;
}

}
