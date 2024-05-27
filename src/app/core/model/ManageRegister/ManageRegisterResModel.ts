export interface ManageRegisterResModel {

  Id : number ;
  Row_no : number;
  user_name: string;
  password :string;
  password_confirm :string;

  email :string;
  system: string;

  request_date : string;
  request_status: string;
  is_active: string;

  create_by: string;
  update_by: string;
  create_date: string;
  update_date: string;
  }