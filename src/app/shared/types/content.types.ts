interface DialogData {
    name: string;
    file:File;
    imageEvent:Event;
    tempUrl:string;
    imageCropSettings:CroppedImageProperties
  }

interface CroppedImageProperties {
  roundCropper:boolean;
  alignImage:string;
  aspectRatio:number;
  cropperStaticWidth:number;
  cropperStaticHeight:number;
  cropperMinWidth:number;
  cropperMinHeight :number;
  cropperMaxWidth :number;
  cropperMaxHeight :number;
}

export {
  DialogData, CroppedImageProperties
}