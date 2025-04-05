import { Injectable } from "@angular/core";
import { DialogData } from "app/modules/admin/pages/content/content.types";
import { ConfirmDialog } from "app/shared/types";
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


    private _confirmFileDialog: ReplaySubject<ConfirmDialog | null> = new ReplaySubject(null);

    set confirmDialog(value: ConfirmDialog) {
        // Store the value
        this._confirmFileDialog.next(value);
    }

    get confirmDialog$(): Observable<ConfirmDialog> {
        return this._confirmFileDialog.asObservable();
    }
}