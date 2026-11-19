import { SubCategoriesService } from './../../../core/services/SubCategories/sub-categories.service';
import { Component, inject, input, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Isubcategory } from '../../../core/models/Subcategory/isubcategory.interface';
import { Iproduct } from '../../../core/models/Product/iproduct.interface';

@Component({
  imports: [RouterLink],
  selector: 'app-subcategory',
  styleUrl: './subcategory.component.css',
  templateUrl: './subcategory.component.html',
})
export class SubcategoryComponent {
  private _SubCategoriesService = inject(SubCategoriesService);
  private _ActivatedRoute = inject(ActivatedRoute);
  pId: WritableSignal<string> = signal('')
  SubCategoriesDetailes: WritableSignal<Isubcategory> = signal({} as Isubcategory)
  ngOnInit() {
    this._ActivatedRoute.paramMap.subscribe((map) => {
      const id = map.get('id');
      if (id) {
        this.pId.set(id);
        this.getSubCategory();
      }
    })
  }

  getSubCategory() {
    this._SubCategoriesService.GetSubCategoriesOnCategory(this.pId()).subscribe({
      next: (res) => {
        this.SubCategoriesDetailes.set(res);
      }
    })
  }

}
