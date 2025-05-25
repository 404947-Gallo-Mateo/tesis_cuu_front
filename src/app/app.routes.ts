import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { CuuStudentDisciplinesComponent } from './components/small-components/cuu-student-disciplines/cuu-student-disciplines.component';
import { TeacherDisciplinesComponent } from './components/small-components/teacher-disciplines/teacher-disciplines.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },            
    { path: 'principal', component: MainPageComponent },    
    { path: 'mis-inscripciones', component: CuuStudentDisciplinesComponent},
    { path: 'mis-disciplinas', component: TeacherDisciplinesComponent},

    { path: '**', redirectTo: '', pathMatch: 'full' }
];
