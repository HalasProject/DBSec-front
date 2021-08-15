import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Redirect empty path to '/home'
    {path: '', pathMatch : 'full', redirectTo: 'home'},

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'dashboard', loadChildren: () => import('app/modules/admin/apps/dashboard/dashboard.module').then(m => m.DashboardModule)},
            {path: 'instances', loadChildren: () => import('app/modules/admin/apps/instance/instance.module').then(m => m.InstanceModule)},
            {path: 'tests',     loadChildren: () => import('app/modules/admin/apps/module/module.module').then(m => m.ModuleModule)},
            {path: 'historys',  loadChildren: () => import('app/modules/admin/apps/history/history.module').then(m => m.HistoryModule)},
        ]
    }
];
