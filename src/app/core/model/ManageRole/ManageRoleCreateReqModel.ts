export interface ManageRoleCreateReqModel {

    Role_name : string ;
    Description : string ;
    is_active : string ;

    screens : Scrren[] ;

    create_by: string;
    update_by: string;
    create_date: string;
    update_date: string;
  }

  export interface Scrren {
    Screen_name : string ;
    Screen_description :string ;

    actions : ActionSelected [] ;
  }

  export interface ActionSelected {
    Row_no : number ;
    Action_name : string ;
    description :string ;
    
  }