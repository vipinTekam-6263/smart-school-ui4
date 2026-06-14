import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictadminDashboardComponent } from './districtadmin-dashboard.component';

describe('DistrictadminDashboardComponent', () => {
  let component: DistrictadminDashboardComponent;
  let fixture: ComponentFixture<DistrictadminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistrictadminDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistrictadminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
