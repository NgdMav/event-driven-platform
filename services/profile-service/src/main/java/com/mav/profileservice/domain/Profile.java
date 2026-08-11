package com.mav.profileservice.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {
    
    @Id
    private UUID userId;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "birth_date")
    private LocalDate birthDate;
    
    private String sex;
    
    @Column(name = "height_cm")
    private BigDecimal heightCm;
    
    @Column(name = "weight_kg")
    private BigDecimal weightKg;
    
    private String goal;
    
    @Column(name = "experience_level")
    private String experienceLevel;
    
    @Column(name = "activity_level")
    private String activityLevel;
    
    private String timezone;
    
    @Column(name = "privacy_level")
    private String privacyLevel;
    
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        
        if (privacyLevel == null) {
            privacyLevel = "PRIVATE";
        }
    }
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}