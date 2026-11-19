import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../core/services/Categories/categories.service';
import { ICategory } from '../../core/models/Category/category.interface';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-categories',
  styleUrl: './categories.component.css',
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  private _categoriesService = inject(CategoriesService);
  
  categories: WritableSignal<ICategory> = signal<ICategory>({} as ICategory);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading.set(true);
    this._categoriesService.GetAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
