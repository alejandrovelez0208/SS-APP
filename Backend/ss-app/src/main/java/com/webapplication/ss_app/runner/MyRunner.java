package com.webapplication.ss_app.runner;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.webapplication.ss_app.dtos.enums.AccountType;
import com.webapplication.ss_app.dtos.request.UserRequest;
import com.webapplication.ss_app.service.interfaz.AccountService;
import com.webapplication.ss_app.service.interfaz.UserService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MyRunner implements CommandLineRunner {

	private final UserService userService;

	private final PasswordEncoder passwordEncoder;

	private final AccountService accountService;

	@Override
	public void run(String... args) throws Exception {

		/*
		 * TODO: Uncomment only when the database is restored UserRequest request = new
		 * UserRequest(); request.setEmail("useradmin@mailinator.com");
		 * request.setUserName("Admin"); request.setAccountType(AccountType.ADMIN);
		 * request.setPassword("123456");
		 * 
		 * userService.createUser(request);]
		 */
	}

}
