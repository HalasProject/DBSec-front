import { InventoryModule } from '../module/inventory/inventory.types';

export interface TestBlock {
	_id: string;
	count: number;
	instance: string;
	tests: Test[];
}

export interface Test {
	_id?: string;
	instance_id: string;
	module_id: string;
	resultat: string;
	module: InventoryModule;
	error: boolean;
	created_at: Date;
}
