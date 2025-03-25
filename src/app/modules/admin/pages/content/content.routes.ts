import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';

import { Observable, catchError, throwError } from 'rxjs';

import { Board } from './content.models';
import { ContentService } from './content.service';
import { CategoryListComponent } from './category/list-category/list-category.component';
import { CategoryAddCardComponent } from './category/add-category/add-category.component';
import { ScrumboardBoardComponent } from './category/board/board.component';
import { ScrumboardCardComponent } from './category/card/card.component';
import { ContentCategoryService } from 'app/shared/api/services/api';


const canDeactivateContent = (
    component: CategoryAddCardComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
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
    const scrumboardService = inject(ContentCategoryService);
    const router = inject(Router);

    return scrumboardService.findCategoryContentCategoryFindIdGet(route.paramMap.get('id')).pipe(
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
        component: CategoryListComponent,
        resolve: {
            category:() => inject(ContentCategoryService).listAllCategoriesContentCategoryListAllGet()
        },
        children:[
            {
                path: 'new/:id',
                component: CategoryAddCardComponent,
                canDeactivate:[canDeactivateContent]
            },
            {
                path: 'edit/:id',
                component: CategoryAddCardComponent,
                resolve:{
                    category:categoryResolver
                },
                canDeactivate:[canDeactivateContent]
            },
        ]
    }
] as Routes;
