package com.webapplication.ss_app.entity;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.webapplication.ss_app.dtos.enums.Gender;
import com.webapplication.ss_app.dtos.enums.Orientation;
import com.webapplication.ss_app.dtos.enums.ProfileStatus;
import com.webapplication.ss_app.dtos.enums.VerificationStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "profile")
public class Profile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "account_id", nullable = false)
	private Account account;

	@Column(nullable = false, length = 100)
	private String profileName;

	@Enumerated(EnumType.STRING)
	@Column(length = 20)
	private Gender gender;

	private Integer age;

	private String hairColor;

	private Integer heightCm;

	private Integer weightKg;

	@Enumerated(EnumType.STRING)
	@Column(length = 20)
	private Orientation orientation;

	private String country;

	private String city;

	@Column(name = "phone_country_code", length = 10)
	private String phoneCountryCode;

	@Column(name = "available_all_day", nullable = false)
	private boolean availableAllDay = false;

	@Column(name = "schedule_from")
	private LocalTime scheduleFrom;

	@Column(name = "schedule_to")
	private LocalTime scheduleTo;

	@Column(length = 255)
	private String website;

	@Column(name = "basic_rate", precision = 12, scale = 2)
	private BigDecimal basicRate;

	@Column(length = 3, nullable = false)
	private String currency = "COP";

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "profile_services", joinColumns = @JoinColumn(name = "profile_id"), inverseJoinColumns = @JoinColumn(name = "catalog_id"))
	private Set<Catalog> services = new HashSet<>();

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "profile_departures", joinColumns = @JoinColumn(name = "profile_id"), inverseJoinColumns = @JoinColumn(name = "catalog_id"))
	private Set<Catalog> departures = new HashSet<>();

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "profile_channels", joinColumns = @JoinColumn(name = "profile_id"), inverseJoinColumns = @JoinColumn(name = "catalog_id"))
	private Set<Catalog> channels = new HashSet<>();

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "profile_modalities", joinColumns = @JoinColumn(name = "profile_id"), inverseJoinColumns = @JoinColumn(name = "catalog_id"))
	private Set<Catalog> modalities = new HashSet<>();

	@OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("sortOrder ASC")
	private List<ProfilePhoto> photos = new ArrayList<>();

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private ProfileStatus status = ProfileStatus.DRAFT;

	@Enumerated(EnumType.STRING)
	@Column(name = "verification_status", nullable = false, length = 20)
	private VerificationStatus verificationStatus = VerificationStatus.PENDING;

	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	@Column(length = 30)
	private String phoneNumber;

	@Column(name = "completed_at")
	private Instant completedAt;

	@Column(length = 80)
	private String headline;

	@Column(name = "about_short", length = 280)
	private String aboutShort;

	@Column(name = "about_long", length = 1500)
	private String aboutLong;

	@Column(name = "bust_cm")
	private Integer bustCm;

	@Column(name = "waist_cm")
	private Integer waistCm;

	@Column(name = "hips_cm")
	private Integer hipsCm;

	@PrePersist
	void onCreate() {
		createdAt = updatedAt = Instant.now();
	}

	@PreUpdate
	void onUpdate() {
		updatedAt = Instant.now();
	}

	public boolean isVisible() {
		return status == ProfileStatus.ACTIVE && verificationStatus == VerificationStatus.VERIFIED;
	}
}
