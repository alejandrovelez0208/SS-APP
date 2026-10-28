package com.webapplication.ss_app.dtos.enums;

public enum ModerationStatus {

	PENDING("Pending"), APPROVED("Approved"), REJECTED("Rejected");

	private final String description;

	ModerationStatus(String description) {
		this.description = description;
	}

	public String getDisplayName() {
		return description;
	}
}
