import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenasComponent } from './senas.component';

describe('SenasComponent', () => {
  let component: SenasComponent;
  let fixture: ComponentFixture<SenasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SenasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SenasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
