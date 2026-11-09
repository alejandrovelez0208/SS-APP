package com.webapplication.ss_app.service.impl;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.webapplication.ss_app.dtos.enums.Role;
import com.webapplication.ss_app.dtos.enums.ProfileStatus;
import com.webapplication.ss_app.dtos.request.UserRequest;
import com.webapplication.ss_app.dtos.response.EmailValidationResponse;
import com.webapplication.ss_app.dtos.response.LoginResponse;
import com.webapplication.ss_app.dtos.response.MessageResponse;
import com.webapplication.ss_app.entity.Account;
import com.webapplication.ss_app.entity.Profile;
import com.webapplication.ss_app.entity.User;
import com.webapplication.ss_app.exception.AccountDeactivatedException;
import com.webapplication.ss_app.exception.BadCredentialsException;
import com.webapplication.ss_app.exception.EmailAlreadyExistsException;
import com.webapplication.ss_app.exception.InvalidCredentialsException;
import com.webapplication.ss_app.exception.InvalidTokenException;
import com.webapplication.ss_app.repositories.interfaz.AccountRepository;
import com.webapplication.ss_app.repositories.interfaz.ProfileRepository;
import com.webapplication.ss_app.repositories.interfaz.UserRepository;
import com.webapplication.ss_app.security.JwtUtil;
import com.webapplication.ss_app.service.interfaz.AuthService;
import com.webapplication.ss_app.service.interfaz.EmailService;
import com.webapplication.ss_app.util.ServiceUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;

	private final AccountRepository accountRepository;

	private final ProfileRepository profileRepository;

	private final RefreshTokenService refreshTokenService;

	private final EmailService emailService;

	private final PasswordEncoder passwordEncoder;

	private final JwtUtil jwtUtil;

	private final ServiceUtils serviceUtils;

	@Override
	@Transactional
	public LoginResponse signup(UserRequest userRequest) {
		if (userRepository.existsByEmail(userRequest.getEmail())) {
			throw new EmailAlreadyExistsException("Email already exists");
		}

		User user = new User();
		user.setEmail(userRequest.getEmail());
		user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
		user.setRole(Role.USER);

		String verificationToken = UUID.randomUUID().toString();
		user.setVerificationToken(verificationToken);
		user.setVerificationTokenExpiry(Instant.now().plusSeconds(86400));

		Account account = new Account();
		account.setType(userRequest.getAccountType());
		account.setUserName(userRequest.getUserName());
		account.setOwner(user);

		user.setAccount(account);

		accountRepository.save(account);

		Profile profile = new Profile();
		profile.setAccount(account);
		profile.setProfileName(userRequest.getUserName());
		profile.setStatus(ProfileStatus.DRAFT);
		profileRepository.save(profile);

		emailService.sendVerificationEmail(userRequest.getEmail(), verificationToken);

		final String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
		final String refreshToken = refreshTokenService.createToken(user);

		return toLoginResponse(user, profile, token, refreshToken);
	}

	@Override
	@Transactional
	public LoginResponse login(String email, String password) {
		User user = userRepository.findByEmail(email).filter(u -> passwordEncoder.matches(password, u.getPassword()))
				.orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

		if (!user.isEnabled()) {
			throw new AccountDeactivatedException(
					"Your account has been deactivated. Please contanct support for assistance");
		}

		//TODO:This need to move
//		if (!user.isEmailVerified()) {
//			throw new EmailNotVerifiedException(
//					"This verify your email address before loggin in. Check your inbox for the verification link");
//		}

		user.setLastLoginAt(Instant.now());
		userRepository.save(user);

		final String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

		Profile profile = profileRepository
				.findFirstByAccount_IdAccount(user.getAccount().getIdAccount())
				.orElse(null);

		final String refreshToken = refreshTokenService.createToken(user);

		return toLoginResponse(user, profile, token, refreshToken);
	}

	@Override
	public EmailValidationResponse validateEmail(String email) {
		boolean exits = userRepository.existsByEmail(email);
		return new EmailValidationResponse(exits, !exits);
	}

	@Override
	public MessageResponse verifyEmail(String token) {
		User user = userRepository.findByVerificationToken(token)
				.orElseThrow(() -> new InvalidTokenException("Invalid or experired verification token"));

		if (user.getVerificationTokenExpiry() == null || user.getVerificationTokenExpiry().isBefore(Instant.now())) {
			throw new InvalidTokenException("Verification link has expired. Please request a new one");
		}
		user.setEmailVerified(true);
		user.setVerificationToken(token);
		user.setVerificationTokenExpiry(null);

		userRepository.save(user);

		activateCompletedProfile(user);

		return new MessageResponse("Email verified succesfully! you can now login");
	}

	@Override
	public MessageResponse resendVerificationEmail(String email) {
		User user = serviceUtils.getUserByEmailOrThrow(email);

		String verificationToken = UUID.randomUUID().toString();
		user.setVerificationToken(verificationToken);
		user.setVerificationTokenExpiry(Instant.now().plusSeconds(86400));

		userRepository.save(user);

		emailService.sendVerificationEmail(email, verificationToken);

		return new MessageResponse("Verification email resent succesfully! please check your inbox");
	}

	@Override
	public MessageResponse forgotPassword(String email) {
		User user = serviceUtils.getUserByEmailOrThrow(email);
		String resetToken = UUID.randomUUID().toString();
		user.setPasswordResetToken(resetToken);
		user.setPasswordResetTokenExpiry(Instant.now().plusSeconds(3600));

		userRepository.save(user);
		emailService.sendPasswordResetEmail(email, resetToken);

		return new MessageResponse("Password reset email sent succesfully! please check your inbox");
	}

	@Override
	public MessageResponse resetPassword(String token, String newPassword) {
		User user = userRepository.findByPasswordResetToken(token)
				.orElseThrow(() -> new InvalidTokenException("Invalid or expired reset token"));

		if (user.getPasswordResetTokenExpiry() == null || user.getPasswordResetTokenExpiry().isBefore(Instant.now())) {
			throw new InvalidTokenException("Reset token has expired");
		}

		user.setPassword(passwordEncoder.encode(newPassword));
		user.setPasswordResetToken(null);
		user.setPasswordResetTokenExpiry(null);

		userRepository.save(user);

		return new MessageResponse("Password reset successfully. You can now log in with your new password");
	}

	@Override
	public MessageResponse changePassword(String email, String currentPassword, String newPassword) {
		User user = serviceUtils.getUserByEmailOrThrow(email);

		if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
			throw new InvalidCredentialsException("Current password is incorrect");
		}

		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);

		return new MessageResponse("Password changed successfully");
	}

	@Override
	public LoginResponse currentUser(String email) {
		User user = serviceUtils.getUserByEmailOrThrow(email);
		Profile profile = profileRepository
				.findFirstByAccount_IdAccount(user.getAccount().getIdAccount())
				.orElse(null);
		return toLoginResponse(user, profile, null, null);
	}

	@Override
	@Transactional
	public LoginResponse refresh(String refreshToken) {
		RefreshTokenService.RotatedToken rotated = refreshTokenService.rotate(refreshToken);
		User user = rotated.user();

		final String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
		Profile profile = profileRepository
				.findFirstByAccount_IdAccount(user.getAccount().getIdAccount())
				.orElse(null);

		return toLoginResponse(user, profile, accessToken, rotated.refreshToken());
	}

	@Override
	@Transactional
	public MessageResponse logout(String refreshToken) {
		refreshTokenService.revoke(refreshToken);
		return new MessageResponse("Logged out successfully");
	}

	private LoginResponse toLoginResponse(User user, Profile profile, String token, String refreshToken) {
		return LoginResponse.builder()
				.token(token)
				.email(user.getEmail())
				.fullName(user.getAccount() != null ? user.getAccount().getUserName() : null)
				.role(user.getRole().name())
				.profileId(profile != null ? profile.getId() : null)
				.profileComplete(profile != null && profile.getCompletedAt() != null)
				.emailVerified(user.isEmailVerified())
				.accountType(user.getAccount() != null ? user.getAccount().getType() : null)
				.refreshToken(refreshToken)
				.build();
	}

	private void activateCompletedProfile(User user) {
		profileRepository.findFirstByAccount_IdAccount(user.getAccount().getIdAccount())
				.filter(profile -> profile.getCompletedAt() != null)
				.ifPresent(profile -> {
					profile.setStatus(ProfileStatus.ACTIVE);
					profileRepository.save(profile);
				});
	}

}
