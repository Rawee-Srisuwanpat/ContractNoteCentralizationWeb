
export interface LogApiInquiryReqModel {
    transaction_Id : string
    data : Data 
    page : Page
    
}

export interface Data {
    transaction_id : string  

    method : string

    controller : string
    internal_status_code : string
    http_status_code : string
    ip_request : string
    system_code : string
   
    create_date : string
    update_date :string 
    
  

  }

  export interface Page {
    page_no : string 
    page_size : string

  }