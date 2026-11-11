package com.webapplication.ss_app.dtos.response;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalTime;
import java.util.Set;

import com.webapplication.ss_app.dtos.enums.Gender;
import com.webapplication.ss_app.dtos.enums.Orientation;
import com.webapplication.ss_app.dtos.enums.ProfileStatus;
import com.webapplication.ss_app.dtos.enums.VerificationStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long id;
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
	private String phoneNumber;
	private boolean availableAllDay;
	private LocalTime scheduleFrom;
	private LocalTime scheduleTo;
	private String website;
	private BigDecimal basicRate;
	private String currency;

	private Set<Long> serviceIds;
	private Set<Long> departureIds;
	private Set<Long> channelIds;
	private Set<Long> modalityIds;

	private ProfileStatus status;
	private VerificationStatus verificationStatus;
	private Instant completedAt;
	private Instant updatedAt;
	private boolean complete;
	private String headline;
	private String aboutShort;
	private String aboutLong;
	private Integer bustCm;
	private Integer waistCm;
	private Integer hipsCm;
}
