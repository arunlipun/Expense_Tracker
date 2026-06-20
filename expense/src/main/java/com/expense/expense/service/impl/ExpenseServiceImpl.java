package com.expense.expense.service.impl;

import com.expense.expense.dto.analytics.CategorySummaryResponse;
import com.expense.expense.dto.analytics.MonthlySummaryResponse;
import com.expense.expense.dto.analytics.RecentTransactionResponse;
import com.expense.expense.dto.analytics.UserSummaryResponse;
import com.expense.expense.dto.request.ExpenseCreateRequest;
import com.expense.expense.dto.request.ExpenseUpdateRequest;
import com.expense.expense.dto.response.AdminDashboardResponse;
import com.expense.expense.dto.response.ExpenseResponse;
import com.expense.expense.dto.response.UserDashboardResponse;
import com.expense.expense.entity.Expense;
import com.expense.expense.entity.User;
import com.expense.expense.enums.TransactionType;
import com.expense.expense.exception.ResourceNotFoundException;
import com.expense.expense.mapper.ExpenseMapper;
import com.expense.expense.repository.ExpenseRepository;
import com.expense.expense.repository.UserRepository;
import com.expense.expense.service.AiRecommendationService;
import com.expense.expense.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;
    private final UserRepository userRepository;
    private final AiRecommendationService aiRecommendationService;

    @Override
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ExpenseResponse createExpense(String userId, ExpenseCreateRequest request) {
        Expense expense = expenseMapper.toEntity(request);
        expense.setUserId(userId);
        expense.setCreatedAt(LocalDateTime.now());
        expense.setUpdatedAt(LocalDateTime.now());
        expense.setDeleted(false);

        Expense savedExpense = expenseRepository.save(expense);

        // 🔥 CALL AI AFTER SAVE
        aiRecommendationService.checkAndRecommend(userId);

        return expenseMapper.toResponse(savedExpense);
    }

    @Override
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<ExpenseResponse> getMyExpenses(String userId) {
        return expenseRepository.findByUserIdAndDeletedFalse(userId)
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    @Override
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ExpenseResponse getMyExpenseById(String userId, Long expenseId) {
        Expense expense = expenseRepository.findByIdAndUserIdAndDeletedFalse(expenseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        return expenseMapper.toResponse(expense);
    }

    @Override
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ExpenseResponse updateMyExpense(String userId, Long expenseId, ExpenseUpdateRequest request) {
        Expense expense = expenseRepository.findByIdAndUserIdAndDeletedFalse(expenseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDescription(request.getDescription());
        expense.setDate(request.getDate());
        expense.setType(request.getType());
        expense.setUpdatedAt(LocalDateTime.now());

        return expenseMapper.toResponse(expenseRepository.save(expense));
    }

    @Override
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public void deleteMyExpense(String userId, Long expenseId) {
        Expense expense = expenseRepository.findByIdAndUserIdAndDeletedFalse(expenseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        expense.setDeleted(true);
        expense.setUpdatedAt(LocalDateTime.now());
        expenseRepository.save(expense);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<ExpenseResponse> getAllExpensesForAdmin() {
        return expenseRepository.findByDeletedFalse()
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ExpenseResponse getAnyExpenseByIdForAdmin(Long expenseId) {
        Expense expense = expenseRepository.findByIdAndDeletedFalse(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        return expenseMapper.toResponse(expense);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteAnyExpenseByAdmin(Long expenseId) {
        Expense expense = expenseRepository.findByIdAndDeletedFalse(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        expense.setDeleted(true);
        expense.setUpdatedAt(LocalDateTime.now());
        expenseRepository.save(expense);
    }

    @Override
    @PreAuthorize("hasAnyRole('USER','ADMIN')")

    public UserDashboardResponse getUserDashboard(String userId) {

        User user = userRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Expense> expenses =
                expenseRepository.findByUserIdAndDeletedFalse(userId);

        double totalIncome = expenses.stream()
                .filter(e -> e.getType() == TransactionType.INCOME)
                .mapToDouble(Expense::getAmount)
                .sum();

        double totalExpense = expenses.stream()
                .filter(e -> e.getType() == TransactionType.EXPENSE)
                .mapToDouble(Expense::getAmount)
                .sum();


        // ✅ ADD HERE
        double expensePercentage = 0.0;

        if (totalIncome > 0) {
            expensePercentage = (totalExpense / totalIncome) * 100;
        }

        long totalIncomeTransactions = expenses.stream()
                .filter(e -> e.getType() == TransactionType.INCOME)
                .count();

        long totalExpenseTransactions = expenses.stream()
                .filter(e -> e.getType() == TransactionType.EXPENSE)
                .count();

        List<RecentTransactionResponse> recentTransactions =
                expenses.stream()
                        .sorted(
                                Comparator.comparing(
                                        Expense::getDate,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder()
                                        )
                                )
                        )
                        .limit(10)
                        .map(e -> new RecentTransactionResponse(
                                e.getId(),
                                e.getUserId(),
                                e.getTitle(),
                                e.getCategory() != null
                                        ? e.getCategory()
                                        : "UNCATEGORIZED",
                                e.getAmount(),
                                e.getType(),
                                e.getDate()
                        ))
                        .toList();

        List<CategorySummaryResponse> categoryWiseExpenses =
                expenses.stream()
                        .filter(e ->
                                e.getType() == TransactionType.EXPENSE
                        )
                        .collect(
                                java.util.stream.Collectors.groupingBy(
                                        e -> e.getCategory() != null
                                                && !e.getCategory().trim().isEmpty()
                                                ? e.getCategory()
                                                : "UNCATEGORIZED"
                                )
                        )
                        .entrySet()
                        .stream()
                        .map(entry ->
                                new CategorySummaryResponse(
                                        entry.getKey(),
                                        entry.getValue()
                                                .stream()
                                                .mapToDouble(
                                                        Expense::getAmount
                                                )
                                                .sum(),
                                        (long) entry.getValue().size()
                                )
                        )
                        .sorted(
                                Comparator.comparing(
                                        CategorySummaryResponse::getTotalAmount
                                ).reversed()
                        )
                        .toList();

        return UserDashboardResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .expensePercentage(expensePercentage)
                .balance(totalIncome - totalExpense)
                .totalTransactions((long) expenses.size())
                .totalIncomeTransactions(totalIncomeTransactions)
                .totalExpenseTransactions(totalExpenseTransactions)
                .recentTransactions(recentTransactions)
                .categoryWiseExpenses(categoryWiseExpenses)
                .premiumUser(user.getPremiumUser())
                .planType(user.getPlanType().name())
                .build();
    }





    @Override
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<ExpenseResponse> getMyIncome(String userId) {
        return expenseRepository.findByUserIdAndTypeAndDeletedFalse(userId, TransactionType.INCOME)
                .stream()
                .map(expenseMapper::toResponse)
                .toList();
    }

    @Override
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ExpenseResponse getMyIncomeById(String userId, Long expenseId) {
        Expense expense = expenseRepository.findByIdAndUserIdAndDeletedFalse(expenseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found"));

        if (expense.getType() != TransactionType.INCOME) {
            throw new ResourceNotFoundException("Income not found");
        }

        return expenseMapper.toResponse(expense);
    }











    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public AdminDashboardResponse getAdminDashboard() {
        List<Expense> allRecords = expenseRepository.findByDeletedFalse();
        List<User> allUsers = userRepository.findAll();

        double totalIncome = allRecords.stream()
                .filter(e -> e.getType() == TransactionType.INCOME)
                .mapToDouble(Expense::getAmount)
                .sum();

        double totalExpense = allRecords.stream()
                .filter(e -> e.getType() == TransactionType.EXPENSE)
                .mapToDouble(Expense::getAmount)
                .sum();

        long incomeCount = allRecords.stream()
                .filter(e -> e.getType() == TransactionType.INCOME)
                .count();

        long expenseCount = allRecords.stream()
                .filter(e -> e.getType() == TransactionType.EXPENSE)
                .count();

        List<RecentTransactionResponse> recentTransactions = allRecords.stream()
                .sorted(Comparator.comparing(Expense::getDate).reversed())
                .limit(10)
                .map(expense -> new RecentTransactionResponse(
                        expense.getId(),
                        expense.getUserId(),
                        expense.getTitle(),
                        expense.getCategory(),
                        expense.getAmount(),
                        expense.getType(),
                        expense.getDate()
                ))
                .toList();

        List<CategorySummaryResponse> categoryWiseExpenses = allRecords.stream()
                .filter(expense -> expense.getType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(Expense::getCategory))
                .entrySet()
                .stream()
                .map(entry -> new CategorySummaryResponse(
                        entry.getKey(),
                        entry.getValue().stream().mapToDouble(Expense::getAmount).sum(),
                        (long) entry.getValue().size()
                ))
                .sorted(Comparator.comparing(CategorySummaryResponse::getTotalAmount).reversed())
                .toList();

        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("yyyy-MM");

        List<MonthlySummaryResponse> monthlyTrend = allRecords.stream()
                .collect(Collectors.groupingBy(expense -> YearMonth.from(expense.getDate())))
                .entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    double monthlyIncome = entry.getValue().stream()
                            .filter(expense -> expense.getType() == TransactionType.INCOME)
                            .mapToDouble(Expense::getAmount)
                            .sum();

                    double monthlyExpense = entry.getValue().stream()
                            .filter(expense -> expense.getType() == TransactionType.EXPENSE)
                            .mapToDouble(Expense::getAmount)
                            .sum();

                    return new MonthlySummaryResponse(
                            entry.getKey().format(monthFormatter),
                            monthlyIncome,
                            monthlyExpense,
                            monthlyIncome - monthlyExpense
                    );
                })
                .toList();

        Map<Long, User> userMap = allUsers.stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        List<UserSummaryResponse> userWiseSummary = allRecords.stream()
                .collect(Collectors.groupingBy(Expense::getUserId))
                .entrySet()
                .stream()
                .map(entry -> {
                    String userId = entry.getKey();
                    List<Expense> userExpenses = entry.getValue();
                    User user = userMap.get(Long.valueOf(userId));

                    double userIncome = userExpenses.stream()
                            .filter(expense -> expense.getType() == TransactionType.INCOME)
                            .mapToDouble(Expense::getAmount)
                            .sum();

                    double userExpense = userExpenses.stream()
                            .filter(expense -> expense.getType() == TransactionType.EXPENSE)
                            .mapToDouble(Expense::getAmount)
                            .sum();

                    return new UserSummaryResponse(
                            userId,
                            user != null ? user.getName() : "Unknown User",
                            user != null ? user.getEmail() : "N/A",
                            userIncome,
                            userExpense,
                            userIncome - userExpense,
                            (long) userExpenses.size(),
                            user != null && Boolean.TRUE.equals(user.getPremiumUser()),
                            user != null && user.getPlanType() != null
                                    ? user.getPlanType().name()
                                    : "FREE"
                    );
                })
                .sorted(Comparator.comparing(UserSummaryResponse::getTotalTransactions).reversed())
                .toList();

        return AdminDashboardResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(totalIncome - totalExpense)
                .totalRecords((long) allRecords.size())
                .totalIncomeRecords(incomeCount)
                .totalExpenseRecords(expenseCount)
                .recentTransactions(recentTransactions)
                .categoryWiseExpenses(categoryWiseExpenses)
                .monthlyTrend(monthlyTrend)
                .userWiseSummary(userWiseSummary)
                .build();
    }
}