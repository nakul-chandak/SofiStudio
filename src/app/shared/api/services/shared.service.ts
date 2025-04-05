import { Injectable } from "@angular/core";
import { DialogData } from "app/modules/admin/pages/content/content.types";
import { Observable, ReplaySubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SharedService {

     private _categoryFileDialog: ReplaySubject<DialogData | null> = new ReplaySubject(null);

      set fileDialog(value: DialogData) {
             // Store the value
             this._categoryFileDialog.next(value);
         }
     
         get fileDialog$(): Observable<DialogData> {
             return this._categoryFileDialog.asObservable();
         }
}