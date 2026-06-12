package com.expense.expense.controller;

import com.expense.expense.dto.request.ExpenseCreateRequest;
import com.expense.expense.dto.request.ExpenseUpdateRequest;
import com.expense.expense.dto.response.ApiResponse;
import com.expense.expense.dto.response.ExpenseResponse;
import com.expense.expense.security.CustomUserDetails;
import com.expense.expense.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ExpenseCreateRequest request) {

        ExpenseResponse response =
                expenseService.createExpense(   String.valueOf(userDetails.getUserId()), request);

        return ResponseEntity.ok(
                ApiResponse.success("Expense created successfully", response)
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getMyExpenses(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        List<ExpenseResponse> response =
                expenseService.getMyExpenses(String.valueOf(userDetails.getUserId()));

        return ResponseEntity.ok(
                ApiResponse.success("Expenses fetched successfully", response)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getMyExpenseById(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {

        ExpenseResponse response =
                expenseService.getMyExpenseById( String.valueOf(userDetails.getUserId()), id);

        return ResponseEntity.ok(
                ApiResponse.success("Expense fetched successfully", response)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateMyExpense(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody ExpenseUpdateRequest request) {

        ExpenseResponse response =
                expenseService.updateMyExpense( String.valueOf(userDetails.getUserId()), id, request);

        return ResponseEntity.ok(
                ApiResponse.success("Expense updated successfully", response)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMyExpense(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {

        expenseService.deleteMyExpense( String.valueOf(userDetails.getUserId()), id);

        return ResponseEntity.ok(
                ApiResponse.success("Expense deleted successfully", null)
        );
    }
}