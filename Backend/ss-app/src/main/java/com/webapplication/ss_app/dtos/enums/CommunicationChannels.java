package com.webapplication.ss_app.dtos.enums;

public enum CommunicationChannels {

	WHATSAPP("WhatsApp"), TELEGRAM("Telegram");

	private final String description;

	CommunicationChannels(String displayName) {
		this.description = displayName;
	}

	public String getDisplayName() {
		return description;
	}
}
