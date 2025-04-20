import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SharedService } from 'app/shared/api/services/api';
import { DialogData } from 'app/shared/types/content.types';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-dialog',
  imports: [MatDialogModule, MatButtonModule, ImageCropperComponent],
  templateUrl: './image-dialog.component.html'
})
export class ImageContentDialogComponent implements OnInit {
  croppedImage: SafeUrl  = '';
  imageChangedEvent : Event | null = null;
  fileName = "";
  file :File;
  roundCropper = false;
  aspectRatio = 2/3;
  cropperMinWidth = 0;
  cropperMinHeight = 0;
  cropperMaxWidth =0;
  cropperMaxHeight = 0;

  constructor(private sanitizer: DomSanitizer, private readonly sharedService:SharedService,
    private dialogRef: MatDialogRef<ImageContentDialogComponent, DialogData>) {
    
  }
  ngOnInit(): void {
    this.sharedService.fileDialog$.subscribe((value:DialogData)=>{
      this.aspectRatio = value.imageCropSettings?.aspectRatio ? value.imageCropSettings?.aspectRatio : this.aspectRatio;
      this.roundCropper = value.imageCropSettings?.roundCropper ? value.imageCropSettings?.roundCropper : this.roundCropper;
      this.cropperMinWidth = value.imageCropSettings?.cropperMinWidth ? value.imageCropSettings?.cropperMinWidth : this.cropperMinWidth;
      this.cropperMinHeight = value.imageCropSettings?.cropperMinHeight ? value.imageCropSettings?.cropperMinHeight : this.cropperMinHeight;
      this.cropperMaxWidth = value.imageCropSettings?.cropperMaxWidth ? value.imageCropSettings?.cropperMaxWidth : this.cropperMaxWidth;
      this.cropperMaxHeight = value.imageCropSettings?.roundCropper ? value.imageCropSettings?.cropperMaxHeight : this.cropperMaxHeight;
      this.fileName = value.name;
      this.imageChangedEvent = value.imageEvent;
     }); 
  }

   imageCropped(event: ImageCroppedEvent) {
          this.convertBlobToFile(event.blob)
          this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
          // event.blob can be used to upload the cropped image
        }

    imageLoaded(image: LoadedImage) {
      // show cropper
    }
    cropperReady() {
      // cropper ready
    }
    loadImageFailed() {
      // show message
    }

    convertBlobToFile(blob: Blob) {
      this.file = new File([blob], this.fileName.toString(), { type: blob.type });
    }
    returnCroppedImage() {
      const result = <DialogData>{
        file:this.file,
        name:this.fileName,
        tempUrl:this.croppedImage,
        imageEvent:this.imageChangedEvent
      }
      this.dialogRef.close(result);
      }
}
