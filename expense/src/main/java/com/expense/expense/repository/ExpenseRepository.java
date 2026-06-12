package com.expense.expense.repository;

import com.expense.expense.entity.Expense;
import com.expense.expense.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserIdAndDeletedFalse(String userId);

    Optional<Expense> findByIdAndDeletedFalse(Long id);

    Optional<Expense> findByIdAndUserIdAndDeletedFalse(Long id, String userId);

    List<Expense> findByUserIdAndDateBetweenAndDeletedFalse(String userId, LocalDateTime start, LocalDateTime end);

    List<Expense> findByDateBetweenAndDeletedFalse(LocalDateTime start, LocalDateTime end);

    List<Expense> findByTypeAndDeletedFalse(TransactionType type);

    List<Expense> findByUserIdAndTypeAndDeletedFalse(String userId, TransactionType type);

    List<Expense> findByDeletedFalse();
    List<Expense> findTop10ByDeletedFalseOrderByDateDesc();


}