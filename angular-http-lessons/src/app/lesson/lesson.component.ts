import { Component, OnInit } from '@angular/core';
import {LessonModel} from "./lesson.model";
import {LessonService} from "./lesson.service";
import {StudentService} from "../student/student.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TokenStorageService} from "../auth/token-storage.service";
import {Student} from "../student/student.model";
import {AppComponent} from "../app.component";
import {HomeComponent} from "../home/home.component";
import {Sort} from "@angular/material/sort";


@Component({
  selector: 'app-lessons',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonsComponent implements OnInit {
  lessonList: LessonModel[] = [];
  lesson?: LessonModel;
  sortedLessons: LessonModel[] = [];
  studentList: Student[] = [];
  student?: Student;
  authorities : any
  sortDirection: string = 'asc';
  searchTerm: string = '';

  constructor(private lessonService: LessonService,
              private studentService: StudentService,
              private token: TokenStorageService) {

  }
  ngOnInit() {
      this.authorities=this.token.getAuthorities();
    this.sortedLessons = this.lessonList?.slice();

    if( this.authorities.includes('ROLE_ADMIN') ){
      this.getStudents();
      this.getLessons();
      this.sortedLessons = this.lessonList?.slice();
    }
    else if(!(this.authorities.includes('ROLE_ADMIN')) && this.authorities.includes('ROLE_USER')){
    }
    this.sortData({active:"hour",direction: "asc"} as Sort)
    console.log("sorterd");
  }
  sortById(): void{
    this.sortedLessons.sort((a, b)=>a.id - b.id);
  }
  sortData(sort: Sort) {
    console.log(sort+"sort")
    const data = this.lessonList?.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedLessons = data;
      return;
    }
    this.sortedLessons = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      if (a.id == undefined || b.id == undefined)
        return 0;
      switch (sort.active) {
          case 'id': return compare(a.id, +b.id, isAsc);
        case 'hour': return compare(a.hour, b.hour, isAsc);
        case 'location': return compare(a.location, b.location, isAsc);
        case 'instructor': return compare(a.instructor, b.instructor, isAsc);
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
      }
    });
  }
  approve( lesson: LessonModel): void {
    let date = '';
    let hour = '';
    let instructor = '';
    let location = '';
    let approved = true;
    //this.lesson= lesson;
    if (lesson == undefined || lesson.id == undefined) {
      return
    }

    this.lessonService.updatePartOfLesson({ date, hour, instructor, location, approved } as LessonModel, lesson.id)
      .subscribe({
        next: (lesson: LessonModel) => {
          this.getLessons();
          // var oldStudent = this.studentList?.filter(obj => obj.id == student.id);
          // delete this.studentList?[oldStudent];
          // this.studentList!.push(student);
        },
        error: () => {},
        complete: () => {
          if (this.lessonList != undefined) {
            this.lessonService.totalItems.next(this.lessonList.length);
            console.log(this.lessonList.length);
          }
        }
      });
  }
  patch(date: string, hour: string, instructor: string, location: string, lesson: LessonModel): void {
    date = date.trim();
    hour = hour.trim();
    instructor = instructor.trim();
    location = location.trim();
    this.lesson= lesson;

    if (this.lesson == undefined || this.lesson.id == undefined) {
      return;

    }

    this.lessonService.updatePartOfLesson({ date, hour, instructor, location } as LessonModel, this.lesson.id)
      .subscribe({
        next: (lesson: LessonModel) => {
          this.getLessons();
          // var oldStudent = this.studentList?.filter(obj => obj.id == student.id);
          // delete this.studentList?[oldStudent];
          // this.studentList!.push(student);
        },
        error: () => {},
        complete: () => {
          if (this.lessonList != undefined) {
            this.lessonService.totalItems.next(this.lessonList.length);
            console.log(this.lessonList.length);
          }
        }
      });

  }
  getStudents() {
    this.studentService.getStudents().subscribe((student) => {
      this.studentList = student;
    });
  }


  // getStudents(): void {
  //   this.lessonService.getStudents()
  //     .subscribe(lessonList => this.lessonList = lessonList);
  // }

  getLessons():void{
    this.lessonService.getLessons()
      .subscribe(lessonList => this.lessonList = lessonList);

  }
  filterLessons(): void{
    if (this.lessonList) {
      this.sortedLessons = this.lessonList.filter(subject =>
        subject.date.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  sortByDate(): void {
    if (this.sortDirection === 'asc') {
      this.sortedLessons?.sort((a, b) => a.date.localeCompare(b.date));
      this.sortDirection = 'desc';
    } else {
      this.sortedLessons?.sort((a, b) => b.date.localeCompare(a.date));
      this.sortDirection = 'asc';
    }
  }
  // getDataText(id: number) {
  //   let findedData = this.lessonList.find(i => i.id === id);
  //   if (typeof findedData === 'undefined') {
  //     return null;
  //   }
  //   return findedData;
  // }
  add(date: string, hour: string, instructor: string, location: string): void {
    date = date.trim();
    hour = hour.trim();
    instructor = instructor.trim();
    location = location.trim();

    this.lessonService.addLesson({ date, hour, instructor, location } as LessonModel)
      .subscribe({
        next: (lesson: LessonModel) => { this.lessonList?.push(lesson); },
        error: () => {},
        complete: () => {
          if (this.lessonList != undefined) {
            this.lessonService.totalItems.next(this.lessonList.length);
            console.log(this.lessonList.length);
          }
        }
      });
  }

  delete(lesson: LessonModel): void {
    this.lessonList = this.lessonList?.filter(c => c !== lesson);
    this.lessonService.deleteLesson(lesson).subscribe(() => {
        // for automatic update of number of students in parent component
        if(this.lessonList != undefined) {
          this.lessonService.totalItems.next(this.lessonList.length);
          console.log(this.lessonList.length);
        }
      }
    );
  }

  deleteAll(): void {
    this.lessonService.deleteLessons().subscribe(() => {
        if(this.lessonList != undefined) {
          this.lessonList.length = 0;
        }
      }
    );
  }


  update(date: string, hour: string, instructor: string, location: string, chosenToUpdateLesson:LessonModel) :void {
    let id = chosenToUpdateLesson.id;
    date = date.trim();
    hour = hour.trim();
    instructor = instructor.trim();
    location = location.trim();
    console.log(id);
    if (id != undefined) {
      this.lessonService.updateLesson({date, hour, instructor, location} as LessonModel, id)
        .subscribe({
          next: (student: LessonModel) => {
            if (this.lessonList != undefined) {
              let index = this.lessonList?.indexOf(chosenToUpdateLesson);
              this.lessonList[index] = student;
            }
          },
          error: () => {
          },
          complete: () => {
            if (this.lessonList != undefined) {
              this.lessonService.totalItems.next(this.lessonList.length);
              console.log(this.lessonList.length);
            }
          }
        })
    }
  }

  selectForPatch(lesson: LessonModel):void {
    this.lesson = lesson;
  }

}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
function refreshPage(){
  window.location.reload();
}
