package com.webapplication.ss_app.service.interfaz;

import java.util.List;

import com.webapplication.ss_app.dtos.enums.AccountType;
import com.webapplication.ss_app.dtos.enums.ProfileStatus;
import com.webapplication.ss_app.dtos.enums.VerificationStatus;
import com.webapplication.ss_app.dtos.response.AdminProfileDetailDto;
import com.webapplication.ss_app.dtos.response.AdminProfilePageDto;
import com.webapplication.ss_app.dtos.response.AdminProfileSummaryDto;

public interface AdminProfileService {

	List<AdminProfileSummaryDto> getAllProfiles(String search, AccountType accountType, ProfileStatus status,
			VerificationStatus verificationStatus);

	AdminProfilePageDto getProfilesPage(String search, AccountType accountType, ProfileStatus status,
			VerificationStatus verificationStatus, int page, int size);

	AdminProfileDetailDto getById(Long id);

	AdminProfileSummaryDto updateStatus(Long id, ProfileStatus status);
}
