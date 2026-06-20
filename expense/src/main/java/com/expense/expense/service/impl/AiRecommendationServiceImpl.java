package com.expense.expense.service.impl;

import com.expense.expense.entity.Expense;
import com.expense.expense.enums.TransactionType;
import com.expense.expense.repository.ExpenseRepository;
import com.expense.expense.service.AiRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiRecommendationServiceImpl implements AiRecommendationService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Override
    public void checkAndRecommend(String userId) {

        List<Expense> expenses = expenseRepository.findByUserIdAndDeletedFalse(userId);
        double totalIncome = expenses.stream()
                .filter(e -> e.getType() == TransactionType.INCOME)
                .mapToDouble(Expense::getAmount)
                .sum();
        double totalExpense = expenses.stream()
                .filter(e -> e.getType() == TransactionType.EXPENSE)
                .mapToDouble(Expense::getAmount)
                .sum();

        if (totalIncome <= 0) {
            return;
        }



        double expensePercentage = (totalExpense / totalIncome) * 100;
        if(expensePercentage > 85){
            System.out.println("🚨 Critical Alert");
        }
        else if(expensePercentage >= 70){
            System.out.println("⚠ Warning");
        }
        else{
            System.out.println("✅ Safe");
        }
    }
}
