
export interface InquiryReqModel {
    transaction_Id : string
    data : Data 
    page : Page
    
}

export interface Data {
    contract_no : string  
    request_no :string 
    telephone_no :string
    note :string
    action_code :string 
    related_dept_code :string
    result_code :string
    //contact_date : string
    remind_date :string
    PTP_Amount : string
    next_action_code : string 
    next_result_code :string 
    collector_code :string 
    request_doc_flag : string 
    request_doc_other : string 
    note_dept_code : string
    create_by :string
    create_date : string
    update_by :string 
    update_date :string 
    payment_no :string
    tel_sms : string 

    create_date_from : string
    create_date_to : string
    contact_date_from : string
    contact_date_to : string
    system_code : string
    collector_team_code : string

  }

  export interface Page {
    page_no : string 
    page_size : string

  }