package pl.dmcs.springbootjsp_iwa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.dmcs.springbootjsp_iwa.model.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student,Long>{
    Student findById(long id);

}

