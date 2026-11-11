package com.webapplication.ss_app.dtos.request;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.Set;

import com.webapplication.ss_app.dtos.enums.Gender;
import com.webapplication.ss_app.dtos.enums.Orientation;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Actualización parcial del perfil. Los campos nulos no se modifican. Los
 * conjuntos nulos tampoco; un conjunto vacío limpia la selección.
 */
@Data
public class ProfileUpdateRequest implements Serializable {

	private static final long serialVersionUID = 1L;

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
	private Boolean availableAllDay;
	private LocalTime scheduleFrom;
	private LocalTime scheduleTo;
	private String website;
	private BigDecimal basicRate;
	private String currency;

	private Set<Long> serviceIds;
	private Set<Long> departureIds;
	private Set<Long> channelIds;
	private Set<Long> modalityIds;

	@Size(max = 80, message = "Headline must not exceed 80 characters")
	private String headline;

	@Size(max = 280, message = "Short description must not exceed 280 characters")
	private String aboutShort;

	@Size(max = 1500, message = "About me must not exceed 1500 characters")
	private String aboutLong;

	@Min(value = 20, message = "Bust must be at least 20 cm")
	@Max(value = 300, message = "Bust must not exceed 300 cm")
	private Integer bustCm;

	@Min(value = 20, message = "Waist must be at least 20 cm")
	@Max(value = 300, message = "Waist must not exceed 300 cm")
	private Integer waistCm;

	@Min(value = 20, message = "Hips must be at least 20 cm")
	@Max(value = 300, message = "Hips must not exceed 300 cm")
	private Integer hipsCm;
}
