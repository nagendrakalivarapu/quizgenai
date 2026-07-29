package com.quizgen.quizgenai.repository;

import com.quizgen.quizgenai.entity.Result;
import com.quizgen.quizgenai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByUser(User user);

}