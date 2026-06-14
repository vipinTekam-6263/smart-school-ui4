import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchoolAdminService } from '../../users/school-admin/services/school-admin.service';
import { Gender } from 'app/models/enums/Gender.enum';
import { StudentVerifyOtpRequestDto } from 'app/models/auth/request/student-Create-varify.dto';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {

  // ================= DATA =================
  students: any[] = [];

  // ================= MODAL =================
  showAddStudentModal = false;

  // ================= ENUM =================
  Gender = Gender;

  // ================= FORM =================
  newStudent = {
    name: '',
    email: '',
    mobile: '',
    password: '',
    studentClass: '',
    section: '',
    studentClassId: 0,
    sectionId: 0,
    schoolId: 0,
    academicYearId: 1,
    gender: Gender.MALE
  };

  otp: string = '';

  // ================= FLAGS =================
  showCreateForm = true;
  showVerifyForm = false;

  isEditMode = false;
  selectedStudentId: number | null = null;

  // ================= PAGINATION =================
  pageNumber: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  constructor(private schoolAdminService: SchoolAdminService) {}

  ngOnInit(): void {
    const id = localStorage.getItem('schoolId');
    this.newStudent.schoolId = id ? Number(id) : 1;

    this.loadStudents();
  }

  // ================= LOAD STUDENTS =================
  loadStudents() {
    this.schoolAdminService.getStudents(this.pageNumber, this.pageSize)
      .subscribe({
        next: (res: any) => {

          console.log("STUDENT RESPONSE 👉", res);

          this.students = res.content || [];
          this.totalPages = res.totalPages || 0;
        },
        error: (err) => console.error(err)
      });
  }

  // ================= ADD STUDENT =================
  addStudent() {

    const request = {
      name: this.newStudent.name,
      email: this.newStudent.email,
      mobile: this.newStudent.mobile,
      password: this.newStudent.password,
      schoolId: this.newStudent.schoolId,
      studentClass: this.newStudent.studentClass,
      section: this.newStudent.section
    };

    this.schoolAdminService.createStudent(request).subscribe({
      next: () => {
        alert("OTP sent successfully");
        this.showAddStudentModal = true;
        this.showVerifyForm = true;
        this.showCreateForm = false;
      },
      error: (err) => console.error(err)
    });
  }

  // ================= VERIFY STUDENT =================
  verifyStudent() {

    this.newStudent.studentClassId = this.getClassId(this.newStudent.studentClass);
    this.newStudent.sectionId = this.getSectionId(this.newStudent.section);

    const request: StudentVerifyOtpRequestDto = {
      email: this.newStudent.email,
      otp: this.otp,
      password: this.newStudent.password,
      schoolId: this.newStudent.schoolId,
      studentClassId: this.newStudent.studentClassId,
      sectionId: this.newStudent.sectionId,
      academicYearId: this.newStudent.academicYearId,
      gender: this.newStudent.gender
    };

    this.schoolAdminService.verifyStudent(request).subscribe({
      next: () => {

        alert("Student Created Successfully");

        this.loadStudents(); // 🔥 refresh list

        this.resetForm();
        this.closeAddStudentModal();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= EDIT =================
  editStudent(student: any) {

    this.isEditMode = true;
    this.selectedStudentId = student.id;

    this.showAddStudentModal = true;

    this.newStudent = {
      ...this.newStudent,
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      studentClass: student.studentClass,
      section: student.section
    };

    this.showCreateForm = true;
    this.showVerifyForm = false;
  }

  // ================= UPDATE =================
  updateStudent() {

    this.schoolAdminService.updateStudent(
      this.selectedStudentId!,
      this.newStudent
    ).subscribe({
      next: () => {

        alert("Updated Successfully");

        this.loadStudents(); // 🔥 refresh list

        this.closeAddStudentModal();

        this.isEditMode = false;
        this.selectedStudentId = null;
      },
      error: (err) => console.error(err)
    });
  }

  // ================= DELETE =================
  deleteStudent(id: number) {

    if (!confirm("Delete student?")) return;

    this.schoolAdminService.deleteStudent(id).subscribe({
      next: () => {
        this.students = this.students.filter(s => s.id !== id);
      },
      error: (err) => console.error(err)
    });
  }

  // ================= PAGINATION =================
  nextPage() {
    if (this.pageNumber < this.totalPages - 1) {
      this.pageNumber++;
      this.loadStudents();
    }
  }

  prevPage() {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.loadStudents();
    }
  }

  // ================= MODAL =================
  openAddStudentModal() {
    this.showAddStudentModal = true;
  }

  closeAddStudentModal() {
    this.showAddStudentModal = false;

    this.isEditMode = false;
    this.selectedStudentId = null;

    this.showCreateForm = true;
    this.showVerifyForm = false;

    this.resetForm();
  }

  // ================= RESET =================
  resetForm() {

    this.newStudent = {
      name: '',
      email: '',
      mobile: '',
      password: '',
      studentClass: '',
      section: '',
      studentClassId: 0,
      sectionId: 0,
      schoolId: this.newStudent.schoolId,
      academicYearId: 1,
      gender: Gender.MALE
    };

    this.otp = '';
  }

  // ================= HELPERS =================
  getClassId(value: string): number {
    if (value === "10") return 1;
    if (value === "11") return 2;
    if (value === "12") return 3;
    return 0;
  }

  getSectionId(value: string): number {
    if (value === "A") return 1;
    if (value === "B") return 2;
    if (value === "C") return 3;
    return 0;
  }
}