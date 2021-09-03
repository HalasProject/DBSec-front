import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Route, RouterModule } from '@angular/router';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { SharedModule } from 'app/shared/shared.module';
import { RunComponent } from 'app/modules/admin/apps/run/run.component';
import { MatListModule } from '@angular/material/list';
import { InstancesResolver } from '../instance/instance.resolvers';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const runRoutes: Route[] = [
    {
        path     : '',
        component: RunComponent,
        resolve: {
            instances: InstancesResolver
        }
    }
];

@NgModule({
    declarations: [
        RunComponent,
    ],
    imports     : [
        RouterModule.forChild(runRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatProgressBarModule,
        FuseHighlightModule,
        MatListModule,
        FuseScrollbarModule,
        SharedModule,
    ]
})
export class RunModule
{
}
