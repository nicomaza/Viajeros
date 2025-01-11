import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserAdComponent } from './edit-user-ad.component';

describe('EditUserAdComponent', () => {
  let component: EditUserAdComponent;
  let fixture: ComponentFixture<EditUserAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserAdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
