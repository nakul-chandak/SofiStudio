import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from 'app/shared/api/services/api';
import { ConfirmDialog } from 'app/shared/types';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent implements OnInit {
 confirmFields=<ConfirmDialog> {
  cancelButtonLabel:"Cancel",
  confirmButtonLabel: "Delete",
  message:"Do you really want to delete?",
  title: "Are you sure?"
 }
 /**
  *
  */
 constructor(private readonly sharedService:SharedService,
  private dialogRef: MatDialogRef<ConfirmDialogComponent, any>) {
 }

  ngOnInit(): void {
   this.sharedService.confirmDialog$.subscribe((value:ConfirmDialog)=>{
      if(value) {
        this.confirmFields.cancelButtonLabel = value.cancelButtonLabel? value.cancelButtonLabel :this.confirmFields.cancelButtonLabel;
        this.confirmFields.confirmButtonLabel = value.confirmButtonLabel? value.confirmButtonLabel :this.confirmFields.confirmButtonLabel;
        this.confirmFields.message = value.message? value.message :this.confirmFields.message;
        this.confirmFields.title = value.title? value.title :this.confirmFields.title;
      }
   });
  }

  confirmAction() {
    this.dialogRef.close(true);
  }
}
