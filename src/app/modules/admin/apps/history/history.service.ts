import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Test } from './test.type';
import { environment as env } from 'environments/environment';

@Injectable({
	providedIn: 'root',
})
export class HistoryService {
	// Private
	private _tests: BehaviorSubject<Test[] | null> = new BehaviorSubject(null);
	private _test: BehaviorSubject<Test | null> = new BehaviorSubject(null);

	/**
	 * Constructor
	 */
	constructor(private _httpClient: HttpClient) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Getter for tests
	 */
	get tests$(): Observable<Test[]> {
		return this._tests.asObservable();
	}

	/**
	 * Getter for tests
	 */
	get test$(): Observable<Test> {
		return this._test.asObservable();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Get Tests
	 */
	getTests(): Observable<any> {
		return this._httpClient.get<Test[]>(`${env.apiUrl}/test/grouped`).pipe(
			tap((response) => {
				this._tests.next(response.data);
			})
		);
	}

	/**
	 * Get test by id
	 */
	getTestById(id: string): Observable<Test> {
		return this._tests.pipe(
			take(1),
			map((tests) => {
				// Find the module
				const test = tests.find(item => item._id === id) || null;

				// Update the module
				this._test.next(test);

				// Return the module
				return test;
			}),
			switchMap((test) => {
				if (!test) {
					return throwError('Could not found test with id of ' + id + '!');
				}

				return of(test);
			})
		);
	}

	/**
	 * Delete the instance
	 *
	 * @param id
	 */
	deleteTest(id: string): Observable<boolean> {
		return this.tests$.pipe(
			take(1),
			switchMap(tests => this._httpClient.delete(`${env.apiUrl}/instance/${id}`).pipe(
				map((isDeleted: boolean) => {
					// Find the index of the deleted instance
					const index = tests.findIndex(item => item._id === id);
					// Delete the instance
					tests.splice(index, 1);
					// Update the tests
					this._tests.next(tests);
					// Return the deleted status
					return isDeleted;
					})
				)
			)
		);
	}

	/**
	 * Delete the instance
	 *
	 * @param id
	 */
	deleteTestsByUUID(uuid: string): Observable<boolean> {
		return this.tests$.pipe(
			take(1),
			switchMap(tests => this._httpClient.delete(`${env.apiUrl}/tests/${uuid}`).pipe(
					map((isDeleted: boolean) => {
						// Find the index of the deleted instance
						const index = tests.findIndex(item => item._id === uuid);

						// Delete the instance
						tests.splice(index, 1);

						// Update the tests
						this._tests.next(tests);

						// Return the deleted status
						return isDeleted;
					})
				)
			)
		);
	}
}
