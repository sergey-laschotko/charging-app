import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationOwnerComponent } from './station-owner.component';

describe('StationOwnerComponent', () => {
  let component: StationOwnerComponent;
  let fixture: ComponentFixture<StationOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
