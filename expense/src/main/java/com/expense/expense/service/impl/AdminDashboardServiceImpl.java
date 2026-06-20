
package com.expense.expense.service.impl;

import com.expense.expense.dto.analytics.CategorySummaryResponse;
import com.expense.expense.dto.analytics.MonthlySummaryResponse;
import com.expense.expense.dto.analytics.RecentTransactionResponse;
import com.expense.expense.dto.analytics.UserSummaryResponse;
import com.expense.expense.dto.response.AdminDashboardResponse;
import com.expense.expense.entity.Expense;
import com.expense.expense.entity.User;
import com.expense.expense.enums.PlanType;
import com.expense.expense.enums.ReportType;
import com.expense.expense.enums.TransactionType;
import com.expense.expense.repository.ExpenseRepository;
import com.expense.expense.repository.UserRepository;
import com.expense.expense.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public AdminDashboardResponse getDashboard() {
        List<Expense> expenses = expenseRepository.findByDeletedFalse();
        List<User> users = userRepository.findAll();


        long totalUsers = users.size();

        long totalPremiumUsers = users.stream()
                .filter(user -> Boolean.TRUE.equals(user.getPremiumUser()))
                .count();

        long totalFreeUsers = users.stream()
                .filter(user -> !Boolean.TRUE.equals(user.getPremiumUser()))
                .count();

        long monthlyPlanUsers = users.stream()
                .filter(user -> user.getPlanType() == PlanType.MONTHLY)
                .count();

        long yearlyPlanUsers = users.stream()
                .filter(user -> user.getPlanType() == PlanType.YEARLY)
                .count();


        double totalIncome = expenses.stream()
                .filter(e -> e.getType() == TransactionType.INCOME)
                .mapToDouble(Expense::getAmount)
                .sum();

        double totalExpense = expenses.stream()
                .filter(e -> e.getType() == TransactionType.EXPENSE)
                .mapToDouble(Expense::getAmount)
                .sum();

        long totalIncomeTransactions = expenses.stream()
                .filter(e -> e.getType() == TransactionType.INCOME)
                .count();

        long totalExpenseTransactions = expenses.stream()
                .filter(e -> e.getType() == TransactionType.EXPENSE)
                .count();

        List<RecentTransactionResponse> recentTransactions = expenses.stream()
                .sorted(Comparator.comparing(
                        Expense::getDate,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .limit(10)
                .map(e -> new RecentTransactionResponse(
                        e.getId(),
                        e.getUserId(),
                        e.getTitle(),
                        e.getCategory() != null ? e.getCategory() : "UNCATEGORIZED",
                        e.getAmount(),
                        e.getType(),
                        e.getDate()
                ))
                .toList();

        List<CategorySummaryResponse> categoryWiseExpenses = expenses.stream()
                .filter(e -> e.getType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        e -> e.getCategory() != null && !e.getCategory().trim().isEmpty()
                                ? e.getCategory()
                                : "UNCATEGORIZED"
                ))
                .entrySet()
                .stream()
                .map(entry -> new CategorySummaryResponse(
                        entry.getKey(),
                        entry.getValue().stream().mapToDouble(Expense::getAmount).sum(),
                        (long) entry.getValue().size()
                ))
                .sorted(Comparator.comparing(CategorySummaryResponse::getTotalAmount).reversed())
                .toList();

        List<MonthlySummaryResponse> monthlyTrend = buildMonthlyTrend(expenses);
        List<UserSummaryResponse> userWiseSummary = buildUserWiseSummary(expenses, users);

        return new AdminDashboardResponse(
                totalIncome,
                totalExpense,
                totalIncome - totalExpense,
                (long) expenses.size(),
                totalIncomeTransactions,
                totalExpenseTransactions,
                totalUsers,
                totalPremiumUsers,
                totalFreeUsers,
                monthlyPlanUsers,
                yearlyPlanUsers,
                recentTransactions,
                categoryWiseExpenses,
                monthlyTrend,
                userWiseSummary
        );
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public byte[] downloadReport(ReportType reportType) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate;

        switch (reportType) {
            case WEEKLY -> startDate = now.minusWeeks(1);
            case MONTHLY -> startDate = now.minusMonths(1);
            case YEARLY -> startDate = now.minusYears(1);
            default -> throw new IllegalArgumentException("Invalid report type");
        }

        List<Expense> expenses = expenseRepository.findByDateBetweenAndDeletedFalse(startDate, now);

        StringBuilder csv = new StringBuilder();
        csv.append("Id,UserId,Title,Category,Amount,Type,Date\n");

        for (Expense expense : expenses) {
            csv.append(safe(String.valueOf(expense.getId()))).append(",")
                    .append(safe(expense.getUserId())).append(",")
                    .append(safe(expense.getTitle())).append(",")
                    .append(safe(expense.getCategory())).append(",")
                    .append(expense.getAmount()).append(",")
                    .append(expense.getType() != null ? expense.getType() : "").append(",")
                    .append(expense.getDate() != null ? expense.getDate() : "").append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private List<MonthlySummaryResponse> buildMonthlyTrend(List<Expense> expenses) {
        Map<String, List<Expense>> monthlyMap = expenses.stream()
                .filter(e -> e.getDate() != null)
                .collect(Collectors.groupingBy(
                        e -> e.getDate().getYear() + "-" + String.format("%02d", e.getDate().getMonthValue())
                ));

        return monthlyMap.entrySet().stream()
                .map(entry -> {
                    double income = entry.getValue().stream()
                            .filter(e -> e.getType() == TransactionType.INCOME)
                            .mapToDouble(Expense::getAmount)
                            .sum();

                    double expense = entry.getValue().stream()
                            .filter(e -> e.getType() == TransactionType.EXPENSE)
                            .mapToDouble(Expense::getAmount)
                            .sum();

                    return new MonthlySummaryResponse(
                            entry.getKey(),
                            income,
                            expense,
                            income - expense
                    );
                })
                .sorted(Comparator.comparing(MonthlySummaryResponse::getMonth))
                .toList();
    }

    private List<UserSummaryResponse> buildUserWiseSummary(List<Expense> expenses, List<User> users) {
        Map<Long, User> userMap = users.stream()
                .filter(user -> user.getId() != null)
                .collect(Collectors.toMap(
                        User::getId,
                        Function.identity(),
                        (existing, replacement) -> existing
                ));

        Map<String, List<Expense>> grouped = expenses.stream()
                .filter(expense -> expense.getUserId() != null)
                .collect(Collectors.groupingBy(Expense::getUserId));

        return grouped.entrySet().stream()
                .map(entry -> {
                    String userId = entry.getKey();
                    User user = userMap.get(Long.valueOf(userId));

                    double income = entry.getValue().stream()
                            .filter(e -> e.getType() == TransactionType.INCOME)
                            .mapToDouble(Expense::getAmount)
                            .sum();

                    double expense = entry.getValue().stream()
                            .filter(e -> e.getType() == TransactionType.EXPENSE)
                            .mapToDouble(Expense::getAmount)
                            .sum();

                    return new UserSummaryResponse(
                            userId,
                            user != null ? user.getName() : "Unknown",
                            user != null ? user.getEmail() : "N/A",
                            income,
                            expense,
                            income - expense,
                            (long) entry.getValue().size(),
                            user != null ? user.getPremiumUser() : false,
                            user != null ? user.getPlanType().name() : "FREE"
                    );
                })
                .sorted(Comparator.comparing(UserSummaryResponse::getTotalTransactions).reversed())
                .toList();
    }

    private String safe(String value) {
        if (value == null) return "";
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}