import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InventoryPagination, InventoryModule } from 'app/modules/admin/apps/module/inventory/inventory.types';
import { InventoryService } from 'app/modules/admin/apps/module/inventory/inventory.service';

@Component({
    selector       : 'inventory-list',
    templateUrl    : './inventory.component.html',
    styleUrls      : ['./inventory.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
})

export class InventoryListComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    modules$: Observable<InventoryModule[]>;

    dialect = ['mysql','postgres','sqlite','mariadb','mssql'];
    categories = ['Information', 'Configuration', 'Privilege', 'User','System'];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: FormControl = new FormControl();
    selectedModule: InventoryModule | null = null;
    selectedModuleForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _inventoryService: InventoryService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the selected Module form
        this.selectedModuleForm = this._formBuilder.group({
            _id                : [''],
            category           : [''],
            title              : ['', [Validators.required]],
            description        : [''],
            database           : this._formBuilder.group({
                type           : [''],
                version        : ['']
            }),
            sql                : [''],
            readMore           : [''],
            enabled            : [false]
        });


        // Get the modules
        this.modules$ = this._inventoryService.modules$;

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getModules(query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'name',
                start       : 'asc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get Modules if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    // return this._inventoryService.getModules(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction,null);

                    return this._inventoryService.getModules(null);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle Module details
     *
     * @param moduleId
     */
    toggleDetails(moduleId: string): void
    {
        // If the module is already selected...
        if ( this.selectedModule && this.selectedModule._id === moduleId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the module by id
        this._inventoryService.getModuleById(moduleId)
            .subscribe((module) => {

                // Set the selected module
                this.selectedModule = module;

                // Fill the form
                this.selectedModuleForm.patchValue(module);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedModule = null;
    }

    /**
     * Create module
     */
    createModule(): void
    {
        // Create the module
        this._inventoryService.createModule().subscribe((newModule) => {
            console.log({newModule});
            // Go to new Module
            this.closeDetails();
            this.selectedModule = newModule;

            // Fill the form
            this.selectedModuleForm.reset();
            this.selectedModuleForm.patchValue(newModule);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Update the selected Module using the form data
     */
    updateSelectedModule(): void
    {
        // Get the Module object
        const module = this.selectedModuleForm.getRawValue();

        // Update the module on the server
        this._inventoryService.updateModule(module._id, module).subscribe(() => {

            // Show a success message
            console.log('message updated');
            this.showFlashMessage('success');
        });
    }

    /**
     * Delete the selected module using the form data
     */
    deleteSelectedModule(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete module',
            message: 'Are you sure you want to remove this module? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {

                // Get the module object
                const module = this.selectedModuleForm.getRawValue();

                // Delete the module on the server
                this._inventoryService.deleteModule(module._id).subscribe(() => {

                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void
    {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }
}
