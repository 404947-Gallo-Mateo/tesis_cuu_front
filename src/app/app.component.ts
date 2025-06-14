import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CuuNavbarComponent } from "./components/small-components/cuu-navbar/cuu-navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CuuNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend_club_union';
}
