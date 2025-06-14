import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { CuuStudentDisciplinesComponent } from './components/small-components/cuu-student-disciplines/cuu-student-disciplines.component';
import { TeacherDisciplinesComponent } from './components/small-components/teacher-disciplines/teacher-disciplines.component';
import { AdministrateStudentInscriptionsComponent } from './components/small-components/administrate-student-inscriptions/administrate-student-inscriptions.component';
import { AdministrateUsersPageComponent } from './components/administrate-users-page/administrate-users-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },            
    { path: 'principal', component: MainPageComponent },    
    { path: 'mis-inscripciones', component: CuuStudentDisciplinesComponent},
    { path: 'gestion-disciplinas', component: TeacherDisciplinesComponent},
    { path: 'gestion-usuarios', component: AdministrateUsersPageComponent},

    { path: '**', redirectTo: '', pathMatch: 'full' }
];
