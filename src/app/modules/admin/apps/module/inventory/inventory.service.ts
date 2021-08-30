import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { InventoryPagination, InventoryModule } from 'app/modules/admin/apps/module/inventory/inventory.types';
import { environment as env } from 'environments/environment';

@Injectable({
	providedIn: 'root',
})
export class InventoryService {
	// Private
	private _modules: BehaviorSubject<InventoryModule[] | null> = new BehaviorSubject(null);

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
	get modules$(): Observable<InventoryModule[]> {
		return this._modules.asObservable();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Get modules
	 */
	getModules(search?): Observable<any> {
		let url = `${env.apiUrl}/modules`;
		if (search) url += `?search=${search}`
		return this._httpClient.get<InventoryModule[]>(url).pipe(
			tap((response) => {
				this._modules.next(response.data);
			})
		);
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Get modules
	 */
	getModulesByDB(DB): Observable<any> {
		return this._httpClient.get<InventoryModule[]>(`${env.apiUrl}/modules?database=${DB}`).pipe(
			tap((response) => {
				this._modules.next(response.data);
			})
		);
	}

	/**
	 * Get module by id
	 */
	getModuleById(id: string): Observable<InventoryModule> {
		return this._modules.pipe(
			take(1),
			map((modules) => {
				// Find the module
				const module = modules.find((item) => item._id === id) || null;

				// Update the module
				this._modules.next(modules);

				// Return the module
				return module;
			}),
			switchMap((module) => {
				if (!module) {
					return throwError('Could not found module with id of ' + id + '!');
				}

				return of(module);
			})
		);
	}

	/**
	 * Create module
	 */
	createModule(): Observable<InventoryModule> {
		return this.modules$.pipe(
			take(1),
			switchMap((modules) =>
				this._httpClient.post<InventoryModule>(`${env.apiUrl}/module`, {}).pipe(
					map((newModule) => {
						// Update the modules with the new module
						this._modules.next([newModule, ...modules]);

						// Return the new module
						return newModule;
					})
				)
			)
		);
	}

	/**
	 * Update module
	 *
	 * @param id
	 * @param module
	 */
	updateModule(id: string, module): Observable<any> {
		return this.modules$.pipe(
			take(1),
			switchMap((modules) =>
				this._httpClient
					.put<InventoryModule>(`${env.apiUrl}/module/${id}`, {
						...{ data: module },
					})
					.pipe(
						map((updatedModule) => {
							// Find the index of the updated module
							const index = modules.findIndex((item) => item._id === id);

							// Update the module
							modules[index] = updatedModule;

							// Update the module
							this._modules.next(modules);

							// Return the updated module
							return updatedModule;
						})
					)
			)
		);
	}

	/**
	 * Delete the module
	 *
	 * @param id
	 */
	deleteModule(id: string): Observable<boolean> {
		return this.modules$.pipe(
			take(1),
			switchMap((modules) =>
				this._httpClient.delete(`${env.apiUrl}/module/${id}`).pipe(
					map((isDeleted: boolean) => {
						// Find the index of the deleted module
						const index = modules.findIndex((item) => item._id === id);

						// Delete the module
						modules.splice(index, 1);

						// Update the modules
						this._modules.next(modules);

						// Return the deleted status
						return isDeleted;
					})
				)
			)
		);
	}
}
