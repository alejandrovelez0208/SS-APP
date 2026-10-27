package com.webapplication.ss_app.dtos.enums;

public enum AccountStatus {
	ACTIVE("Active"), SUSPENDED("Suspended");

	AccountStatus(String descripction) {
		this.displayName = descripction;
	}

	private final String displayName;

	public String getDisplayName() {
		return displayName;
	}

}
