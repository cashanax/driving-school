import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './student/students.component';
import { HomeComponent } from './home/home.component';
import {StudentDetailComponent} from "./student-detail/student-detail.component";

const routes: Routes = [
  { path: 'students/:id', component: StudentsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  //{ path: 'user', component: StudentsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'student', component: StudentDetailComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
