package com.webapplication.ss_app.entity;

import java.util.List;

import com.webapplication.ss_app.dtos.enums.CommunicationChannels;
import com.webapplication.ss_app.dtos.enums.Gender;
import com.webapplication.ss_app.dtos.enums.Orientation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "escort_profiles")
public class EscortProfile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idProfile;

	@Column(length = 100, unique = true, nullable = false)
	private String companionName;

	@Enumerated(EnumType.STRING)
	private Gender gender;

	@Column(nullable = false)
	private Integer age;

	@Column(length = 30)
	private String hairColor;

	private Double height;

	private Double weight;

	@Enumerated(EnumType.STRING)
	private Orientation orientation;

	@Column(length = 50, nullable = false)
	private String nationality;

	@Column(length = 50, nullable = false)
	private String baseCity;

	@Enumerated(EnumType.STRING)
	private CommunicationChannels communicationChannels;

	private List<String> serviceTypes;

	private List<String> departures;

	@Column(nullable = false)
	private List<String> photos;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	private User ownerUser;
}
