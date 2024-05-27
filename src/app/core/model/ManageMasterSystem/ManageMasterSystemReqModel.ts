export interface ManageMasterSystemReqModel {
    Id : number;
    Row_no : number ; 
    
    System: string;
    Description: string;
    create_by: string;

    create_date : string;

    update_by: string;

    update_date : string;
    status : string;

    System_code :string;
  }