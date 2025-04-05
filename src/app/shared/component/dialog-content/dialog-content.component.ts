import { Component, Inject, inject, model, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DialogData } from 'app/modules/admin/pages/content/content.types';
import { SharedService } from 'app/shared/api/services/api';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { first, Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-content',
  imports: [MatDialogModule, MatButtonModule, ImageCropperComponent],
  templateUrl: './dialog-content.component.html'
})
export class DialogContentComponent implements OnInit {
  croppedImage: SafeUrl  = '';
  imageChangedEvent : Event | null = null;
  fileName = "";
  file :File;
  constructor(private sanitizer: DomSanitizer, private readonly sharedService:SharedService,
    private dialogRef: MatDialogRef<DialogContentComponent, DialogData>) {
    
  }
  ngOnInit(): void {
    this.sharedService.fileDialog$.subscribe((value:DialogData)=>{
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
