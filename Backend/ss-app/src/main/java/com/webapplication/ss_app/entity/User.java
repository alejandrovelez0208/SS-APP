package com.webapplication.ss_app.entity;

import java.util.ArrayList;
import java.util.List;

import com.webapplication.ss_app.dtos.enums.AccountType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idUsers;

	private String email;
	private String password;

	@Enumerated(EnumType.STRING)
	private AccountType accountType;

	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private AgencyDetails agencyDetails;

	/*
	 * Relación con los perfiles de acompañantes - Un independiente tendrá una lista
	 * con 1 solo elemento. - Una agencia tendrá una lista con N elementos.
	 */
	@OneToMany(mappedBy = "ownerUser", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<EscortProfile> escortProfiles = new ArrayList<>();
}
