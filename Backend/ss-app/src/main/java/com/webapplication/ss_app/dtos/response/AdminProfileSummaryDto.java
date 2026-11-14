package com.webapplication.ss_app.dtos.response;

import java.io.Serializable;
import java.time.Instant;

import com.webapplication.ss_app.dtos.enums.AccountStatus;
import com.webapplication.ss_app.dtos.enums.AccountType;
import com.webapplication.ss_app.dtos.enums.Gender;
import com.webapplication.ss_app.dtos.enums.ProfileStatus;
import com.webapplication.ss_app.dtos.enums.VerificationStatus;

import lombok.Data;

@Data
public class AdminProfileSummaryDto implements Serializable {

	private static final long serialVersionUID = 8997949824348719561L;

	private Long id;
	private String profileName;
	private String headline;
	private Long accountId;
	private String accountName;
	private String accountEmail;
	private AccountType accountType;
	private boolean accountEnabled;
	private AccountStatus accountStatus;
	private Gender gender;
	private Integer age;
	private String city;
	private String country;
	private ProfileStatus status;
	private VerificationStatus verificationStatus;
	private int photosCount;
	private Integer completion;
	private Instant createdAt;
	private Instant updatedAt;
}
