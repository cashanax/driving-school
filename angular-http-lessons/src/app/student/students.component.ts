import { Component, OnInit } from '@angular/core';
import {Student} from "./student.model";
import {StudentService} from "./student.service";
import {TokenStorageService} from "../auth/token-storage.service";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  studentList?: Student[];
  student?: Student;
  authorities : any;
  searchTerm: string = '';
  filteredStudentList : Student[] = [];

  constructor(private studentService: StudentService,
              private token: TokenStorageService) { }

  ngOnInit() {

    this.authorities=this.token.getAuthorities();
    if((this.authorities.includes('ROLE_ADMIN'))){
      this.getStudents();
      console.log(this.studentList?.length+"admin fetched");
    }
    else {
      this.getStudent(202);
      console.log(this.student?.id+"///user fetched");
    }
  }


  filterStudents(): void {
    if (this.studentList) {
      console.log(this.studentList.length+"filtering..."+this.filteredStudentList.length+this.searchTerm)
      this.filteredStudentList = this.studentList.filter(student =>
        student.firstname.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  getStudents(): void {
    this.studentService.getStudents()
      .subscribe(studentList => this.studentList = studentList);

    this.filterStudents();
  }
  getStudent(id: number): void {
    this.studentService.getStudent(id)
      .subscribe(student => this.student = student);

    this.filterStudents();
  }
  add(firstname: string, lastname: string, email: string, telephone: string): void {
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    telephone = telephone.trim();
    this.studentService.addStudent({ firstname, lastname, email, telephone } as Student)
      .subscribe({
        next: (student: Student) => { this.studentList?.push(student); },
        error: () => {},
        complete: () => {
          if (this.studentList != undefined) {
            this.studentService.totalItems.next(this.studentList.length);
            console.log(this.studentList.length);
          }
        }
  });
  }

  delete(student: Student): void {
    this.studentList = this.studentList?.filter(c => c !== student);
    this.studentService.deleteStudent(student).subscribe(() => {
        // for automatic update of number of students in parent component
      if(this.studentList != undefined) {
        this.studentService.totalItems.next(this.studentList.length);
        console.log(this.studentList.length);
      }
      }
    );
  }

  deleteAll(): void {
    this.studentService.deleteStudents().subscribe(() => {
      if(this.studentList != undefined) {
        this.studentList.length = 0;
      }
      }
    );
  }

  update(firstname: string, lastname: string, email: string, telephone: string, chosenToUpdateStudent:Student):void {
    let id = chosenToUpdateStudent.id;
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    telephone = telephone.trim();
    console.log(id);
    if (id != undefined) {
      this.studentService.updateStudent({firstname, lastname, email, telephone} as Student, id)
        .subscribe({
          next: (student: Student) => {
            if (this.studentList != undefined) {
              let index = this.studentList?.indexOf(chosenToUpdateStudent);
              this.studentList[index] = student;
            }
          },
          error: () => {
          },
          complete: () => {
            if (this.studentList != undefined) {
              this.studentService.totalItems.next(this.studentList.length);
              console.log(this.studentList.length);
            }
          }
        })
    }
  }

  selectForPatch(student: Student):void {
    this.student = student;
  }

  patch(firstname: string, lastname: string, email: string, telephone: string): void {
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    telephone = telephone.trim();
    if (this.student == undefined || this.student.id == undefined) {
      return
    }

    this.studentService.updatePartOfStudent({ firstname, lastname, email, telephone } as Student, this.student.id)
      .subscribe({
        next: (student: Student) => {
          this.getStudents();
          // var oldStudent = this.studentList?.filter(obj => obj.id == student.id);
          // delete this.studentList?[oldStudent];
          // this.studentList!.push(student);
        },
        error: () => {},
        complete: () => {
          if (this.studentList != undefined) {
            this.studentService.totalItems.next(this.studentList.length);
            console.log(this.studentList.length);
          }
        }
  });
  }
}

