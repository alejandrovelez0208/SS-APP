package com.webapplication.ss_app.dtos.response;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

import com.webapplication.ss_app.dtos.enums.Orientation;

import lombok.Data;

@Data
public class AdminProfileDetailDto implements Serializable {

	private static final long serialVersionUID = 8682050843238903943L;
	private String hairColor;
	private Integer heightCm;
	private Integer weightKg;
	private Orientation orientation;
	private String phoneCountryCode;
	private String phoneNumber;
	private String website;
	private BigDecimal basicRate;
	private String currency;
	private boolean availableAllDay;
	private LocalTime scheduleFrom;
	private LocalTime scheduleTo;
	private List<String> services;
	private List<String> departures;
	private List<String> channels;
	private List<String> modalities;
	private List<AdminProfilePhotoDto> photos;
}
