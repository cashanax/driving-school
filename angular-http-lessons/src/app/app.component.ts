import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "./auth/token-storage.service";
import {Student} from "./student/student.model";
import {StudentService} from "./student/student.service";
import { ActivatedRoute } from '@angular/router';
import {AuthService} from "./auth/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular15-iwa2023-http-students';
  private roles?: string[];
  authority?: string;
  student?: Student;


  constructor(private tokenStorage: TokenStorageService,
              private route: ActivatedRoute, private studentService: StudentService) {  }


  getStudent(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    console.log(id+"- route");
    this.studentService.getStudent(id)
      .subscribe(student => this.student = student);
  }

  ngOnInit() {
    this.getStudent();

    console.log("init-"+this.student);
    if (this.tokenStorage.getToken()) {
      console.log(this.tokenStorage.getToken()+"-token");
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.authority = 'admin';
          return false;
        }
        this.authority = 'user';
        return true;
      });
    }
  }
  logout() {
    this.tokenStorage.signOut();
    window.location.reload();
  }
}
