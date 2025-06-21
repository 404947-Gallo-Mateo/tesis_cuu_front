import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserWithFeesDTO } from '../../../models/backend/UserWithFeesDTO';
import { Role } from '../../../models/backend/embeddables/Role';
import { FeeDTO } from '../../../models/backend/FeeDTO';
import { FeeService } from '../../../services/backend-helpers/fee/fee.service';
import { FeeType } from '../../../models/backend/embeddables/FeeType';
import { RolePipe } from '../../../CustomPipes/role.pipe';

@Component({
  selector: 'app-modal-social-fees',
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './modal-social-fees.component.html',
  styleUrl: './modal-social-fees.component.css'
})
export class ModalSocialFeesComponent {

  @Input() user!: UserWithFeesDTO | null;
  @Input() currentUserRole!: string | undefined;
  @Output() feeUpdated = new EventEmitter<FeeDTO>();
  @Output() closeModal = new EventEmitter<void>();
  
  page = 1;
  itemsPerPage = 5;
  selectedFee: FeeDTO | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private feeService: FeeService) {}

  get socialFees(): FeeDTO[] {
    return this.user!.userFees.filter(fee => 
      fee.feeType === FeeType.SOCIAL && !fee.paid 
    );
  }

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

    if (fee.paid) {
      //console.warn('La cuota ya está marcada como pagada');
      return;
    }

    this.selectedFee = fee;
    this.isLoading = true;
    this.errorMessage = null;

    this.feeService.Update_Social_FeePaidState(
      this.user!.keycloakId,
      FeeType.SOCIAL,
      fee.period,
      this.getRole(this.currentUserRole)
    ).subscribe({
      next: (updatedFee) => {
        // ACTUALIZAR ESTADO LOCALMENTE
        const index = this.user!.userFees.findIndex(f => 
          f.feeType === updatedFee.feeType && 
          f.period === updatedFee.period
        );
        
        if (index !== -1) {
          // Actualizar el objeto local con la versión actualizada
          this.user!.userFees[index] = updatedFee;
        }
        
        this.feeUpdated.emit(updatedFee);
        this.isLoading = false;
        
        // La cuota desaparecerá automáticamente por el nuevo filtro
      },
      error: (error) => {
        //console.error('Error al actualizar cuota social:', error);
        this.errorMessage = 'Error al actualizar el estado de pago';
        this.isLoading = false;
      }
    });
  }

  close(): void {
    this.closeModal.emit();
  }
}
