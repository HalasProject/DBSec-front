import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Route, RouterModule } from '@angular/router';
import { HistoryComponent } from 'app/modules/admin/apps/history/history.component';
import { SharedModule } from 'app/shared/shared.module';
import { HistoryResolver } from './history.resolvers';

const historyRoutes: Route[] = [
    {
        path     : '',
        component: HistoryComponent,
        resolve: {
            instances: HistoryResolver
        }
    }
];

@NgModule({
    declarations: [
        HistoryComponent
    ],
    imports     : [
        RouterModule.forChild(historyRoutes),
        SharedModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
    ]
})
export class HistoryModule
{
}
