import { Route } from '@angular/router';
import { InventoryComponent } from 'app/modules/admin/apps/module/inventory/inventory.component';
import { InventoryListComponent } from 'app/modules/admin/apps/module/inventory/list/inventory.component';
import { InventoryModulesResolver } from 'app/modules/admin/apps/module/inventory/inventory.resolvers';

export const moduleRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'inventory'
    },
    {
        path     : 'inventory',
        component: InventoryComponent,
        children : [
            {
                path     : '',
                component: InventoryListComponent,
                resolve  : {
                    products  : InventoryModulesResolver,
                }
            }
        ]
        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    }
];
