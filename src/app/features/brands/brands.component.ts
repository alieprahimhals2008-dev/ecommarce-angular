import { Component,  inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrandsService } from '../../core/services/Brands/brands.service';
import { Ibrand } from '../../core/models/Brands/ibrand.interface';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-brands',
  styleUrl: './brands.component.css',
  templateUrl: './brands.component.html',
})
export class BrandsComponent implements OnInit {
  private _brandsService = inject(BrandsService);
  Brands: WritableSignal<Ibrand> = signal<Ibrand>({} as Ibrand);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.isLoading.set(true);
    this._brandsService.GetAllBrands().subscribe({
      next: (res) => {
        if (res?.data?.length) {
          this.Brands.set(res);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

}
