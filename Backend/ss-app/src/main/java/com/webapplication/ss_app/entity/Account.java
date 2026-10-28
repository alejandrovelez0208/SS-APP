package com.webapplication.ss_app.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.webapplication.ss_app.dtos.enums.AccountStatus;
import com.webapplication.ss_app.dtos.enums.AccountType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "account")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Account {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AccountType type;

	@Column(nullable = false)
	private String userName;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AccountStatus status = AccountStatus.ACTIVE;

	@OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Profile> profiles = new ArrayList<>();

	private Instant createdAt;

	private Instant updatedAt;

	@OneToOne(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
	private User owner;

	@PrePersist
	void onCreate() {
		createdAt = Instant.now();
	}
}
