package com.webapplication.ss_app.service.impl;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.webapplication.ss_app.dtos.request.UserRequest;
import com.webapplication.ss_app.dtos.response.MessageResponse;
import com.webapplication.ss_app.entity.Account;
import com.webapplication.ss_app.entity.User;
import com.webapplication.ss_app.exception.EmailAlreadyExistsException;
import com.webapplication.ss_app.repositories.interfaz.AccountRepository;
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

		/* CREAR EL BORRADOR MULTIPASOS */
		return new MessageResponse("User created succesfully.");
	}

}
