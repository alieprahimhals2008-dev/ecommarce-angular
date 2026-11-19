import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesproductComponent } from './categoriesproduct.component';

describe('CategoriesproductComponent', () => {
  let component: CategoriesproductComponent;
  let fixture: ComponentFixture<CategoriesproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesproductComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesproductComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
