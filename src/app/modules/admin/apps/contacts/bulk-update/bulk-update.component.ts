import { ChangeDetectionStrategy, Component, ViewEncapsulation,OnInit } from '@angular/core';
import { ContactsListComponent } from '../list/list.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { Contact } from '../contacts.types';
import { Location } from '@angular/common';

@Component({
  selector: 'bulk-update',
  templateUrl: './bulk-update.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTooltipModule,
    MatIconModule,
    RouterLink,
    MatListModule
  ],
})
export class BulkUpdateComponent implements OnInit{
  
  contacts:Contact[]
  /**
   *
   */
  constructor(private _contactsListComponent: ContactsListComponent,private location:Location) {
    
  }
  
  ngOnInit(): void {
    this._contactsListComponent.matDrawer.open();
    const cont = this.location.getState()
    this.contacts = Object.entries(cont).map((obj)=>obj[1]).filter((c:Contact)=>c.isBulkSelect);
  }

  
  /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._contactsListComponent.matDrawer.close();
    }

}
