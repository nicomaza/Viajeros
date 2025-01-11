import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReintegrosComponent } from './reintegros.component';

describe('ReintegrosComponent', () => {
  let component: ReintegrosComponent;
  let fixture: ComponentFixture<ReintegrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReintegrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReintegrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
