import { Component, ViewEncapsulation } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { HistoryService } from './history.service';
import { Test } from './test.type';

@Component({
	selector: 'history',
	templateUrl: './history.component.html',
	encapsulation: ViewEncapsulation.None,
})
export class HistoryComponent {
	tests$: Observable<Test[]>;
	/**
	 * Constructor
	 */
	constructor(private _historyService: HistoryService) {
		// Get the modules
		this.tests$ = this._historyService.tests$;
	}

	/**
	 * Format the given ISO_8601 date as a relative date
	 *
	 * @param date
	 */
	formatDateAsRelative(date: string): string {
		return moment(date, moment.ISO_8601).fromNow();
	}

	deleteByUUID(uuid: string): void {
		this._historyService.deleteTestsByUUID(uuid).subscribe((isDeleted) => {
			// Return if the instance wasn't deleted...
			if (!isDeleted) {
				return;
			}
		});
	}
}
