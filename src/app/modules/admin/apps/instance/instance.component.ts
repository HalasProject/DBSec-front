import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { InstanceDetailsComponent } from './details/details.component';
import { InstanceService } from './instance.service';
import { Instance } from './instance.type';

@Component({
    selector     : 'instance',
    templateUrl  : './instance.component.html',
    encapsulation: ViewEncapsulation.None
})
export class InstanceComponent implements OnInit
{
    instances$: Observable<Instance[]>;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _instanceService: InstanceService,
        private _matDialog: MatDialog)
    {
    }

    ngOnInit(): void{
         // Get the modules
         this.instances$ = this._instanceService.instances$;

        //    // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((query) => {
                this.isLoading = true;
                return this._instanceService.getInstances(query);
            }),
            map(() => {
                this.isLoading = false;
            })
        )
        .subscribe();
    }

    openDialog(instance: Instance): void{
        console.log({instance});
        this._matDialog.open(InstanceDetailsComponent, {
            autoFocus: false,
            data     : {
                instance: instance ?? null
            }
        });
    }

    /**
     * Format the given ISO_8601 date as a relative date
     *
     * @param date
     */
     formatDateAsRelative(date: string): string
     {
         return moment(date, moment.ISO_8601).fromNow();
     }

     /**
      * Track by function for ngFor loops
      *
      * @param index
      * @param item
      */
     trackByFn(index: number, item: any): any
     {
         return item._id || index;
     }

}
