import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViajesBuscadosComponent } from './viajes-buscados.component';

describe('ViajesBuscadosComponent', () => {
  let component: ViajesBuscadosComponent;
  let fixture: ComponentFixture<ViajesBuscadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViajesBuscadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViajesBuscadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
