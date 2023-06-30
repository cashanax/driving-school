import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {LessonModel} from "./lesson.model";
import {Student} from "../student/student.model";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  private lessonsUrl = 'http://localhost:8080/lessons';
  private studentsUrl = 'http://localhost:8080/students'

  constructor(private http: HttpClient) { }

  /** GET students from the server */
  // getStudents(): Observable<LessonModel[]> {
  //   return this.http.get<LessonModel[]>(this.lessonsUrl);
  // }
  getLessons(): Observable<LessonModel[]> {
    return this.http.get<LessonModel[]>(this.lessonsUrl);
  }
  getStudents(): Observable<Student[]>{
    return this.http.get<Student[]>(this.lessonsUrl);
  }


  /** GET student by id. Will 404 if id not found */
  getLesson(id: number): Observable<LessonModel> {
    const url = `${this.lessonsUrl}/${id}`;
    return this.http.get<LessonModel>(url).pipe(
      tap(_ => this.log(`fetched student id=${id}`)),
      catchError(this.handleError<LessonModel>(`getStudent id=${id}`))
    );
  }

  /** POST: add a new student to the server */
  addLesson(lesson: LessonModel): Observable<LessonModel> {
    return this.http.post<LessonModel>(this.lessonsUrl, lesson, httpOptions).pipe(
      tap((lessonAdded: LessonModel) => this.log(`added lesson id=${lessonAdded.id}`)),
      catchError(this.handleError<LessonModel>('addLesson'))
    );
  }
  addLessonAsAdmin(lesson: LessonModel): Observable<LessonModel> {
    return this.http.post<LessonModel>(this.lessonsUrl, lesson, httpOptions).pipe(
      tap((lessonAdded: LessonModel) => this.log(`added lesson id=${lessonAdded.id}`)),
      catchError(this.handleError<LessonModel>('addLesson'))
    );
  }

  /** DELETE: delete the student from the server */
  deleteLesson(student: LessonModel | number): Observable<LessonModel> {
    const id = typeof student === 'number' ? student : student.id;
    const url = `${this.lessonsUrl}/${id}`;
    return this.http.delete<LessonModel>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted student id=${id}`)),
      catchError(this.handleError<LessonModel>('deleteStudent'))
    );
  }

  /** DELETE: delete all the students from the server */
  deleteLessons(): Observable<LessonModel> {
    return this.http.delete<LessonModel>(this.lessonsUrl, httpOptions).pipe(
      tap(_ => this.log(`deleted students`)),
      catchError(this.handleError<LessonModel>('deleteStudents'))
    );
  }

  /** PUT: update the student on the server */
  updateLesson(student: LessonModel, id:number): Observable<LessonModel> {
    return this.http.put<LessonModel>(`${this.lessonsUrl}/${id}`, student, httpOptions).pipe(
      // tap(_ => this.log(`updated student id=${student.id}`)), // same as the line below
      tap((studentUpdated: LessonModel) => this.log(`updated student id=${studentUpdated.id}`)),
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  /** PUT: update all the students on the server */
  updateStudents(students: LessonModel[]): Observable<LessonModel[]> {
    return this.http.put<LessonModel[]>(this.lessonsUrl, students, httpOptions).pipe(
      tap(_ => this.log(`updated student id=${students}`)),
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  /** PATCH: update part of the student on the server */
  updatePartOfLesson(lesson: LessonModel, id:number): Observable<LessonModel> {
    return this.http.patch<LessonModel>(`${this.lessonsUrl}/${id}`, lesson, httpOptions).pipe(
      tap((lessonUpdated: LessonModel) => this.log(`updated lesson id=${lessonUpdated.id}`)),
      catchError(this.handleError<any>('updateStudent'))
    )
  }
  approve(lesson: LessonModel,id:number): Observable<LessonModel> {
    return this.http.patch<LessonModel>(`${this.lessonsUrl}/${id}`, lesson, httpOptions).pipe(
      tap((studentUpdated: LessonModel) => this.log(`updated lesson id=${studentUpdated.id}`)),
      catchError(this.handleError<any>('updateLesson'))
    )
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a StudentService message with the MessageService */
  private log(message: string) {
    console.log('LessonService: ' + message);
  }

  /** GET number of students from the server */
  getStudentsCounter(): Observable<number> {
    const url = `${this.lessonsUrl}/counter`;
    return this.http.get<number>(url);
  }

  // for automatic update of number of students in parent component
  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  getCartItems() {
    return this.totalItems.asObservable();
  }
  searchLessons(term: string): Observable<LessonModel[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<LessonModel[]>(`${this.lessonsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<LessonModel[]>('searchLesson', []))
    );
  }

}
