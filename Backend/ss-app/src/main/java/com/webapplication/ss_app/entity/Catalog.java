package com.webapplication.ss_app.entity;

import com.webapplication.ss_app.dtos.enums.CatalogType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name = "catalog", uniqueConstraints = {
		@UniqueConstraint(name = "uk_catalog_type_name", columnNames = { "catalog_type", "name" }) })
public class Catalog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;

	@Column(nullable = false)
	private String name;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private CatalogType catalogType;

	@Column(name = "active", nullable = false)
	private Boolean active = true;
}
