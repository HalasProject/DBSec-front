import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { HistoryComponent } from 'app/modules/admin/apps/history/history.component';

const historyRoutes: Route[] = [
    {
        path     : '',
        component: HistoryComponent
    }
];

@NgModule({
    declarations: [
        HistoryComponent
    ],
    imports     : [
        RouterModule.forChild(historyRoutes)
    ]
})
export class HistoryModule
{
}
