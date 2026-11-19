import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './Shared/Navbar/navbar/navbar.component';
import { FooterComponent } from './Shared/Footer/footer/footer.component';
import { ToastComponent } from './Shared/Toast/toast/toast.component';

@Component({
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('E-commerce');
}
