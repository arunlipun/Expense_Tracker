package com.expense.expense.service;

import com.expense.expense.dto.request.ExpenseCreateRequest;
import com.expense.expense.dto.request.ExpenseUpdateRequest;
import com.expense.expense.dto.response.AdminDashboardResponse;
import com.expense.expense.dto.response.ExpenseResponse;
import com.expense.expense.dto.response.UserDashboardResponse;

import java.util.List;

public interface ExpenseService {

    ExpenseResponse createExpense(String userId, ExpenseCreateRequest request);

    List<ExpenseResponse> getMyExpenses(String userId);

    ExpenseResponse getMyExpenseById(String userId, Long expenseId);

    ExpenseResponse updateMyExpense(String userId, Long expenseId, ExpenseUpdateRequest request);

    void deleteMyExpense(String userId, Long expenseId);

    List<ExpenseResponse> getAllExpensesForAdmin();

    ExpenseResponse getAnyExpenseByIdForAdmin(Long expenseId);

    void deleteAnyExpenseByAdmin(Long expenseId);

    AdminDashboardResponse getAdminDashboard();

    List<ExpenseResponse> getMyIncome(String userId);

    ExpenseResponse getMyIncomeById(String userId, Long expenseId);

    UserDashboardResponse getUserDashboard(String userId);
}