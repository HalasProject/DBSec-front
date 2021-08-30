import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { Observable, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { InstanceService } from '../instance/instance.service';
import { Instance } from '../instance/instance.type';
import { InventoryService } from '../module/inventory/inventory.service';
import { InventoryModule } from '../module/inventory/inventory.types';
import { RunService } from './run.service';

@Component({
	selector: 'run',
	templateUrl: './run.component.html',
	encapsulation: ViewEncapsulation.None,
})
export class RunComponent {
	testForm: FormGroup;
	selectAllChecked: boolean;
    instances$: Observable<Instance[]>;

	private _unsubscribeAll: Subject<any> = new Subject<any>();

    isLoading:boolean;

	modules:InventoryModule[];
	@ViewChild('allModules') private allModules: MatSelectionList;
	/**
	 * Constructor
	 */
	constructor(private _formBuilder: FormBuilder,private _moduleService: InventoryService, private _runService: RunService, private _instanceService:InstanceService) {
		// Prepare the search form with defaults
		this.testForm = this._formBuilder.group({
			instance: [],
            modules_ids: []
		});
	}

	ngOnInit(): void {
        this.instances$ = this._instanceService.instances$.pipe(map(instances => instances.filter(instance => instance.enabled)));
    }

	/**
	 * Reset the search form using the default
	 */
	reset(): void {
		this.testForm.reset();
	}

	selectAll(isChecked: boolean): void {
		if (!isChecked) {
			this.allModules.deselectAll();
		} else {
			this.allModules.selectAll();
		}
	}

    getModulesByDB(){
       this._moduleService.getModulesByDB(this.instance.database_type).subscribe((data => this.modules = data.data));
    }

    runTest(){
        this.isLoading = true;
        let body = {
            instance_id : this.testForm.get('instance').value._id,
            modules_ids: this.testForm.get('modules_ids').value
        }
        this._runService.run(body).subscribe((data => {
            console.log(data)
            this.isLoading = false;  
         } ));
    }

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
	}

	get instance():Instance | null {
		return this.testForm.get('instance').value || null;
	}
}
