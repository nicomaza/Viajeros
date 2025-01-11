import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisBancosComponent } from './mis-bancos.component';

describe('MisBancosComponent', () => {
  let component: MisBancosComponent;
  let fixture: ComponentFixture<MisBancosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisBancosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisBancosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
