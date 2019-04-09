import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListerComponent } from './employee-lister.component';

describe('EmployeeListerComponent', () => {
  let component: EmployeeListerComponent;
  let fixture: ComponentFixture<EmployeeListerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeListerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
