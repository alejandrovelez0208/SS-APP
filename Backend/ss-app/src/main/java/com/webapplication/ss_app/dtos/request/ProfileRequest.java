package com.webapplication.ss_app.dtos.request;

import java.io.Serializable;
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
import com.webapplication.ss_app.entity.Account;
import com.webapplication.ss_app.entity.Catalog;
import com.webapplication.ss_app.entity.ProfilePhoto;

import lombok.Data;

@Data
public class ProfileRequest implements Serializable {

	private static final long serialVersionUID = 2578369949288009893L;

	private Long id;
	private Account account;
	private String profileName;
	private Gender gender;
	private Integer age;
	private String hairColor;
	private Integer heightCm;
	private Integer weightKg;
	private Orientation orientation;
	private String country;
	private String city;
	private String phoneCountryCode;
	private boolean availableAllDay = false;
	private LocalTime scheduleFrom;
	private LocalTime scheduleTo;
	private String website;
	private BigDecimal basicRate;
	private String currency = "COP";
	private Set<Catalog> services = new HashSet<>();
	private Set<Catalog> departures = new HashSet<>();
	private Set<Catalog> channels = new HashSet<>();
	private Set<Catalog> modalities = new HashSet<>();
	private List<ProfilePhoto> photos = new ArrayList<>();
	private ProfileStatus status = ProfileStatus.DRAFT;
	private VerificationStatus verificationStatus = VerificationStatus.PENDING;
	private Instant createdAt;
	private Instant updatedAt;
	private String phoneNumber;
}
