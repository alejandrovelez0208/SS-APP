package com.webapplication.ss_app.dtos.enums;

public enum AccountType {

	INDEPENDENT("Independent"), AGENCY("Agency");

	AccountType(String descripction) {
		this.displayName = descripction;
	}

	private final String displayName;

	public String getDisplayName() {
		return displayName;
	}
}
