package com.webapplication.ss_app.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "user")
public class User {

	@Id
	@GeneratedValue
	@EqualsAndHashCode.Include
	private Long id;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String password;

	private boolean enabled = true;

	private Instant createdAt;

	private Instant lastLoginAt;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "account_id", nullable = false, unique = true)
	private Account account;
}
