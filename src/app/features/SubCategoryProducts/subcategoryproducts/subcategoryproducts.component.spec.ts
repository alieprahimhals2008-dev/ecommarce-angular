import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubcategoryproductsComponent } from './subcategoryproducts.component';

describe('SubcategoryproductsComponent', () => {
  let component: SubcategoryproductsComponent;
  let fixture: ComponentFixture<SubcategoryproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoryproductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubcategoryproductsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
