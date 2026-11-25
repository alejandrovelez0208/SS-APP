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
import com.webapplication.ss_app.dtos.response.AdminProfileDetailDto;
import com.webapplication.ss_app.dtos.response.AdminProfilePhotoDto;
import com.webapplication.ss_app.dtos.response.AdminProfileSummaryDto;
import com.webapplication.ss_app.entity.Account;
import com.webapplication.ss_app.entity.Catalog;
import com.webapplication.ss_app.entity.Profile;
import com.webapplication.ss_app.entity.ProfilePhoto;
import com.webapplication.ss_app.entity.User;
import com.webapplication.ss_app.exception.BusinessRuleException;
import com.webapplication.ss_app.exception.InvalidProfileStatusException;
import com.webapplication.ss_app.exception.ResourceNotFoundException;
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

	@Override
	@Transactional(readOnly = true)
	public AdminProfileDetailDto getById(Long id) {
		Profile profile = profileRepository.findByIdWithAccountAndPhotos(id)
				.orElseThrow(() -> new ResourceNotFoundException("Profile not found: " + id));

		List<Catalog> services = profileRepository.findServicesByProfileId(id);
		List<Catalog> departures = profileRepository.findDeparturesByProfileId(id);
		List<Catalog> channels = profileRepository.findChannelsByProfileId(id);
		List<Catalog> modalities = profileRepository.findModalitiesByProfileId(id);

		int photosCount = profile.getPhotos() == null ? 0 : profile.getPhotos().size();

		AdminProfileDetailDto dto = new AdminProfileDetailDto();
		fillSummaryFields(dto, profile, photosCount, services.size(), channels.size());

		dto.setHairColor(profile.getHairColor());
		dto.setHeightCm(profile.getHeightCm());
		dto.setWeightKg(profile.getWeightKg());
		dto.setOrientation(profile.getOrientation());
		dto.setPhoneCountryCode(profile.getPhoneCountryCode());
		dto.setPhoneNumber(profile.getPhoneNumber());
		dto.setWebsite(profile.getWebsite());
		dto.setBasicRate(profile.getBasicRate());
		dto.setCurrency(profile.getCurrency());
		dto.setAvailableAllDay(profile.isAvailableAllDay());
		dto.setScheduleFrom(profile.getScheduleFrom());
		dto.setScheduleTo(profile.getScheduleTo());
		dto.setServices(namesOf(services));
		dto.setDepartures(namesOf(departures));
		dto.setChannels(namesOf(channels));
		dto.setModalities(namesOf(modalities));
		dto.setPhotos(profile.getPhotos() == null ? List.of()
				: profile.getPhotos().stream().map(this::toPhotoDto).toList());

		return dto;
	}

	@Override
	@Transactional
	public AdminProfileSummaryDto updateStatus(Long id, ProfileStatus status) {
		if (status != ProfileStatus.ACTIVE && status != ProfileStatus.PAUSED && status != ProfileStatus.INACTIVE) {
			throw new InvalidProfileStatusException("Only ACTIVE, PAUSED or INACTIVE are allowed");
		}

		Profile profile = profileRepository.findByIdWithAccountAndPhotos(id)
				.orElseThrow(() -> new ResourceNotFoundException("Profile not found: " + id));

		if (profile.getStatus() == status) {
			return toSummary(profile, countsFor(id));
		}

		validateTransition(profile, status);

		profile.setStatus(status);
		profileRepository.save(profile);

		return toSummary(profile, countsFor(id));
	}

	private ProfileCollectionCounts countsFor(Long id) {
		return profileRepository.countServicesAndChannels(List.of(id)).stream().findFirst().orElse(null);
	}

	private void validateTransition(Profile profile, ProfileStatus target) {
		ProfileStatus current = profile.getStatus();

		switch (target) {
			case PAUSED -> {
				if (current != ProfileStatus.ACTIVE) {
					throw new BusinessRuleException("Only ACTIVE profiles can be paused.");
				}
			}
			case ACTIVE -> {
				if (current == ProfileStatus.INACTIVE) {
					if (profile.getVerificationStatus() == VerificationStatus.REJECTED) {
						throw new BusinessRuleException("A rejected profile cannot be reactivated.");
					}
					if (profile.getCompletedAt() == null) {
						throw new BusinessRuleException("An incomplete profile cannot be reactivated.");
					}
				} else if (current == ProfileStatus.DRAFT) {
					if (profile.getCompletedAt() == null) {
						throw new BusinessRuleException("An incomplete profile cannot be activated.");
					}
					if (profile.getVerificationStatus() != VerificationStatus.VERIFIED) {
						throw new BusinessRuleException("A profile must be verified before it can be activated.");
					}
				} else if (current != ProfileStatus.PAUSED) {
					throw new BusinessRuleException("Only PAUSED, INACTIVE or DRAFT profiles can be activated.");
				}
			}
			case INACTIVE -> {
				if (current != ProfileStatus.ACTIVE && current != ProfileStatus.PAUSED) {
					throw new BusinessRuleException("Only ACTIVE or PAUSED profiles can be deactivated.");
				}
			}
			default -> throw new InvalidProfileStatusException("Only ACTIVE, PAUSED or INACTIVE are allowed");
		}
	}

	private AdminProfileSummaryDto toSummary(Profile profile, ProfileCollectionCounts counts) {
		int photosCount = profile.getPhotos() == null ? 0 : profile.getPhotos().size();
		long servicesCount = counts == null ? 0 : counts.getServicesCount();
		long channelsCount = counts == null ? 0 : counts.getChannelsCount();

		AdminProfileSummaryDto dto = new AdminProfileSummaryDto();
		fillSummaryFields(dto, profile, photosCount, servicesCount, channelsCount);
		return dto;
	}

	private void fillSummaryFields(AdminProfileSummaryDto dto, Profile profile, int photosCount, long servicesCount,
			long channelsCount) {
		Account account = profile.getAccount();
		User owner = account.getOwner();

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

		dto.setPhotosCount(photosCount);
		dto.setCompletion(calculateCompletion(profile, photosCount, servicesCount, channelsCount));
		dto.setComplete(profile.getCompletedAt() != null);
	}

	private List<String> namesOf(List<Catalog> catalogs) {
		return catalogs.stream().map(Catalog::getName).toList();
	}

	private AdminProfilePhotoDto toPhotoDto(ProfilePhoto photo) {
		AdminProfilePhotoDto dto = new AdminProfilePhotoDto();
		dto.setId(photo.getId());
		dto.setUrl(photo.getUrl());
		dto.setPrimaryPhoto(photo.isPrimaryPhoto());
		dto.setSortOrder(photo.getSortOrder());
		dto.setVisibility(photo.getVisibility());
		dto.setModerationStatus(photo.getModerationStatus());
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
