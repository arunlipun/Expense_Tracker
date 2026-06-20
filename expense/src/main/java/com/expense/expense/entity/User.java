package com.expense.expense.entity;



import com.expense.expense.enums.PlanType;
import com.expense.expense.enums.Role;
import jakarta.persistence.*;
import lombok.*;



import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();


    private Boolean enabled = true;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PlanType planType = PlanType.FREE;

    @Builder.Default
    private Boolean premiumUser = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}