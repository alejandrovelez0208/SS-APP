package com.webapplication.ss_app.service.impl;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.webapplication.ss_app.dtos.ProfileSummaryDto;
import com.webapplication.ss_app.dtos.UserDetailDto;
import com.webapplication.ss_app.dtos.UserDto;
import com.webapplication.ss_app.dtos.request.UserRequest;
import com.webapplication.ss_app.dtos.response.MessageResponse;
import com.webapplication.ss_app.dtos.enums.Role;
import com.webapplication.ss_app.entity.Account;
import com.webapplication.ss_app.entity.Profile;
import com.webapplication.ss_app.entity.User;
import com.webapplication.ss_app.exception.BusinessRuleException;
import com.webapplication.ss_app.exception.EmailAlreadyExistsException;
import com.webapplication.ss_app.exception.ResourceNotFoundException;
import com.webapplication.ss_app.repositories.interfaz.AccountRepository;
import com.webapplication.ss_app.repositories.interfaz.ProfileRepository;
import com.webapplication.ss_app.repositories.interfaz.UserRepository;
import com.webapplication.ss_app.service.interfaz.EmailService;
import com.webapplication.ss_app.service.interfaz.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final EmailService emailService;

	private final AccountRepository accountRepository;

	private final ProfileRepository profileRepository;

	@Override
	public MessageResponse createUser(UserRequest request) {
		if (userRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new EmailAlreadyExistsException("Email already exits");
		}

		Account account = new Account();
		account.setType(request.getAccountType());

		User user = new User();
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));

		String verificationToken = UUID.randomUUID().toString();
		user.setVerificationToken(verificationToken);
		user.setVerificationTokenExpiry(Instant.now().plusSeconds(86400));
		user.setAccount(account);

		account.setUserName(request.getUserName());
		account.setOwner(user);

		accountRepository.save(account);

		return new MessageResponse("User created succesfully.");
	}

	@Override
	@Transactional(readOnly = true)
	public List<UserDto> getAllUsers() {
		List<User> userList = userRepository.findAllWithAccount();

		if (CollectionUtils.isEmpty(userList)) {
			return Collections.emptyList();
		}

		return userList.stream().map(this::toDto).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public UserDetailDto getUserDetail(Long id) {
		User user = userRepository.findWithAccountById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

		UserDetailDto detail = new UserDetailDto();
		copyBaseFields(user, detail);
		detail.setProfiles(loadProfileSummaries(user.getAccount()));
		return detail;
	}

	@Override
	@Transactional
	public UserDto updateStatus(Long id, Boolean enabled) {
		User user = userRepository.findWithAccountById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

		if (user.getRole() == Role.ADMIN && !Boolean.TRUE.equals(enabled)) {
			throw new BusinessRuleException("Admin accounts can't be deactivated.");
		}

		user.setEnabled(Boolean.TRUE.equals(enabled));
		userRepository.save(user);
		return toDto(user);
	}

	private UserDto toDto(User user) {
		UserDto dto = new UserDto();
		copyBaseFields(user, dto);
		return dto;
	}

	private void copyBaseFields(User user, UserDto target) {
		Account account = user.getAccount();

		target.setId(user.getIdUsers());
		target.setEmail(user.getEmail());
		target.setEmailVerified(user.isEmailVerified());
		target.setEnabled(user.isEnabled());
		target.setLastLoginAt(user.getLastLoginAt());
		target.setCreatedAt(user.getCreatedAt());
		target.setRole(user.getRole());

		if (account != null) {
			target.setUserName(account.getUserName());
			target.setAccountType(account.getType());
			target.setAccountStatus(account.getStatus());
		}
	}

	private List<ProfileSummaryDto> loadProfileSummaries(Account account) {
		if (account == null) {
			return Collections.emptyList();
		}

		return profileRepository.findByAccountIdWithPhotos(account.getIdAccount()).stream().map(profile -> {
			ProfileSummaryDto summary = new ProfileSummaryDto();
			summary.setId(profile.getId());
			summary.setProfileName(profile.getProfileName());
			summary.setGender(profile.getGender());
			summary.setAge(profile.getAge());
			summary.setCity(profile.getCity());
			summary.setCountry(profile.getCountry());
			summary.setStatus(profile.getStatus());
			summary.setVerificationStatus(profile.getVerificationStatus());
			summary.setPhoneNumber(profile.getPhoneNumber());
			summary.setPhotosCount(profile.getPhotos() == null ? 0 : profile.getPhotos().size());
			return summary;
		}).toList();
	}
}
