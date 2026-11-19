import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeswiperComponent } from './homeswiper.component';

describe('HomeswiperComponent', () => {
  let component: HomeswiperComponent;
  let fixture: ComponentFixture<HomeswiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeswiperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeswiperComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
