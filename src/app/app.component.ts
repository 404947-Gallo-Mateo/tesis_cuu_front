import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CuuNavbarComponent } from "./components/small-components/cuu-navbar/cuu-navbar.component";
import { TermsModalComponent } from './components/small-components/terms-modal/terms-modal.component';
import { FaqModalComponent } from './components/small-components/faq-modal/faq-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CuuNavbarComponent, TermsModalComponent, FaqModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend_club_union';
}
