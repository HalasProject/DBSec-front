import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { InstanceService } from '../instance.service';
import { Instance } from '../instance.type';

@Component({
    selector       : 'notes-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstanceDetailsComponent implements OnInit, OnDestroy
{
    instance$: Observable<Instance>;

    instanceChanged: Subject<Instance> = new Subject<Instance>();
    dialect = ['mysql','postgres','sqlite','mariadb','mssql'];

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { instance: Instance },
        private _instanceService: InstanceService,
        private _matDialogRef: MatDialogRef<InstanceDetailsComponent>
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
        // Edit
        if ( this._data?.instance?._id )
        {
            // Request the data from the server
            this._instanceService.getInstanceById(this._data.instance._id).subscribe();

            // Get the instance
            this.instance$ = this._instanceService.instance$;

        }
        // Add
        else
        {
            // Create an empty note
            const instance: Instance = {
                name:'',
                database_type: '',
                server: '',
                port: 3306,
                database: '',
                privileged_account: '',
                privileged_account_password: '',
                application_account: '',
                configuration_file: '',
                enabled: true,
            };

            this.instance$ = of(instance);
        }

        // Subscribe to note updates
        this.instanceChanged
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                switchMap(instance => this._instanceService.updateInstance(instance._id,instance)))
            .subscribe(() => {

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
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
     * Create a new instance
     *
     * @param instance
     */
    createInstance(instance: Instance): void
    {
        this._instanceService.createInstance(instance).pipe(
            map(() => {

                // Get the instance
                this.instance$ = this._instanceService.instance$;
            })).subscribe();
    }

    /**
     * Toggle archived status on the given instance
     *
     * @param instance
     */
    toggleArchiveOnInstance(instance: Instance): void
    {
        instance.enabled = !instance.enabled;

        // Update the instance
        this.instanceChanged.next(instance);

        // Close the dialog
        this._matDialogRef.close();
    }

    /**
     * Update the instance details
     *
     * @param instance
     */
    updateInstanceDetails(instance: Instance): void
    {
        this.instanceChanged.next(instance);
    }

    /**
     * Delete the given instance
     *
     * @param instance
     */
    deleteInstance(instance: Instance): void
    {
        this._instanceService.deleteInstance(instance._id)
            .subscribe((isDeleted) => {

                // Return if the instance wasn't deleted...
                if ( !isDeleted )
                {
                    return;
                }

                // Close the dialog
                this._matDialogRef.close();
            });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
