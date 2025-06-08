import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { CuuStudentDisciplinesComponent } from './components/small-components/cuu-student-disciplines/cuu-student-disciplines.component';
import { TeacherDisciplinesComponent } from './components/small-components/teacher-disciplines/teacher-disciplines.component';
import { AdministrateStudentInscriptionsComponent } from './components/small-components/administrate-student-inscriptions/administrate-student-inscriptions.component';
import { AdministrateUsersPageComponent } from './components/administrate-users-page/administrate-users-page.component';
import { StudentFeesComponent } from './components/student-fees/student-fees.component';
import { AdministrateFeesComponent } from './components/administrate-fees/administrate-fees.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },            
    { path: 'principal', component: MainPageComponent },    
    { path: 'mis-inscripciones', component: CuuStudentDisciplinesComponent},
    { path: 'gestion-disciplinas', component: TeacherDisciplinesComponent},
    { path: 'gestion-usuarios', component: AdministrateUsersPageComponent},
    { path: 'mis-cuotas', component: StudentFeesComponent},
    { path: 'gestion-cuotas', component: AdministrateFeesComponent},

    { path: '**', redirectTo: '', pathMatch: 'full' }
];
