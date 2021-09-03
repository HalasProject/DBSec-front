import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Instance } from './instance.type';
import { environment as env } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InstanceService
{
    // Private
    private _instances: BehaviorSubject<Instance[] | null> = new BehaviorSubject(null);
    private _instance: BehaviorSubject<Instance | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for instances
     */
    get instances$(): Observable<Instance[]>
    {
        return this._instances.asObservable();
    }


    /**
     * Getter for instances
     */
     get instance$(): Observable<Instance>
     {
         return this._instance.asObservable();
     }
 


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get Instances
     */
    getInstances(search?): Observable<any>
    {
        let url = `${env.apiUrl}/instances`;
        if (search) url += `?search=${search}`;
        return this._httpClient.get<Instance[]>(url).pipe(
            tap((response) => {
                this._instances.next(response.data);
            })
        );
    }

    /**
     * Get instance by id
     */
    getInstanceById(id: string): Observable<Instance>
    {
        return this._instances.pipe(
            take(1),
            map((instances) => {

                // Find the module
                const instance = instances.find(item => item._id === id) || null;

                // Update the module
                this._instance.next(instance);

                // Return the module
                return instance;
            }),
            switchMap((instance) => {

                if ( !instance )
                {
                    return throwError('Could not found instance with id of ' + id + '!');
                }

                return of(instance);
            })
        );
    }

    /**
     * Create instance
     */
    createInstance(instance: Instance): Observable<Instance>
    {
        return this.instances$.pipe(
            take(1),
            switchMap(instances => this._httpClient.post<Instance>(`${env.apiUrl}/instance`, instance ? {data:instance} : {}).pipe(
                map((newInstance) => {

                    // Update the modules with the new module
                    this._instances.next([newInstance, ...instances]);

                    // Return the new module
                    return newInstance;
                })
            ))
        );
    }

    /**
     * Update instance
     *
     * @param id
     * @param module
     */
    updateInstance(id: string, instance): Observable<any>
    {
        if (!id) return of ([])
        return this.instances$.pipe(
                take(1),
                switchMap(instances => this._httpClient.put<Instance>(`${env.apiUrl}/instance/${id}`, {
                    ...{data:instance}
                }).pipe(
                    map((updatedInstance) => {
    
                        // Find the index of the updated module
                        const index = instances.findIndex(item => item._id === id);
    
                        // Update the module
                        instances[index] = updatedInstance;
    
                        // Update the module
                        this._instances.next(instances);
    
                        // Return the updated module
                        return updatedInstance;
                    })
                ))
            );
    }

    /**
     * Delete the instance
     *
     * @param id
     */
    deleteInstance(id: string): Observable<boolean>
    {
        return this.instances$.pipe(
            take(1),
            switchMap(instances => this._httpClient.delete(`${env.apiUrl}/instance/${id}`).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted instance
                    const index = instances.findIndex(item => item._id === id);

                    // Delete the instance
                    instances.splice(index, 1);

                    // Update the instances
                    this._instances.next(instances);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }
}
