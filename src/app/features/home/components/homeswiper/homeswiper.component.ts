import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-homeswiper',
  styleUrl: './homeswiper.component.css',
  templateUrl: './homeswiper.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeswiperComponent {}
