import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InventoryService } from 'app/modules/admin/apps/module/inventory/inventory.service';
import { InventoryPagination, InventoryModule } from 'app/modules/admin/apps/module/inventory/inventory.types';


@Injectable({
    providedIn: 'root'
})
export class InventoryModuleResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _inventoryService: InventoryService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InventoryModule>
    {
        return this._inventoryService.getModuleById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested product is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}

@Injectable({
    providedIn: 'root'
})
export class InventoryModulesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: InventoryService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: InventoryPagination; products: InventoryModule[] }>
    {
        return this._inventoryService.getModules();
    }
}
