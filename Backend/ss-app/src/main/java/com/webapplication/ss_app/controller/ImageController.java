package com.webapplication.ss_app.controller;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.webapplication.ss_app.service.impl.R2Service;

import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@RestController
@RequestMapping("/api/images")
public class ImageController {

	private final R2Service r2Service;

	public ImageController(R2Service r2Service) {
		this.r2Service = r2Service;
	}

	@PostMapping("/upload")
	public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
		try {
			String fileName = r2Service.uploadFile(file);
			return ResponseEntity.ok("Imagen subida con éxito. Nombre clave en R2: " + fileName);
		} catch (Exception e) {
			return ResponseEntity.internalServerError().body("Error al subir la imagen: " + e.getMessage());
		}
	}

	@GetMapping("/{fileName}")
	public ResponseEntity<ByteArrayResource> getImage(@PathVariable String fileName) {
		try {
			ResponseBytes<GetObjectResponse> objectBytes = r2Service.getFile(fileName);
			byte[] data = objectBytes.asByteArray();
			ByteArrayResource resource = new ByteArrayResource(data);

			String contentType = objectBytes.response().contentType();

			return ResponseEntity.ok().contentLength(data.length)
					.contentType(
							MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
					.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"").body(resource);

		} catch (Exception e) {
			return ResponseEntity.notFound().build();
		}
	}
}
