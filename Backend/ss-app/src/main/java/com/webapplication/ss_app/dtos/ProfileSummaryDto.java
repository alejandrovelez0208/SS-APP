package com.webapplication.ss_app.dtos;

import java.io.Serializable;

import com.webapplication.ss_app.dtos.enums.Gender;
import com.webapplication.ss_app.dtos.enums.ProfileStatus;
import com.webapplication.ss_app.dtos.enums.VerificationStatus;

import lombok.Data;

/**
 * Resumen de un perfil perteneciente a una cuenta.
 */
@Data
public class ProfileSummaryDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long id;
	private String profileName;
	private Gender gender;
	private Integer age;
	private String city;
	private String country;
	private ProfileStatus status;
	private VerificationStatus verificationStatus;
	private String phoneNumber;
	private int photosCount;
}
