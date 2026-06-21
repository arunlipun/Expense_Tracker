package com.expense.expense.repository;

import com.expense.expense.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface OtpVerificationRepository
        extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findTopByEmailOrderByIdDesc(String email);
    @Modifying
    @Transactional
    void deleteByEmail(String email);
}