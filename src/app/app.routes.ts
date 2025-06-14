import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { CuuStudentDisciplinesComponent } from './components/small-components/cuu-student-disciplines/cuu-student-disciplines.component';
import { TeacherDisciplinesComponent } from './components/small-components/teacher-disciplines/teacher-disciplines.component';
import { AdministrateStudentInscriptionsComponent } from './components/small-components/administrate-student-inscriptions/administrate-student-inscriptions.component';
import { AdministrateUsersPageComponent } from './components/administrate-users-page/administrate-users-page.component';
import { StudentFeesComponent } from './components/student-fees/student-fees.component';
import { AdministrateFeesComponent } from './components/administrate-fees/administrate-fees.component';
import { AdministrateSocialFeesComponent } from './components/administrate-social-fees/administrate-social-fees.component';
import { MpCancelledPaymentPageComponent } from './components/small-components/mp/mp-cancelled-payment-page/mp-cancelled-payment-page.component';
import { MpPendingPaymentPageComponent } from './components/small-components/mp/mp-pending-payment-page/mp-pending-payment-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },            
    { path: 'principal', component: MainPageComponent },    
    { path: 'mis-inscripciones', component: CuuStudentDisciplinesComponent},
    { path: 'gestion-disciplinas', component: TeacherDisciplinesComponent},
    { path: 'gestion-usuarios', component: AdministrateUsersPageComponent},
    { path: 'mis-cuotas', component: StudentFeesComponent},
    { path: 'gestion-cuotas-disciplinas', component: AdministrateFeesComponent},
    { path: 'gestion-cuotas-club', component: AdministrateSocialFeesComponent},
    { path: 'cancelado', component: MpCancelledPaymentPageComponent},
    { path: 'pendiente', component: MpPendingPaymentPageComponent},

    { path: '**', redirectTo: '', pathMatch: 'full' }
];
