package pl.dmcs.springbootjsp_iwa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.dmcs.springbootjsp_iwa.model.Lesson;

@Repository
public interface LessonRepository extends JpaRepository<Lesson,Long>{
    Lesson findById(long id);

}
