import {LessonModel} from "../lesson/lesson.model";

export class Student {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  lessonList?: LessonModel[];


  constructor(firstname: string, lastname: string, email: string, telephone: string, lessonList: LessonModel[]) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.telephone = telephone;
    this.lessonList = lessonList;

  }

}
