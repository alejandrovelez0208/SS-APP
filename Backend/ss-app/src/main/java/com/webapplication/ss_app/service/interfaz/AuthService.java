package com.webapplication.ss_app.service.interfaz;

import com.webapplication.ss_app.dtos.request.UserRequest;
import com.webapplication.ss_app.dtos.response.EmailValidationResponse;
import com.webapplication.ss_app.dtos.response.LoginResponse;
import com.webapplication.ss_app.dtos.response.MessageResponse;

import jakarta.validation.Valid;

public interface AuthService {

	LoginResponse signup(@Valid UserRequest userRequest);

	LoginResponse login(String email, String password);

	EmailValidationResponse validateEmail(String email);

	MessageResponse verifyEmail(String token);

	MessageResponse resendVerificationEmail(String email);

	MessageResponse forgotPassword(String email);

	MessageResponse resetPassword(String token, String newPassword);

	MessageResponse changePassword(String email, String currentPassword, String newPassword);

	LoginResponse currentUser(String email);

	LoginResponse refresh(String refreshToken);

	MessageResponse logout(String refreshToken);
}
