import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Route, RouterModule } from '@angular/router';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { TestComponent } from 'app/modules/admin/apps/test/test.component';
import { SharedModule } from 'app/shared/shared.module';
import { TestDetailsComponent } from './details/details.component';
import { TestListComponent } from './list/list.component';
import { OneTestResolver, TestResolver } from './test.resolvers';

const testRoutes: Route[] = [
	{
		path: '',
		component: TestComponent,
		children: [
			{
				path: ':uuid',
				component: TestListComponent,
				resolve: {
					tests: TestResolver,
				},
				children: [
					{
						path: ':id',
						component: TestDetailsComponent,
                        resolve: {
                            test: OneTestResolver
                        }
					},
				],
			},
		],
	},
];

@NgModule({
	declarations: [TestComponent, TestDetailsComponent, TestListComponent],
	imports: [
		RouterModule.forChild(testRoutes),
		SharedModule,
		MatButtonModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatDividerModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatMenuModule,
		MatMomentDateModule,
		MatProgressBarModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatTableModule,
		MatTooltipModule,
		FuseFindByKeyPipeModule,
	],
})
export class TestModule {}
