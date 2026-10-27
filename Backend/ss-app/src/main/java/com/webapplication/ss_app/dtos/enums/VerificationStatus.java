package com.webapplication.ss_app.dtos.enums;

public enum VerificationStatus {

	PENDING("Pending"), VERIFIED("Verified"), REJECTED("Rejected");

	private final String description;

	VerificationStatus(String description) {
		this.description = description;
	}

	public String getDisplayName() {
		return description;
	}
}
