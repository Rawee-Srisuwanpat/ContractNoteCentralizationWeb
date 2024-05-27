import { Scrren } from "./ManageRoleCreateReqModel";

export interface ManageRoleReqModel {

    Id : number ;


    Role_name: string;
    Role_description :string;
    is_active: string;

    screens : Scrren[]
    create_by: string;
    update_by: string;
    create_date: string;
    update_date: string;
  }