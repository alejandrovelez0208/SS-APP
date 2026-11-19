package com.webapplication.ss_app.service.impl;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.webapplication.ss_app.dtos.enums.AccountType;
import com.webapplication.ss_app.dtos.enums.ProfileStatus;
import com.webapplication.ss_app.dtos.enums.VerificationStatus;
import com.webapplication.ss_app.dtos.response.AdminProfileSummaryDto;
import com.webapplication.ss_app.entity.Account;
import com.webapplication.ss_app.entity.Profile;
import com.webapplication.ss_app.entity.User;
import com.webapplication.ss_app.repositories.interfaz.ProfileRepository;
import com.webapplication.ss_app.repositories.interfaz.ProfileRepository.ProfileCollectionCounts;
import com.webapplication.ss_app.service.interfaz.AdminProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminProfileServiceImpl implements AdminProfileService {

	private final ProfileRepository profileRepository;

	@Override
	@Transactional(readOnly = true)
	public List<AdminProfileSummaryDto> getAllProfiles(String search, AccountType accountType, ProfileStatus status,
			VerificationStatus verificationStatus) {
		String normalizedSearch = search == null ? "" : search.trim().toLowerCase();
		String searchPattern = "%" + normalizedSearch + "%";

		List<Profile> profiles = profileRepository.findAllForAdmin(searchPattern, accountType, status,
				verificationStatus);

		if (profiles.isEmpty()) {
			return List.of();
		}

		Map<Long, Profile> uniqueProfiles = new LinkedHashMap<>();
		for (Profile profile : profiles) {
			uniqueProfiles.putIfAbsent(profile.getId(), profile);
		}

		List<Long> profileIds = uniqueProfiles.keySet().stream().toList();
		Map<Long, ProfileCollectionCounts> countsByProfile = profileRepository.countServicesAndChannels(profileIds)
				.stream()
				.collect(Collectors.toMap(ProfileCollectionCounts::getProfileId, Function.identity()));

		return uniqueProfiles.values().stream()
				.map(profile -> toSummary(profile, countsByProfile.get(profile.getId())))
				.toList();
	}

	private AdminProfileSummaryDto toSummary(Profile profile, ProfileCollectionCounts counts) {
		Account account = profile.getAccount();
		User owner = account.getOwner();

		AdminProfileSummaryDto dto = new AdminProfileSummaryDto();

		dto.setId(profile.getId());
		dto.setProfileName(profile.getProfileName());
		dto.setHeadline(profile.getHeadline());
		dto.setGender(profile.getGender());
		dto.setAge(profile.getAge());
		dto.setCity(profile.getCity());
		dto.setCountry(profile.getCountry());
		dto.setStatus(profile.getStatus());
		dto.setVerificationStatus(profile.getVerificationStatus());
		dto.setCreatedAt(profile.getCreatedAt());
		dto.setUpdatedAt(profile.getUpdatedAt());

		dto.setAccountId(account.getIdAccount());
		dto.setAccountName(account.getUserName());
		dto.setAccountType(account.getType());
		dto.setAccountStatus(account.getStatus());

		if (owner != null) {
			dto.setAccountEmail(owner.getEmail());
			dto.setAccountEnabled(owner.isEnabled());
		}

		int photosCount = profile.getPhotos() == null ? 0 : profile.getPhotos().size();
		long servicesCount = counts == null ? 0 : counts.getServicesCount();
		long channelsCount = counts == null ? 0 : counts.getChannelsCount();

		dto.setPhotosCount(photosCount);
		dto.setCompletion(calculateCompletion(profile, photosCount, servicesCount, channelsCount));

		return dto;
	}

	private int calculateCompletion(Profile profile, int photosCount, long servicesCount, long channelsCount) {
		int percent = 0;

		if (isNotBlank(profile.getProfileName())
				&& profile.getGender() != null
				&& profile.getAge() != null
				&& profile.getAge() >= 18
				&& isNotBlank(profile.getCity())
				&& isNotBlank(profile.getCountry())) {
			percent += 20;
		}

		if (photosCount >= 3) {
			percent += 20;
		}

		if (isNotBlank(profile.getAboutShort()) && isNotBlank(profile.getAboutLong())) {
			percent += 15;
		}

		if (profile.getBasicRate() != null
				&& profile.getBasicRate().compareTo(BigDecimal.ZERO) > 0) {
			percent += 15;
		}

		if (servicesCount >= 1) {
			percent += 10;
		}

		if (profile.isAvailableAllDay()
				|| (profile.getScheduleFrom() != null && profile.getScheduleTo() != null)) {
			percent += 10;
		}

		if (isNotBlank(profile.getPhoneNumber()) && channelsCount >= 1) {
			percent += 10;
		}

		return percent;
	}

	private boolean isNotBlank(String value) {
		return value != null && !value.isBlank();
	}
}
