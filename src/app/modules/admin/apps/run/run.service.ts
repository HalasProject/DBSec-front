import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { InventoryPagination, InventoryModule } from 'app/modules/admin/apps/module/inventory/inventory.types';
import { environment as env } from 'environments/environment';

@Injectable({
	providedIn: 'root',
})
export class RunService {
	// Private
	private _test: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

	/**
	 * Constructor
	 */
	constructor(private _httpClient: HttpClient) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Getter for modules
	 */
	get test$(): Observable<InventoryModule[]> {
		return this._test.asObservable();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Get modules
	 */
	run(body): Observable<any> {
		let url = `${env.apiUrl}/runner`;
		return this._httpClient.post(url,body).pipe(
			tap((response) => {
				this._test.next(response.data);
			})
		);
	}
}
