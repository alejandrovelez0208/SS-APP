package com.webapplication.ss_app.service.interfaz;

public interface EmailService {

	void sendVerificationEmail(String toEmail, String token);

	void sendPasswordResetEmail(String toEmail, String token);
}
