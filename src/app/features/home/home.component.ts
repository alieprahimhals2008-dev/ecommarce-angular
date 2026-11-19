import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomecategoryComponent } from './components/homecategory/homecategory.component';
import { HomeswiperComponent } from './components/homeswiper/homeswiper.component';
import { HomeProductsComponent } from './components/home-products/home-products.component';

@Component({
  imports: [HomeswiperComponent, HomecategoryComponent, HomeProductsComponent, RouterLink],
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent {}
