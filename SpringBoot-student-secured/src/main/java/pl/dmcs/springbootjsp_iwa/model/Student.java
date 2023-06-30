package pl.dmcs.springbootjsp_iwa.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import pl.dmcs.springbootjsp_iwa.model.Grade;

@Entity
public class Student {

    @Id
    @GeneratedValue
    private long id;
    private String firstname;
    private String lastname;
    private String email;
    private String telephone;

    @ManyToMany(cascade = CascadeType.PERSIST)
    private List<Grade> gradeList;

    // Commented out due to simplify http requests sent from angular app
//    @OneToOne(cascade = CascadeType.ALL)
//    private Account account;
//
//    @JsonBackReference
//    @ManyToOne(cascade = CascadeType.MERGE)
//    private Address address;
//
   @ManyToMany(cascade = CascadeType.PERSIST)
   private List<Team> teamList;


    // Commented out due to simplify http requests sent from angular app

    @OneToOne(cascade = CascadeType.ALL)
    private User users;
    //@JsonBackReference

    @OneToMany(mappedBy = "student", cascade = CascadeType.PERSIST)
    private List<Lesson> lessonList;

    public List<Lesson> getLessonList() {
        return lessonList;
    }

    public void setLessonList(List<Lesson> lessonList) {
        this.lessonList = lessonList;
    }
    public User getUser() {
        return users;
    }
    public void setUser(User user) {
        this.users = user;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    // Commented out due to simplify http requests sent from angular app
//    public Account getAccount() {
//        return account;
//    }
//
//    public void setAccount(Account account) {
//        this.account = account;
//    }
//
//    public Address getAddress() {
//        return address;
//    }
//
//    public void setAddress(Address address) {
//        this.address = address;
//    }
//
//    public List<Team> getTeamList() {
//        return teamList;
//    }
//
//    public void setTeamList(List<Team> teamList) {
//        this.teamList = teamList;
//    }
    // Commented out due to simplify http requests sent from angular app

}


