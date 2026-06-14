import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateadminDashboardComponent } from './stateadmin-dashboard.component';

describe('StateadminDashboardComponent', () => {
  let component: StateadminDashboardComponent;
  let fixture: ComponentFixture<StateadminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateadminDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateadminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
