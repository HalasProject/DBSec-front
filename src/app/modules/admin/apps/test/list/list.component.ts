import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
// import { Test, Country } from 'app/modules/admin/apps/contacts/contacts.types';
import { TestService } from 'app/modules/admin/apps/test/test.service';
import { Test, TestBlock } from 'app/modules/admin/apps/test/test.type';
import moment from 'moment';

@Component({
	selector: 'contacts-list',
	templateUrl: './list.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestListComponent implements OnInit, OnDestroy {
	@ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

	testBlock$: Observable<TestBlock>;
	selectedTest: Test;
	testsCount: number = 0;

	drawerMode: 'side' | 'over';
	searchInputControl: FormControl = new FormControl();
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _changeDetectorRef: ChangeDetectorRef,
		private _testService: TestService,
		@Inject(DOCUMENT) private _document: any,
		private _router: Router,
		private _fuseMediaWatcherService: FuseMediaWatcherService
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		// Get the tests
		this.testBlock$ = this._testService.testBlock$;
		this._testService.testBlock$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((test: TestBlock) => {
				// Update the counts
				this.testsCount = test.tests.length;

				// Mark for check
				this._changeDetectorRef.markForCheck();
			});

		// Get the test
		this._testService.test$.pipe(takeUntil(this._unsubscribeAll)).subscribe((test: Test) => {
			// Update the selected contact
			this.selectedTest = test;

			// Mark for check
			this._changeDetectorRef.markForCheck();
		});

		// Subscribe to search input field value changes
		this.searchInputControl.valueChanges
			.pipe(
				takeUntil(this._unsubscribeAll),
				switchMap(query => null /* this._testService.searchContacts(query)*/ )
			)
			.subscribe();

		// Subscribe to MatDrawer opened change
		this.matDrawer.openedChange.subscribe((opened) => {
			if (!opened) {
				// Remove the selected contact when drawer closed
				this.selectedTest = null;

				// Mark for check
				this._changeDetectorRef.markForCheck();
			}
		});

		// Subscribe to media changes
		this._fuseMediaWatcherService.onMediaChange$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe(({ matchingAliases }) => {
				// Set the drawerMode if the given breakpoint is active
				if (matchingAliases.includes('lg')) {
					this.drawerMode = 'side';
				} else {
					this.drawerMode = 'over';
				}

				// Mark for check
				this._changeDetectorRef.markForCheck();
			});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On backdrop clicked
	 */
	onBackdropClicked(): void {
		// Go back to the list
		this._router.navigate(['./'], { relativeTo: this._activatedRoute });

		// Mark for check
		this._changeDetectorRef.markForCheck();
	}

	/**
	 * Format the given ISO_8601 date as a relative date
	 *
	 * @param date
	 */
	formatDateAsRelative(date: string): string {
		return moment(date, moment.ISO_8601).fromNow();
	}

	/**
	 * Track by function for ngFor loops
	 *
	 * @param index
	 * @param item
	 */
	trackByFn(index: number, item: any): any {
		return item.id || index;
	}
}
