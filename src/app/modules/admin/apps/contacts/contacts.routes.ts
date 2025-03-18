import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { ContactsComponent } from 'app/modules/admin/apps/contacts/contacts.component';
import { ContactsDetailsComponent } from 'app/modules/admin/apps/contacts/details/details.component';
import { ContactsListComponent } from 'app/modules/admin/apps/contacts/list/list.component';
import { catchError, throwError } from 'rxjs';
import { BulkUpdateComponent } from './bulk-update/bulk-update.component';
import { UserService } from 'app/shared/api/services/api';

/**
 * Contact resolver
 *
 * @param route
 * @param state
 */
const contactResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const userService = inject(UserService);
    const router = inject(Router);

    return userService.getContactById(route.paramMap.get('id')).pipe(
        // Error here means the requested contact is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};

/**
 * Can deactivate contacts details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateContactsDetails = (
    component: ContactsDetailsComponent | BulkUpdateComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/contacts'
    // it means we are navigating away from the
    // contacts app
    if (!nextState.url.includes('/users')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another contact...
    if (nextRoute.paramMap.get('id')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

export default [
    {
        path: '',
        component: ContactsComponent,
        resolve: {
        },
        children: [
            {
                path: '',
                component: ContactsListComponent,
                resolve: {
                    contacts: () => inject(UserService).listAllUsersUserAdminListAllUsersGet(),
                    roles:() => inject(UserService).listAllRolesUserAdminListAllRolesGet()
                },
                children: [
                    {
                        path:'bulk-update',
                        component:BulkUpdateComponent,
                        resolve:{ },
                        canDeactivate: [canDeactivateContactsDetails],
                    },
                    {
                        path: ':id',
                        component: ContactsDetailsComponent,
                        resolve: {
                            contact: contactResolver,
                        },
                        canDeactivate: [canDeactivateContactsDetails],
                    }
                ],
            },
            
        ],
    },
    
] as Routes;
