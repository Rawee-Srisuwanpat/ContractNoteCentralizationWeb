export interface ContractNoteReqModel {
    Id : number;
    User_id : number ; 
    
    User_name: string;
    Email : string;
    
    authenticate: string;
    create_by: string;

    create_date : string;

    update_by: string;

    update_date : string;
    
  }