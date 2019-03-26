import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOwnerComponent } from './service-owner.component';

describe('ServiceOwnerComponent', () => {
  let component: ServiceOwnerComponent;
  let fixture: ComponentFixture<ServiceOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
