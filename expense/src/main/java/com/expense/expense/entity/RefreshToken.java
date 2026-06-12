package com.expense.expense.entity;

import jakarta.persistence.*;
import lombok.*;


import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    @Column(length = 500, unique = true)
    private String token;
    private Instant expiryDate;
}