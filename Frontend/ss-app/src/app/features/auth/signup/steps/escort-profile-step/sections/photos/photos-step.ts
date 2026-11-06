import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PhotoPreview } from '../../models/photo-preview';

@Component({
  selector: 'app-photos-step',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './photos-step.html',
  styleUrls: [
    '../../../../../../../shared/styles/avatar-upload.css',
    './photos-step.css',
  ],
})
export class PhotosStep {
  @Input({ required: true }) photos: PhotoPreview[] = [];
  @Input() minPhotos = 3;
  @Input() maxPhotos = 10;

  @Output() photoAdded = new EventEmitter<File>();
  @Output() photoRemoved = new EventEmitter<number>();

  get canAddMorePhotos(): boolean {
    return this.photos.length < this.maxPhotos;
  }

  get photosRemainingToMin(): number {
    return Math.max(0, this.minPhotos - this.photos.length);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!this.canAddMorePhotos) {
      input.value = '';
      return;
    }

    this.photoAdded.emit(file);
    input.value = '';
  }

  removePhoto(index: number): void {
    this.photoRemoved.emit(index);
  }
}
