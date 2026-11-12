package com.webapplication.ss_app.service.interfaz;

import com.webapplication.ss_app.dtos.enums.ProfileStatus;
import com.webapplication.ss_app.dtos.request.ProfileUpdateRequest;
import com.webapplication.ss_app.dtos.response.ProfileResponse;

public interface ProfileService {

	ProfileResponse getMyProfile(String email);

	ProfileResponse updateMyProfile(String email, ProfileUpdateRequest request);

	ProfileResponse completeMyProfile(String email);
	
	ProfileResponse updateMyProfileStatus(String email, ProfileStatus status);
}
