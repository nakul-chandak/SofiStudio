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
import { CategoryAddCardComponent } from './category/add-category/add-card.component';
import { ScrumboardBoardComponent } from './category/board/board.component';
import { ScrumboardCardComponent } from './category/card/card.component';

/**
 * Board resolver
 *
 * @param route
 * @param state
 */
const boardResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<Board> => {
    const scrumboardService = inject(ContentService);
    const router = inject(Router);

    return scrumboardService.getBoard(route.paramMap.get('boardId')).pipe(
        // Error here means the requested board is not available
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

const canDeactivateContent = (
    component: CategoryAddCardComponent,
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
const cardResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const scrumboardService = inject(ContentService);
    const router = inject(Router);

    return scrumboardService.getCard(route.paramMap.get('cardId')).pipe(
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
            boards: () => inject(ContentService).getBoards(),
        },
        children:[
            {
                path: 'newCategory',
                component: CategoryAddCardComponent,
                canDeactivate:[canDeactivateContent]
            },
        ]
    },
        {
        path: ':boardId',
        component: ScrumboardBoardComponent,
        resolve: {
            board: boardResolver,
        },
        children: [
            {
                path: 'card/:cardId',
                component: ScrumboardCardComponent,
                resolve: {
                    card: cardResolver,
                },
            },
        ],
    },
] as Routes;
