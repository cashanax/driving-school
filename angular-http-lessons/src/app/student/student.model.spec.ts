import { Student } from './student.model';

describe('Student', () => {
  let student: Student;

  beforeEach(() => {
    student = new Student('John', 'Doe', 'maail', 'phoone');
  });

  it('should create an instance of Student', () => {
    expect(student).toBeTruthy();
    expect(student.id).toEqual(1);
    expect(student.firstname).toEqual('John Doe');
  });

  // Add more test cases as needed
});
