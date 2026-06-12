package com.expense.expense.controller;

import com.expense.expense.dto.response.AdminDashboardResponse;
import com.expense.expense.dto.response.ApiResponse;
import com.expense.expense.dto.response.ExpenseResponse;
import com.expense.expense.enums.ReportType;
import com.expense.expense.service.AdminDashboardService;
import com.expense.expense.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ExpenseService expenseService;
    private final AdminDashboardService adminDashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        AdminDashboardResponse response = adminDashboardService.getDashboard();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard fetched successfully", response));
    }

    @GetMapping("/expenses")
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getAllExpenses() {
        List<ExpenseResponse> response = expenseService.getAllExpensesForAdmin();
        return ResponseEntity.ok(ApiResponse.success("All expenses fetched successfully", response));
    }

    @GetMapping("/expenses/{id}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpenseById(@PathVariable Long  id) {
        ExpenseResponse response = expenseService.getAnyExpenseByIdForAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Expense fetched successfully", response));
    }

    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpenseByAdmin(@PathVariable Long id) {
        expenseService.deleteAnyExpenseByAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully", null));
    }

    @GetMapping("/reports/{type}")
    public ResponseEntity<byte[]> downloadReport(@PathVariable ReportType type) {
        byte[] csvData = adminDashboardService.downloadReport(type);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + type.name().toLowerCase() + "-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}