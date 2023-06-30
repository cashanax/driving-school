package pl.dmcs.springbootjsp_iwa.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.springbootjsp_iwa.model.Student;
import pl.dmcs.springbootjsp_iwa.model.User;
import pl.dmcs.springbootjsp_iwa.repository.AddressRepository;
import pl.dmcs.springbootjsp_iwa.repository.StudentRepository;
import pl.dmcs.springbootjsp_iwa.repository.UserRepository;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/students")
public class StudentRESTController {

    private StudentRepository studentRepository;
    private AddressRepository addressRepository;
    private UserRepository userRepository;

    @Autowired
    public StudentRESTController(StudentRepository studentRepository,
                                 AddressRepository addressRepository, UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @GetMapping(/*, produces = "application/xml"*/)
    @PreAuthorize("hasRole('ADMIN')")
    public List<Student> findAllStudents() { return studentRepository.findAll();
    }
    @PreAuthorize("hasRole('USER')or hasRole('ADMIN')")
    @GetMapping(value="/{id}"/*, produces = "application/xml"*/)
    public Student findStudentsByID(@PathVariable("id") long id) {
        return studentRepository.findById(id);
    }
    @ResponseBody
    public User currentUser(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found with -> username: " + principal.getName()));
        return user;
    }
//    public Student currentStudent(HttpServletRequest request){
//        Principal principal = request.getUserPrincipal();
//        User user = userRepository.findByUsername(principal.getName()).orElseThrow(
//                () -> new UsernameNotFoundException("User Not Found with -> username: " + principal.getName()));
//        Student student = studentRepository.findById(principal.getId())
//
//    }
    @PostMapping()
    public ResponseEntity<Student> addStudent(@RequestBody Student student) {

        // Commented out due to simplify http requests sent from angular app
//        if (student.getAddress().getId() <= 0 )
//        {
//            addressRepository.save(student.getAddress());
//        }
        // Commented out due to simplify http requests sent from angular app
        //User user = student.getUser();
        //if(user.getId())
        studentRepository.save(student);
        return new ResponseEntity<Student>(student, HttpStatus.CREATED);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Student> deleteStudent (@PathVariable("id") long id) {
        Student student = studentRepository.findById(id);
        if (student == null) {
            System.out.println("Student not found!");
            return new ResponseEntity<Student>(HttpStatus.NOT_FOUND);
        }
        studentRepository.deleteById(id);
        return new ResponseEntity<Student>(HttpStatus.NO_CONTENT);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@RequestBody Student student, @PathVariable("id") long id) {
        student.setId(id);
        studentRepository.save(student);
        return new ResponseEntity<Student>(student, HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    public ResponseEntity<Student> updateStudents(@RequestBody Student student) {
        studentRepository.deleteAll();
        studentRepository.save(student);
        return new ResponseEntity<Student>(student, HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<Student> updatePartOfStudent(@RequestBody Map<String, Object> updates, @PathVariable("id") long id) {
        Student student = studentRepository.findById(id);
        if (student == null) {
            System.out.println("Student not found!");
            return new ResponseEntity<Student>(HttpStatus.NOT_FOUND);
        }
        partialUpdate(student,updates);
        return new ResponseEntity<Student>(student,HttpStatus.OK);
    }

    private void partialUpdate(Student student, Map<String, Object> updates) {
        if (updates.containsKey("firstname") && !(((String) updates.get("firstname")).isEmpty()) ) {
            student.setFirstname((String) updates.get("firstname"));
        }
        if (updates.containsKey("lastname") && !(((String) updates.get("lastname")).isEmpty()) ) {
            student.setLastname((String) updates.get("lastname"));
        }
        if (updates.containsKey("email") && !(((String) updates.get("email")).isEmpty()) ) {
            student.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("telephone") && !(((String) updates.get("telephone")).isEmpty()) ) {
            student.setTelephone((String) updates.get("telephone"));
        }
        studentRepository.save(student);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping
    public ResponseEntity<Student> deleteStudents() {
        studentRepository.deleteAll();
        return new ResponseEntity<Student>(HttpStatus.NO_CONTENT);
    }

}
