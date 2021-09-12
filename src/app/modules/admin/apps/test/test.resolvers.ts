import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { TestService } from './test.service';
import { Test } from './test.type';

@Injectable({
	providedIn: 'root',
})
export class TestResolver implements Resolve<any> {
	/**
	 * Constructor
	 */
	constructor(private _testService: TestService, private _router: Router) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Resolver
	 *
	 * @param route
	 * @param state
	 */
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
		return this._testService.getTest(route.paramMap.get('uuid')).pipe(
			// Error here means the requested product is not available
			catchError((error) => {
				// Log the error
				console.error(error);

				// Get the parent url
				const parentUrl = state.url.split('/').slice(0, -1).join('/');

				// Navigate to there
				this._router.navigateByUrl(parentUrl);

				// Throw an error
				return throwError(error);
			})
		);
	}
}

@Injectable({
    providedIn: 'root'
})
export class OneTestResolver implements Resolve<any> {
	/**
	 * Constructor
	 */
	constructor(private _testService: TestService, private _router: Router) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Resolver
	 *
	 * @param route
	 * @param state
	 */
	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
		return this._testService.getTestById(route.paramMap.get('id'));
	}
}
