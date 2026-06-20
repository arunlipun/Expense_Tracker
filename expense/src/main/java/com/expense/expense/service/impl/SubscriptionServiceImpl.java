package com.expense.expense.service.impl;

import com.expense.expense.entity.Subscription;
import com.expense.expense.entity.User;
import com.expense.expense.enums.PlanType;
import com.expense.expense.repository.SubscriptionRepository;
import com.expense.expense.repository.UserRepository;
import com.expense.expense.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;


    public void activateSubscription(Long userId, PlanType planType, double amount) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. deactivate old subscriptions
        List<Subscription> oldSubs =
                subscriptionRepository.findByUserIdAndActiveTrue(userId);

        for (Subscription sub : oldSubs) {
            sub.setActive(false);
        }
        subscriptionRepository.saveAll(oldSubs);

        // 2. create new subscription
        Subscription subscription = new Subscription();
        subscription.setUserId(userId);
        subscription.setPlanType(planType);
        subscription.setAmount(amount);
        subscription.setStartDate(LocalDateTime.now());

        subscription.setEndDate(
                planType == PlanType.MONTHLY
                        ? LocalDateTime.now().plusMonths(1)
                        : LocalDateTime.now().plusYears(1)
        );

        subscription.setActive(true);

        subscriptionRepository.save(subscription);

        // 3. update user
        user.setPremiumUser(true);
        user.setPlanType(planType);
        userRepository.save(user);
    }
}