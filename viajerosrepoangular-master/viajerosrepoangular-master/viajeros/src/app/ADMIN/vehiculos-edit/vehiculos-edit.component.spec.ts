import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculosEditComponent } from './vehiculos-edit.component';

describe('VehiculosEditComponent', () => {
  let component: VehiculosEditComponent;
  let fixture: ComponentFixture<VehiculosEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculosEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiculosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
