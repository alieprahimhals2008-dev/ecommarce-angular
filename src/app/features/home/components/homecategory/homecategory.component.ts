import { ICategory } from './../../../../core/models/Category/category.interface';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../../../core/services/Categories/categories.service';

@Component({
  imports: [RouterLink],
  selector: 'app-homecategory',
  styleUrl: './homecategory.component.css',
  templateUrl: './homecategory.component.html',
})
export class HomecategoryComponent implements OnInit {
  private _CategoriesService = inject(CategoriesService);
  categories: WritableSignal<ICategory> = signal<ICategory>({} as ICategory);

  ngOnInit() {
    this.GetAllCategories();
  }

  GetAllCategories() {
    this._CategoriesService.GetAllCategories().subscribe({
      next: (res) => {
        if (res?.data?.length) {
          this.categories.set(res);
        }
      },
      error: (err) => console.log('Error loading categories:', err)
    });
  }
}
