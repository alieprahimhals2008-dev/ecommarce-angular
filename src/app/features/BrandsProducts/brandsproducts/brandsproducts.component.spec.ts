import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandsproductsComponent } from './brandsproducts.component';

describe('BrandsproductsComponent', () => {
  let component: BrandsproductsComponent;
  let fixture: ComponentFixture<BrandsproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsproductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandsproductsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
