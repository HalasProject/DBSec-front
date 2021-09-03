import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { InstanceComponent } from 'app/modules/admin/apps/instance/instance.component';
import { MatIconModule } from '@angular/material/icon';
import { InstancesResolver } from './instance.resolvers';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { InstanceDetailsComponent } from './details/details.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const instanceRoutes: Route[] = [
    {
        path     : '',
        component: InstanceComponent,
        resolve: {
            instances: InstancesResolver
        }
    }
];

@NgModule({
    declarations: [
        InstanceComponent,
        InstanceDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(instanceRoutes),
        SharedModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        FuseScrollbarModule,
        MatFormFieldModule,
        MatDialogModule,
        MatSlideToggleModule

    ]
})
export class InstanceModule
{
}
