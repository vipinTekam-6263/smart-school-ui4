import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherClassAssignComponent } from './teacher-class-assign.component';

describe('TeacherClassAssignComponent', () => {
  let component: TeacherClassAssignComponent;
  let fixture: ComponentFixture<TeacherClassAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherClassAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherClassAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
