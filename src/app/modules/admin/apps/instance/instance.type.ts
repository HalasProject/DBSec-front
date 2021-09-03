export interface Instance
{
    _id?: string;
    name: string;
    database_type: string;
    server: string;
    port: number;
    database: string;
    privileged_account: string;
    privileged_account_password: string;
    application_account: string;
    configuration_file: string;
    enabled: boolean;
}
