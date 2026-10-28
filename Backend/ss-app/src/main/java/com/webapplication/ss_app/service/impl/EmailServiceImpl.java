package com.webapplication.ss_app.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.webapplication.ss_app.service.interfaz.EmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

	private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

	private final JavaMailSender mailSender;

	@Value("${app.frontend.url:http://localhost:4200}")
	private String frontendUrl;

	@Value("${spring.mail.username}")
	private String fromEmail;

	@Override
	public void sendVerificationEmail(String toEmail, String token) {
		// TODO Auto-generated method stub

	}

	@Override
	public void sendPasswordResetEmail(String toEmail, String token) {
		// TODO Auto-generated method stub

	}

}
