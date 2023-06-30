import { Component } from '@angular/core';
import {Student} from "../student/student.model";
import { Router } from "@angular/router";
import {StudentService} from "../student/student.service";
import { ActivatedRoute } from '@angular/router';
import {LessonModel} from "../lesson/lesson.model";
import {LessonService} from "../lesson/lesson.service";
import {TokenStorageService} from "../auth/token-storage.service";

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent {
  student?: Student;
  students: Student[] = [];
  //lessonList: LessonModel[] = [];
  //lesson?: LessonModel;
  constructor(
    private lessonService: LessonService,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private router: Router,
    private token: TokenStorageService)
  {}
  private studentsUrl = 'api/students';

  private currentId = Number(this.route.snapshot.paramMap.get('id'));
  ngOnInit():void{
    this.getStudent();

  }

  getStudent(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studentService.getStudent(id)
      .subscribe(student => this.student = student);
  }
  getStudents(): void {
    this.studentService.getStudents()
      .subscribe(students => this.students = students);
  }
}
