package com.webapplication.ss_app.dtos.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatalogsResponse implements Serializable {

	private static final long serialVersionUID = -7209270914556022972L;

	private Long id;
	private Long typeId;
	private Long code;
	private String description;
	private Long fatherType;

}
