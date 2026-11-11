package com.webapplication.ss_app.service.impl;

import java.time.Instant;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.webapplication.ss_app.dtos.enums.CatalogType;
import com.webapplication.ss_app.dtos.enums.ProfileStatus;
import com.webapplication.ss_app.dtos.request.ProfileUpdateRequest;
import com.webapplication.ss_app.dtos.response.ProfileResponse;
import com.webapplication.ss_app.entity.Catalog;
import com.webapplication.ss_app.entity.Profile;
import com.webapplication.ss_app.entity.User;
import com.webapplication.ss_app.exception.BusinessRuleException;
import com.webapplication.ss_app.exception.ResourceNotFoundException;
import com.webapplication.ss_app.repositories.interfaz.CatalogRepository;
import com.webapplication.ss_app.repositories.interfaz.ProfileRepository;
import com.webapplication.ss_app.repositories.interfaz.UserRepository;
import com.webapplication.ss_app.service.interfaz.ProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

	private final UserRepository userRepository;

	private final ProfileRepository profileRepository;

	private final CatalogRepository catalogRepository;

	@Override
	@Transactional(readOnly = true)
	public ProfileResponse getMyProfile(String email) {
		return toResponse(findProfile(email));
	}

	@Override
	@Transactional
	public ProfileResponse updateMyProfile(String email, ProfileUpdateRequest request) {
		Profile profile = findProfile(email);

		applyScalarFields(profile, request);
		applyCatalogSelections(profile, request);

		return toResponse(profileRepository.save(profile));
	}

	@Override
	@Transactional
	public ProfileResponse completeMyProfile(String email) {
		User user = findUser(email);
		Profile profile = findProfile(user);

		validateReadyToComplete(profile);

		profile.setCompletedAt(Instant.now());
		profile.setStatus(user.isEmailVerified() ? ProfileStatus.ACTIVE : ProfileStatus.DRAFT);

		return toResponse(profileRepository.save(profile));
	}

	private void applyScalarFields(Profile profile, ProfileUpdateRequest request) {
		if (request.getProfileName() != null) {
			profile.setProfileName(request.getProfileName().trim());
		}
		if (request.getGender() != null) {
			profile.setGender(request.getGender());
		}
		if (request.getAge() != null) {
			profile.setAge(request.getAge());
		}
		if (request.getHairColor() != null) {
			profile.setHairColor(request.getHairColor());
		}
		if (request.getHeightCm() != null) {
			profile.setHeightCm(request.getHeightCm());
		}
		if (request.getWeightKg() != null) {
			profile.setWeightKg(request.getWeightKg());
		}
		if (request.getOrientation() != null) {
			profile.setOrientation(request.getOrientation());
		}
		if (request.getCountry() != null) {
			profile.setCountry(request.getCountry());
		}
		if (request.getCity() != null) {
			profile.setCity(request.getCity());
		}
		if (request.getPhoneCountryCode() != null) {
			profile.setPhoneCountryCode(request.getPhoneCountryCode());
		}
		if (request.getPhoneNumber() != null) {
			profile.setPhoneNumber(request.getPhoneNumber());
		}
		if (request.getAvailableAllDay() != null) {
			profile.setAvailableAllDay(request.getAvailableAllDay());
		}
		if (request.getScheduleFrom() != null) {
			profile.setScheduleFrom(request.getScheduleFrom());
		}
		if (request.getScheduleTo() != null) {
			profile.setScheduleTo(request.getScheduleTo());
		}
		if (request.getWebsite() != null) {
			profile.setWebsite(request.getWebsite());
		}
		if (request.getBasicRate() != null) {
			profile.setBasicRate(request.getBasicRate());
		}
		if (request.getCurrency() != null) {
			profile.setCurrency(request.getCurrency());
		}

		if (request.getHeadline() != null) {
			profile.setHeadline(request.getHeadline().trim());
		}
		if (request.getAboutShort() != null) {
			profile.setAboutShort(request.getAboutShort().trim());
		}
		if (request.getAboutLong() != null) {
			profile.setAboutLong(request.getAboutLong().trim());
		}
		if (request.getBustCm() != null) {
			profile.setBustCm(request.getBustCm());
		}
		if (request.getWaistCm() != null) {
			profile.setWaistCm(request.getWaistCm());
		}
		if (request.getHipsCm() != null) {
			profile.setHipsCm(request.getHipsCm());
		}
	}

	private void applyCatalogSelections(Profile profile, ProfileUpdateRequest request) {
		if (request.getServiceIds() != null) {
			profile.setServices(resolveCatalogs(request.getServiceIds(), CatalogType.SERVICE));
		}
		if (request.getDepartureIds() != null) {
			profile.setDepartures(resolveCatalogs(request.getDepartureIds(), CatalogType.TRAVEL));
		}
		if (request.getChannelIds() != null) {
			profile.setChannels(resolveCatalogs(request.getChannelIds(), CatalogType.CHANNEL));
		}
		if (request.getModalityIds() != null) {
			profile.setModalities(resolveCatalogs(request.getModalityIds(), CatalogType.MODALITY));
		}
	}

	private Set<Catalog> resolveCatalogs(Set<Long> ids, CatalogType expected) {
		if (ids.isEmpty()) {
			return new HashSet<>();
		}

		List<Catalog> found = catalogRepository.findAllById(ids);

		if (found.size() != ids.size()) {
			throw new ResourceNotFoundException("Some catalog items were not found");
		}

		for (Catalog catalog : found) {
			if (catalog.getCatalogType() != expected) {
				throw new BusinessRuleException("Catalog item '" + catalog.getName() + "' is not of type " + expected);
			}
			if (!Boolean.TRUE.equals(catalog.getActive())) {
				throw new BusinessRuleException("Catalog item '" + catalog.getName() + "' is inactive");
			}
		}

		return new HashSet<>(found);
	}

	private void validateReadyToComplete(Profile profile) {
		List<String> missing = new java.util.ArrayList<>();

		require(profile.getProfileName(), "profile name", missing);
		require(profile.getGender(), "gender", missing);
		require(profile.getAge(), "age", missing);
		require(profile.getHeightCm(), "height", missing);
		require(profile.getWeightKg(), "weight", missing);
		require(profile.getOrientation(), "orientation", missing);
		require(profile.getCountry(), "origin country", missing);
		require(profile.getCity(), "base city", missing);
		require(profile.getPhoneNumber(), "phone number", missing);
		require(profile.getBasicRate(), "basic rate", missing);

		if (profile.getServices() == null || profile.getServices().isEmpty()) {
			missing.add("at least one service");
		}
		if (profile.getChannels() == null || profile.getChannels().isEmpty()) {
			missing.add("at least one contact channel");
		}

		if (!missing.isEmpty()) {
			throw new BusinessRuleException("Profile is not complete: " + String.join(", ", missing));
		}
	}

	private void require(Object value, String label, List<String> missing) {
		if (Objects.isNull(value) || (value instanceof String text && text.isBlank())) {
			missing.add(label);
		}
	}

	private Profile findProfile(String email) {
		return findProfile(findUser(email));
	}

	private Profile findProfile(User user) {
		return profileRepository.findFirstByAccount_IdAccount(user.getAccount().getIdAccount())
				.orElseThrow(() -> new ResourceNotFoundException("Profile not found for this account"));
	}

	private User findUser(String email) {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
	}

	private ProfileResponse toResponse(Profile profile) {
		return ProfileResponse.builder().id(profile.getId()).profileName(profile.getProfileName())
				.gender(profile.getGender()).age(profile.getAge()).hairColor(profile.getHairColor())
				.heightCm(profile.getHeightCm()).weightKg(profile.getWeightKg()).orientation(profile.getOrientation())
				.country(profile.getCountry()).city(profile.getCity()).phoneCountryCode(profile.getPhoneCountryCode())
				.phoneNumber(profile.getPhoneNumber()).availableAllDay(profile.isAvailableAllDay())
				.scheduleFrom(profile.getScheduleFrom()).scheduleTo(profile.getScheduleTo())
				.website(profile.getWebsite()).basicRate(profile.getBasicRate()).currency(profile.getCurrency())
				.serviceIds(idsOf(profile.getServices())).departureIds(idsOf(profile.getDepartures()))
				.channelIds(idsOf(profile.getChannels())).modalityIds(idsOf(profile.getModalities()))
				.status(profile.getStatus()).verificationStatus(profile.getVerificationStatus())
				.completedAt(profile.getCompletedAt()).updatedAt(profile.getUpdatedAt())
				.complete(profile.getCompletedAt() != null).headline(profile.getHeadline())
				.aboutShort(profile.getAboutShort()).aboutLong(profile.getAboutLong())
				.bustCm(profile.getBustCm()).waistCm(profile.getWaistCm()).hipsCm(profile.getHipsCm())
				.build();
	}

	private Set<Long> idsOf(Set<Catalog> catalogs) {
		if (catalogs == null) {
			return Collections.emptySet();
		}
		return catalogs.stream().map(Catalog::getId).collect(java.util.stream.Collectors.toSet());
	}
}
