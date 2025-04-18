import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';

import { ContentCategoryListComponent } from './category/list-category/list-category.component';
import { ContentCategoryAddCardComponent } from './category/add-category/add-category.component';
import { ContentCategoryService } from 'app/shared/api/services/api';


const canDeactivateContent = (
    component: ContentCategoryAddCardComponent,
    nextState: RouterStateSnapshot
) => {
    // // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/category'
    // it means we are navigating away from the
    // contacts app
    if (!nextState.url.includes('/category')) {
        // Let it navigate
        return true;
    }
    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

/**
 * Card resolver
 *
 * @param route
 * @param state
 */
const categoryResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const contentCategoryService = inject(ContentCategoryService);
    const router = inject(Router);

    return contentCategoryService.findCategoryContentCategoryFindIdGet(route.paramMap.get('id')).pipe(
        // Error here means the requested card is not available
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

export default [
    {
        path: '',
        component: ContentCategoryListComponent,
        resolve: {
            category:() => inject(ContentCategoryService).listAllCategoriesContentCategoryListAllGet()
        },
        children:[
            {
                path: 'new/:id',
                component: ContentCategoryAddCardComponent,
                canDeactivate:[canDeactivateContent]
            },
            {
                path: 'edit/:id',
                component: ContentCategoryAddCardComponent,
                resolve:{
                    category:categoryResolver
                },
                canDeactivate:[canDeactivateContent]
            },
        ]
    }
] as Routes;
