import {Student} from "../student/student.model";

export class SignupInfo {

  username: string;
  role: string[];
  password: string;
  student: Student;

  constructor(username: string, password: string, student:Student) {
    this.username = username;
    this.role = ['user'];
    this.password = password;
    this.student= student;
  }
}
