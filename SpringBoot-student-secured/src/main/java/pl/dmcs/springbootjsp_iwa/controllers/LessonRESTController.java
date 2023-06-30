package pl.dmcs.springbootjsp_iwa.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.springbootjsp_iwa.model.Lesson;
import pl.dmcs.springbootjsp_iwa.model.Lesson;
import pl.dmcs.springbootjsp_iwa.model.Student;
import pl.dmcs.springbootjsp_iwa.model.User;
import pl.dmcs.springbootjsp_iwa.repository.AddressRepository;
import pl.dmcs.springbootjsp_iwa.repository.LessonRepository;
import pl.dmcs.springbootjsp_iwa.repository.StudentRepository;
import pl.dmcs.springbootjsp_iwa.repository.UserRepository;
import pl.dmcs.springbootjsp_iwa.security.jwt.JwtProvider;
import pl.dmcs.springbootjsp_iwa.security.services.UserPrinciple;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;
import pl.dmcs.springbootjsp_iwa.security.jwt.JwtProvider;
import pl.dmcs.springbootjsp_iwa.security.jwt.JwtAuthTokenFilter;
import pl.dmcs.springbootjsp_iwa.security.jwt.JwtAuthEntryPoint;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/lessons")
public class LessonRESTController {

    private LessonRepository lessonRepository;
    private UserRepository userRepository;
    private StudentRepository studentRepository;
    //private AddressRepository addressRepository;

    @Autowired
    public LessonRESTController(LessonRepository lessonRepository, UserRepository userRepository, StudentRepository studentRepository /* AddressRepository addressRepository*/  ) {
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
        //this.addressRepository = addressRepository;
        this.studentRepository = studentRepository;

    }
    @ResponseBody
    public String currentUserName(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
//        User user = userRepository.findByUsername(principal.getName()).orElseThrow(
//                () -> new UsernameNotFoundException("User Not Found with -> username: " + principal.getName()));
        return principal.getName();
    }

    public User currentUser(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found with -> username: " + principal.getName()));
        return user;
    }
//    @Autowired
//    private JwtProvider tokenProvider;
//    @Autowired
//    private JwtAuthTokenFilter tokenFilter;
//    @GetMapping("/user")
//    public ResponseEntity<String> getCurrentUser(HttpServletRequest httpServletRequest) {
//
//        String jwt = tokenFilter.getJwt(httpServletRequest);
//        String username = "";
//        if (jwt != null && tokenProvider.validateJwtToken(jwt)) {
//
//            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//            String token = authentication.getCredentials().toString();
//            username = tokenProvider.getUserNameFromJwtToken(token);
//
//        }
//        return ResponseEntity.ok("Currently logged-in user: " + username);
//    }

    @RequestMapping(method = RequestMethod.GET/*, produces = "application/xml"*/)
    //@GetMapping
    public List<Lesson> findAllLessons() { return lessonRepository.findAll();
    }
    @GetMapping("/{id}/")
    public Lesson findLessonById(@PathVariable("id")long id) {
        return lessonRepository.findById(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    //@PostMapping
    public ResponseEntity<Lesson> addLesson(@RequestBody Lesson lesson, HttpServletRequest request) {
      System.out.println(currentUser(request).getStudent());
        if(currentUser(request).getStudent() != null){
          Student student = studentRepository.findById(currentUser(request).getStudent().getId());
          lesson.setStudent(student);
      }
        lesson.setApproved(false);
        lessonRepository.save(lesson);
        return new ResponseEntity<Lesson>(lesson, HttpStatus.CREATED);
    }


    // Commented out due to simplify http requests sent from angular app
//        if (student.getAddress().getId() <= 0 )
//        {
//            addressRepository.save(lesson.getAddress());
//        }
    // Commented out due to simplify http requests sent from angular app
    //lesson.setStudent();
//        String jwt = getJwt(httpServletRequest);
//        if (jwt != null && tokenProvider.validateJwtToken(jwt)) {
//            String username = tokenProvider.getUserNameFromJwtToken(jwt);
//        }
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    //@DeleteMapping("/{id}")
    public ResponseEntity<Lesson> deleteLesson (@PathVariable("id") long id) {
        Lesson lesson = lessonRepository.findById(id);
        if (lesson == null) {
            System.out.println("Lesson not found!");
            return new ResponseEntity<Lesson>(HttpStatus.NOT_FOUND);
        }
        lessonRepository.deleteById(id);
        return new ResponseEntity<Lesson>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PUT)
    //@PutMapping("/{id}")
    public ResponseEntity<Lesson> updateLesson(@RequestBody Lesson lesson, @PathVariable("id") long id){

        lessonRepository.save(lesson);
        return new ResponseEntity<Lesson>(lesson, HttpStatus.OK);
    }
    @RequestMapping( method = RequestMethod.PUT)
    //@PutMapping("/{id}")
    public ResponseEntity<Lesson> updateLessons(@RequestBody Lesson lesson) {
        lessonRepository.deleteAll();
        lessonRepository.save(lesson);
        return new ResponseEntity<Lesson>(lesson, HttpStatus.OK);
    }

    @RequestMapping(value="/{id}", method = RequestMethod.PATCH)
    //@PatchMapping("/{id}")
    public ResponseEntity<Lesson> updatePartOfLesson(@RequestBody Map<String, Object> updates, @PathVariable("id") long id) {
        Lesson lesson = lessonRepository.findById(id);
        if (lesson == null) {
            System.out.println("Lesson not found!");
            return new ResponseEntity<Lesson>(HttpStatus.NOT_FOUND);
        }
        System.out.println("lesson not null");
        partialUpdate(lesson,updates);
        return new ResponseEntity<Lesson>(lesson,HttpStatus.OK);
    }

    private void partialUpdate(Lesson lesson, Map<String, Object> updates) {
        if (updates.containsKey("date") && !(((String) updates.get("date")).isEmpty()) ) {
            lesson.setDate((String) updates.get("date"));
        }
        if (updates.containsKey("hour") && !(((String) updates.get("hour")).isEmpty()) ) {
            lesson.setHour((String) updates.get("hour"));
        }
        if (updates.containsKey("instructor") && !(((String) updates.get("instructor")).isEmpty()) ) {
            lesson.setInstructor((String) updates.get("instructor"));
        }
        if (updates.containsKey("location") && !(((String) updates.get("location")).isEmpty()) ) {
            lesson.setLocation((String) updates.get("location"));
        }
        if (updates.containsKey("approved") && (((Boolean) updates.get("approved"))) ) {
            lesson.setApproved((Boolean) updates.get("approved"));
        }
        lessonRepository.save(lesson);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    //@DeleteMapping("/{id}")
    public ResponseEntity<Lesson> deleteLessons() {
        lessonRepository.deleteAll();
        return new ResponseEntity<Lesson>(HttpStatus.NO_CONTENT);
    }


}
