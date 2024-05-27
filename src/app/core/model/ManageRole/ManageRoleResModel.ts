export interface ManageRoleResModel {

    Id : number ;
    Row_no : number;

    Role_code :string ;

    Id_tbm_Role :number ;

    Role_name : string;
    Screen_code : string ;
    Screen_text :string

    description : string;
    is_active : string 

    visible_menu : string;
    create_data : string;
    edit_data : string;
    view_data : string;
    delete_data : string;

    create_by: string;
    update_by: string;
    create_date: string;
    update_date: string;
  }