package com.expense.expense.controller;

import com.expense.expense.dto.response.ApiResponse;
import com.expense.expense.dto.response.UserDashboardResponse;
import com.expense.expense.security.CustomUserDetails;
import com.expense.expense.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user-dashboard")
@RequiredArgsConstructor
public class UserDashboardController {

    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserDashboardResponse>>
    getDashboard(
            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        UserDashboardResponse response =
                expenseService.getUserDashboard(
                        String.valueOf(userDetails.getUserId())
                );

        return ResponseEntity.ok(
                ApiResponse.success(

                        "Dashboard fetched successfully",
                        response
                )
        );
    }
}