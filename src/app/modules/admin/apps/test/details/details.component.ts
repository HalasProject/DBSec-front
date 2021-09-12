import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	Renderer2,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
	ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
// import { Contact, Country, Tag } from 'app/modules/admin/apps/contacts/contacts.types';
import { TestListComponent } from 'app/modules/admin/apps/test/list/list.component';
import { Test, TestBlock } from '../test.type';
import { TestService } from '../test.service';

@Component({
	selector: 'contacts-details',
	templateUrl: './details.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestDetailsComponent implements OnInit, OnDestroy {
	@ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
	@ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
	@ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

	editMode: boolean = false;
	test: Test;
	tests: TestBlock;
	private _tagsPanelOverlayRef: OverlayRef;
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _changeDetectorRef: ChangeDetectorRef,
		private _testListComponent: TestListComponent,
		private _testService: TestService,
		private _formBuilder: FormBuilder,
		private _fuseConfirmationService: FuseConfirmationService,
		private _renderer2: Renderer2,
		private _router: Router,
		private activatedRoute: ActivatedRoute,
		private _overlay: Overlay,
		private _viewContainerRef: ViewContainerRef
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		// Open the drawer
		this._testListComponent.matDrawer.open();

		// Get the tests
		this._testService.testBlock$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((testBlock: TestBlock) => {
				this.tests = testBlock;

				// Mark for check
				this._changeDetectorRef.markForCheck();
			});

		// Get the test
		this._testService.test$.pipe(takeUntil(this._unsubscribeAll)).subscribe((test: Test) => {
			try {
				test.resultat = JSON.parse(test.resultat);
			} catch (e) {
				test.resultat = JSON.parse(JSON.stringify(test.resultat));
			}
			// Open the drawer in case it is closed
			this._testListComponent.matDrawer.open();
			// Get the contact
			this.test = test;

			// Toggle the edit mode off
			this.toggleEditMode(false);

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

		// Dispose the overlays if they are still on the DOM
		if (this._tagsPanelOverlayRef) {
			this._tagsPanelOverlayRef.dispose();
		}
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Close the drawer
	 */
	closeDrawer(): Promise<MatDrawerToggleResult> {
		return this._testListComponent.matDrawer.close();
	}

	/**
	 * Toggle edit mode
	 *
	 * @param editMode
	 */
	toggleEditMode(editMode: boolean | null = null): void {
		if (editMode === null) {
			this.editMode = !this.editMode;
		} else {
			this.editMode = editMode;
		}

		// Mark for check
		this._changeDetectorRef.markForCheck();
	}

	/**
	 * Delete the contact
	 */
	deleteContact(): void {
		// Open the confirmation dialog
		const confirmation = this._fuseConfirmationService.open({
			title: 'Delete contact',
			message: 'Are you sure you want to delete this contact? This action cannot be undone!',
			actions: {
				confirm: {
					label: 'Delete',
				},
			},
		});

		// Subscribe to the confirmation dialog closed action
		// confirmation.afterClosed().subscribe((result) => {
		// 	// If the confirm button pressed...
		// 	if (result === 'confirmed') {
		// 		// Get the current contact's id
		// 		const id = this.test.id;

		// 		// Get the next/previous contact's id
		// 		const currentContactIndex = this.test.tests.findIndex((item:Test) => item._id === id);
		// 		const nextContactIndex = currentContactIndex + (currentContactIndex === this.test.tests.length - 1 ? -1 : 1);
		// 		const nextContactId = this.test.tests.length === 1 && this.test.tests[0].id === id ? null : this.test.tests[nextContactIndex]._id;

		// 		// Delete the contact
		// 		this._testService.deleteTest(id).subscribe((isDeleted) => {
		// 			// Return if the contact wasn't deleted...
		// 			if (!isDeleted) {
		// 				return;
		// 			}

		// 			// Navigate to the next contact if available
		// 			if (nextContactId) {
		// 				this._router.navigate(['../', nextContactId], { relativeTo: this._activatedRoute });
		// 			}
		// 			// Otherwise, navigate to the parent
		// 			else {
		// 				this._router.navigate(['../'], { relativeTo: this._activatedRoute });
		// 			}

		// 			// Toggle the edit mode off
		// 			this.toggleEditMode(false);
		// 		});

		// 		// Mark for check
		// 		this._changeDetectorRef.markForCheck();
		// 	}
		// });
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
