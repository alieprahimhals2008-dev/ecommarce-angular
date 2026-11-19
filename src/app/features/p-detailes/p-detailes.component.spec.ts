import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PDetailesComponent } from './p-detailes.component';

describe('PDetailesComponent', () => {
  let component: PDetailesComponent;
  let fixture: ComponentFixture<PDetailesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PDetailesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PDetailesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
