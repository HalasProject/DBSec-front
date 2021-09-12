import { Component, ViewEncapsulation } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { TestService } from './test.service';
import { Test, TestBlock } from './test.type';

@Component({
	selector: 'test',
	templateUrl: './test.component.html',
	encapsulation: ViewEncapsulation.None,
})
export class TestComponent {
	testBlock$: Observable<TestBlock>;
	/**
	 * Constructor
	 */
	constructor(private _testService: TestService) {
		// Get the modules
		this.testBlock$ = this._testService.testBlock$;
	}

	/**
	 * Format the given ISO_8601 date as a relative date
	 *
	 * @param date
	 */
	formatDateAsRelative(date: string): string {
		return moment(date, moment.ISO_8601).fromNow();
	}
}
