import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirmeComponent } from './subirme.component';

describe('SubirmeComponent', () => {
  let component: SubirmeComponent;
  let fixture: ComponentFixture<SubirmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubirmeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubirmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
