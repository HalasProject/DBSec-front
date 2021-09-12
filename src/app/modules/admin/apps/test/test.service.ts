import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Test, TestBlock } from './test.type';
import { environment as env } from 'environments/environment';

@Injectable({
	providedIn: 'root',
})
export class TestService {
	// Private
	private _testBlock: BehaviorSubject<TestBlock | null> = new BehaviorSubject(null);
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
	get testBlock$(): Observable<TestBlock> {
		return this._testBlock.asObservable();
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
	 * Get Test
	 */
	getTest(uuid): Observable<any> {
		const url = `${env.apiUrl}/test/${uuid}`;
		return this._httpClient.get<TestBlock>(url).pipe(
			tap((response) => {
				this._testBlock.next(response.data);
			})
		);
	}

	/**
	 * Get test by id
	 */
	getTestById(id: string): Observable<Test> {
		return this._testBlock.pipe(
			take(1),
			map((tests) => {
				// Find the module
				const test = tests.tests.find(item => item._id === id) || null;
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
		return this.testBlock$.pipe(
			take(1),
			switchMap(test => this._httpClient.delete(`${env.apiUrl}/test/${id}`).pipe(
					map((isDeleted: boolean) => {
						// Find the index of the deleted instance
						const index = test.tests.findIndex(item => item._id === id );

						// Delete the instance
						test.tests.splice(index, 1);

						// Update the tests
						this._testBlock.next(test);

						// Return the deleted status
						return isDeleted;
					})
				)
			)
		);
	}
}
