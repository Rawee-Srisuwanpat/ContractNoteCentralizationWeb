import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';


import { PeriodicElement } from 'src/app/core/model/PeriodicElement'
import { MatTableDataSource } from '@angular/material/table';


import { ConfirmationService, MessageService, SelectItem, SelectItemGroup, TreeNode } from 'primeng/api';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent2 } from 'src/app/core/model/PageEvent';

import * as $ from 'jquery'
import { ManageMasterSystemReqModel } from 'src/app/core/model/ManageMasterSystem/ManageMasterSystemReqModel';
import { MasterSystemService } from 'src/app/core/services/master-system.service';
import { ContractNoteResModel } from 'src/app/core/model/contract-note/contractNoteResModel';
import { ContractNoteService } from 'src/app/core/services/contract-note.service';
import { MasterReqModel } from 'src/app/core/model/Master/MasterReqModel';
import { MasterService } from 'src/app/core/services/master.service';
import { Observable, of } from 'rxjs';
import { MasterResModel } from 'src/app/core/model/Master/MasterResModel';
import { ActionCodeResModel } from 'src/app/core/model/Master/ActionCodeResModel';
import { City } from 'src/app/core/model/City';
import { ResultCodeResModel } from 'src/app/core/model/Master/ResultCodeResModel';
import { Data, InquiryReqModel, Page } from 'src/app/core/model/FollowUp/InquiryReqModel';
import { CollectorTeamCodeResModel } from 'src/app/core/model/Master/CollectorTeamCodeResModel';
import { CollectorCodeResModel } from 'src/app/core/model/Master/CollectorCodeResModel';


interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}



@Component({
  selector: 'app-contract-note',
  templateUrl: './contract-note.component.html',
  styleUrls: ['./contract-note.component.scss'],
})




export class ContractNoteComponent implements OnInit, AfterViewInit {

  filteredCountries: any[] | undefined;
  filteredActionCode: any[] | undefined;
  filteredResultCode: any[] | undefined;
  filteredCollectorCode: any[] | undefined;

  filteredCollectorTeamCode: any[] | undefined;

  filteredSystem: any[] | undefined;

  isShowAllNoteText : boolean = false

  visible: boolean = false

  isEdit: boolean = false

  formSearch: FormGroup;
  DialogSearchCollectorTeamCodeFormSearch: FormGroup;

 

  systemList: ManageMasterSystemReqModel[]
  systemList$: Observable<ManageMasterSystemReqModel[]> = of([])


  actionCodeList$: Observable<ActionCodeResModel[]> = of([])
  actionCodeList: ActionCodeResModel[] 

  resultCodeList$: Observable<ResultCodeResModel[]> = of([])
  resultCodeList : ResultCodeResModel[]

  collectorTeamCodeList$: Observable<CollectorTeamCodeResModel[]> = of([])
  collectorTeamCodeList : CollectorTeamCodeResModel[]

  collectorCodeList$: Observable<CollectorCodeResModel[]> = of([])
  collectorCodeList : CollectorCodeResModel[]


  selection = new SelectionModel<PeriodicElement>(true, []);


  files!: TreeNode[];

  filesAll!: TreeNode[];

  
  selectedCountry: City | undefined;


  selectedSystem: City | undefined;
  selectedActionCode: City | undefined;
  selectedResultCode: City | undefined;
  selectedCollectorCode: City | undefined;
  selectedCollectorTeamCode: City | undefined;



  countries: City[] | undefined;
  // groupedCities: SelectItemGroup[]; 
  items: SelectItem[];
  item: string;

  myIndex: number = 0

  isLoading: boolean = false

  isShowDialogSearch : boolean = false



  ELEMENT_DATA: ContractNoteResModel[] = [];



  displayedColumnsCollectorTeam : string[] = ['Row_no', 'Id' ,'Contract_No'] ;


  //displayedColumns: string[] = ['select','position', 'name', 'weight', 'symbol','actions'];
  displayedColumns: string[] = ['Row_no', 'Id', 'contract_no', 'customer_name', 'Tel', 'system_name', 'Note',
    'contact_date', 'action_code', 'result_code', 'Remind_Date', 'Payment_Card_No', 'Dept_Code',
    'Related_Dept' , 'collector_team_code' , 'Collector_Code', 'collector_name', 'create_by', 'create_date', 'Tel_SMS'

  ];
    // 'Emp_Code', 'Employee_Name' ,'Contact_Type', 'Statement', 'Payment_Notification_Document', 'Copy_of_the_Register_Books',
    // 'Bill_Pay-In', 'Payment_Confirmation', 'Transfer_of_Ownership_Document', 'Power_of_Attorney',
    // 'Other', 'Other1', 'Tel_SMS', 'Result_Code_Filter', 'legal_act', 'Actual_cc'];
  //dataSource = new MatTableDataSource(this.GetAllData());
  dataSource = new MatTableDataSource(this.GetAllContract());

  taskForm: FormGroup

  //pageEvent: PageEvent;
  pageIndex = 0;
  pageSize = 20;
  length = 50;


  is_search: boolean = false



  //AAA: string = 'Select a Country'

  page: number = 0;
  first: number = 0;
  rows: number = 5;
  //total: number = 0;



  constructor(private apiService: ApiService
    , private confirmationService: ConfirmationService
    , private messageService: MessageService
    , private router: Router
    , private fb: FormBuilder
    , private _liveAnnouncer: LiveAnnouncer
    , private masterSystemService: MasterSystemService
    , private masterService: MasterService
    , private contractNoteService: ContractNoteService
  ) { }


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.paginator = this.paginator;

    //console.log( $('#ddlItemPerPage')[0].innerText )

    //$('#ddlItemPerPage')[0].innerText = '10'

  }

  ngOnInit() {

    //this.GetAllContract()
    //return 
    this.countries = [
      { name: 'Australia', code: 'AU' },
      { name: 'Brazil', code: 'BR' },
      { name: 'China', code: 'CN' },
      { name: 'Egypt', code: 'EG' },
      { name: 'France', code: 'FR' },
      { name: 'Germany', code: 'DE' },
      { name: 'India', code: 'IN' },
      { name: 'Japan', code: 'JP' },
      { name: 'Spain', code: 'ES' },
      { name: 'United States', code: 'US' },
      { name: 'aSYS ข้อมูลจากระบบ', code: 'aSYS' }

    ];



    this.getMasterData()
    this.getAllCollectorTeamCode()
    this.getAllCollectorCode()
    this.GetAllSystemData()
    this.getAllActionCode()
    this.getAllResultCode()
    this.createFormSearch()

  }

  getAllActionCode() {
    let req: MasterReqModel
    this.masterService.GetAllActionCode().subscribe(x => {
      if (x.status_code == '00') {

        const result = x.payload.sort( (a,b) => a.action_code < b.action_code ? -1 : 1 )


        // const resultNew = [{
        //   "action_code": '-1',
        //   "description": 'Please select',

        // }].concat(result)

        this.actionCodeList$ = of(result) //of(x.payload)
        this.actionCodeList = result



      } else {
        console.log(x)
      }
    })

  }

  getAllResultCode() {
    let req: MasterReqModel
    this.masterService.GetAllResultCode().subscribe(x => {
      if (x.status_code == '00') {

        const result = x.payload.sort( (a,b) => a.result_code < b.result_code ? -1 : 1 )


        // const resultNew = [{
        //   "result_code": '-1',
        //   "description": 'Please select',

        // }].concat(result)

        this.resultCodeList$ = of(result)//of(x.payload)
        this.resultCodeList = result



      } else {
        console.log(x)
      }
    })

  }

  getAllCollectorTeamCode() {
    let req: MasterReqModel
    this.masterService.GetAllCollectorTeamCode().subscribe(x => {
      if (x.status_code == '00') {

        const result = x.payload.sort( (a,b) => a.result_code < b.result_code ? -1 : 1 )


        // const resultNew = [{
        //   "team_code": '-1',
        //   "team_name": 'Please select',

        // }].concat(result)

        this.collectorTeamCodeList$ = of(result)//of(x.payload)

        this.collectorTeamCodeList = result



      } else {
        console.log(x)
      }
    })

  }

  getAllCollectorCode() {
    let req: MasterReqModel
    this.masterService.GetAllCollectorCode().subscribe(x => {
      if (x.status_code == '00') {

        const result = x.payload.sort( (a,b) => a.result_code < b.result_code ? -1 : 1 )


        // const resultNew = [{
        //   "team_code": '-1',
        //   "team_name": 'Please select',

        // }].concat(result)

        this.collectorCodeList$ = of(result)//of(x.payload)

        this.collectorCodeList = result



      } else {
        console.log(x)
      }
    })

  }

  getMasterData() {
    let req: MasterReqModel
    this.masterService.GetAllMaster().subscribe(x => {
      if (x.status_code == '00') {

        // Status-Request
        const result = x.payload.filter(x => {
          return x.master_type == '003'
        })

        //Status is Active
        const resultIsActive = x.payload.filter(x => {
          return x.master_type == '001' || x.master_type == '007'
        })

        //this.statusRequest$ = of(result)
        //this.statusIsActive$ = of(resultIsActive)

        //this.statusRequest = result
        //this.statusIsActive = resultIsActive.sort( (a,b) => a.orderList < b.orderList ? -1 : 1 )

        // this.formSearch.patchValue({
        //   //request_status : result[0].master_value ,
        //   is_active: this.statusIsActive[0].master_value
        //   //is_active: this.statusIsActive.find(x => x.master_value == '-1').master_value
        // })


      } else {
        console.log(x)
      }
    })
  }

  GetAllSystemData() {
    let req: ManageMasterSystemReqModel
    this.masterSystemService.searchMasterSystem().subscribe(x => {
      if (x.status_code == '00') {

        const result = x.payload.filter(x => {
          return x.status == '1'
        })

        this.systemList = result

        // const resultNew = [{
        //   "Row_no": 0,
        //   "Id": -1,
        //   "System": "Please select",
        //   "Description": "",
        //   "create_by": "Manual|2023-12-13T07:22:57.760Z",
        //   "create_date": "2023-12-13T07:22:57.76",
        //   "update_by": "Manual|2023-12-13T07:22:57.761Z",
        //   "update_date": "2023-12-13T07:22:57.76",
        //   "status": "1",
        //   "System_code": "-1"
        // }].concat(result)

        //console.log(resultNew)
        //this.systemList = of(x.payload)

        this.systemList$ = of(result)

        // this.formSearch.patchValue({
        //   system: resultNew[0].Id
        // })

      } else {
        console.log(x)
      }
    })
  }

  createFormSearch() {
    this.formSearch = this.fb.group({
      txtSearch: '',
      is_active: -1,
      system: '',
      actionCode: -1,
      resultCode: -1,
      create_end_Date: '',
      contract_date: '', 
      CollectorTeamCode : '',
      CollectorCode : '',
    });


  }

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        this.visible = false
      },
      reject: () => {
        //this.ref.destroy() // cannot use 555
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });

  }


  handlePageEvent(e: PageEvent) {


    // this.pageEvent = e;
    // this.length = e.length;
    // this.pageSize = e.pageSize;
    // this.pageIndex = e.pageIndex;

    //this.paginator = e
    console.log(e)

    this.GetAllContractByPage(e.pageIndex)

    // this.pageEvent = e;
    this.length = e.length;
    // this.pageSize = e.pageSize;
    // this.pageIndex = e.pageIndex ;

    this.myIndex = e.pageSize * e.pageIndex


  }

  onRowClickView(row: any) {
    this.router.navigate(['/contract-note-detail']);
  }




  onPageChange(event: PageEvent2) {
    this.first = event.first;
    this.rows = event.rows;
  }

  onPageChange2(event: PageEvent2) {

    this.first = event.first;
    this.rows = event.rows;
    this.page = event.page;


    this.files = this.filesAll.slice(this.first, this.first + this.rows)



    console.log(event)

    console.log(this.files)
    console.log(this.filesAll)
  }

  onDDLChange2(a: any) {
    console.log(a)

    this.page = a.value
    this.first = 0;
    this.rows = a.value;

    this.files = this.filesAll.slice(0, this.page)

  }

  

  GetAllContract() {
    this.isLoading = true
    const req = {} as InquiryReqModel
    const data = {} as Data
    const page = {} as Page

    req.transaction_Id = this.getTransactionId() //'2002248524485'
    req.data = data
    req.page = page

    req.data.contract_no = ''
    req.data.request_no = ''
    req.data.telephone_no = ''
    req.data.note = ''
    req.data.action_code = ''
    req.data.related_dept_code = ''
    req.data.result_code = ''
    //req.data.contact_date = ''
    req.data.remind_date = ''
    req.data.PTP_Amount = ''
    req.data.next_action_code = ''
    req.data.next_result_code = ''
    req.data.collector_code = ''
    req.data.request_doc_flag = ''
    req.data.request_doc_other = ''
    req.data.note_dept_code = ''
    req.data.create_by = ''
    req.data.create_date = ''
    req.data.update_by = ''
    req.data.update_date = ''
    req.data.payment_no = ''
    req.data.tel_sms = ''

    req.data.create_date_from = ''
    req.data.create_date_to =  ''
    req.data.contact_date_from = ''
    req.data.contact_date_to = ''
    req.data.system_code = ''
    req.data.collector_team_code = ''


    req.page.page_no = '1'
    req.page.page_size = '20'
    this.contractNoteService.searchContractNoteByInquiryWeb(req).subscribe(x => {
      console.log(x)
      if (x.status.status_code == '00') {

        

        //const result = x.data.sort( (a,b) => a.contact_date < b.contact_date ? -1 : 1 )

        this.ELEMENT_DATA = x.data
        //this.ELEMENT_DATA = result

        this.dataSource.data = this.ELEMENT_DATA


        

        this.length = x.page.total_rows

        this.isLoading = false
      } else {
        console.log(x)
        this.isLoading = false
      }
    })
    return this.ELEMENT_DATA

  }


  GetAllContractByPage(page_no: number) {
    this.isLoading = true
    console.log(this.formSearch.value.CollectorCode)

    let contact_date_start = ''
    let contact_date_end = ''
    if (this.formSearch.value.contract_date != '') {
      let dateStart = (this.formSearch.value.contract_date[0] + '').split(" ")
      let dateStart1 = new Date(dateStart[3] + '-' + dateStart[1] + dateStart[2] + " 00:00:00")
      let dateStart2 = new Date(dateStart[3] + '-' + dateStart[1] + dateStart[2] + " 23:59:59")

      let dateEnd = (this.formSearch.value.contract_date[1] + '').split(" ")
      let dateEnd1 = new Date(dateEnd[3] + '-' + dateEnd[1] + dateEnd[2] + " 23:59:59")

       //console.log(dateStart1.toLocaleDateString('en-CA'))
       //console.log(dateEnd1.toDateString()) // Invalid Date

       contact_date_start = dateStart1.toLocaleDateString('en-CA')
       
      if (dateEnd1.toDateString() != 'Invalid Date') {
        // result = result.filter(s => new Date(s.Contact_Date) >= dateStart1
        //   && new Date(s.create_date) <= dateEnd1)
      } else {
        dateEnd1 = dateStart2
        //result = result.filter(s => new Date(s.Contact_Date) >= dateStart1 && new Date(s.Contact_Date) <= dateStart2)
      }

      contact_date_end = dateEnd1.toLocaleDateString('en-CA')
      console.log(dateStart1.toLocaleDateString('en-CA'))
      console.log(dateEnd1.toLocaleDateString('en-CA'))
    }


    let create_date_start = ''
    let create_date_end = ''
    if (this.formSearch.value.create_end_Date != '') {
      let dateStart = (this.formSearch.value.create_end_Date[0] + '').split(" ")
      let dateStart1 = new Date(dateStart[3] + '-' + dateStart[1] + dateStart[2] + " 00:00:00")
      let dateStart2 = new Date(dateStart[3] + '-' + dateStart[1] + dateStart[2] + " 23:59:59")

      let dateEnd = (this.formSearch.value.create_end_Date[1] + '').split(" ")
      let dateEnd1 = new Date(dateEnd[3] + '-' + dateEnd[1] + dateEnd[2] + " 23:59:59")

       //console.log(dateStart1.toLocaleDateString('en-CA'))
       //console.log(dateEnd1.toDateString()) // Invalid Date

       create_date_start = dateStart1.toLocaleDateString('en-CA')
       
      if (dateEnd1.toDateString() != 'Invalid Date') {
        // result = result.filter(s => new Date(s.Contact_Date) >= dateStart1
        //   && new Date(s.create_date) <= dateEnd1)
      } else {
        dateEnd1 = dateStart2
        //result = result.filter(s => new Date(s.Contact_Date) >= dateStart1 && new Date(s.Contact_Date) <= dateStart2)
      }

      create_date_end = dateEnd1.toLocaleDateString('en-CA')
      console.log(dateStart1.toLocaleDateString('en-CA'))
      console.log(dateEnd1.toLocaleDateString('en-CA'))
    }



    const req = {} as InquiryReqModel
    const data = {} as Data
    const page = {} as Page

    if (this.is_search == true) {

      let system_code =  (this.formSearch.value.system?.System ==  undefined) ?  this.systemList.filter(z => z.System?.toLocaleUpperCase() == this.formSearch.value.system?.toLocaleUpperCase())[0]?.System_code   : this.formSearch.value.system.System_code
      let action_code = (this.formSearch.value.actionCode?.action_code ==  undefined) ?  this.formSearch.value.actionCode  : this.formSearch.value.actionCode.action_code
      let result_code = (this.formSearch.value.resultCode?.result_code ==  undefined) ?  this.formSearch.value.resultCode  : this.formSearch.value.resultCode.result_code
      let collector_team_code = (this.formSearch.value.CollectorTeamCode?.team_code ==  undefined) ?  this.formSearch.value.CollectorTeamCode  : this.formSearch.value.CollectorTeamCode.team_code
      let collector_code =  (this.formSearch.value.CollectorCode?.collector_code ==  undefined) ?  this.formSearch.value.CollectorCode  : this.formSearch.value.CollectorCode.collector_code

      
      console.log(this.formSearch.value.system)
      console.log(this.formSearch.value.system?.System)
      console.log(system_code)


      req.transaction_Id = this.getTransactionId()
      req.data = data
      req.page = page

      req.data.contract_no = this.formSearch.value.txtSearch
      req.data.request_no = ''
      req.data.telephone_no = ''
      req.data.note = ''
      req.data.action_code =  (this.formSearch.value.actionCode == undefined || this.formSearch.value.actionCode == '') ? '' :   action_code + ''
      req.data.related_dept_code = ''
      req.data.result_code =  (this.formSearch.value.resultCode == undefined || this.formSearch.value.resultCode == '') ? '' :   result_code + ''
      //req.data.contact_date =  contact_date_start
      req.data.remind_date = ''
      req.data.PTP_Amount = ''
      req.data.next_action_code = ''
      req.data.next_result_code = ''
      req.data.collector_code = (this.formSearch.value.CollectorCode == undefined || this.formSearch.value.CollectorCode == '') ? '' :   collector_code + ''
      req.data.request_doc_flag = ''
      req.data.request_doc_other = ''
      req.data.note_dept_code = ''
      req.data.create_by = ''
      req.data.create_date = ''
      req.data.update_by = ''
      req.data.update_date = ''
      req.data.payment_no = ''
      req.data.tel_sms = ''

      req.data.create_date_from = (create_date_start != '') ?  create_date_start : ''
      req.data.create_date_to =  (create_date_end != '') ?  create_date_end : ''
      req.data.contact_date_from = (contact_date_start != '') ?  contact_date_start : ''
      req.data.contact_date_to =  (contact_date_end != '') ?  contact_date_end : ''
      req.data.system_code = (this.formSearch.value.system == undefined || this.formSearch.value.system == '') ? '' :   system_code + ''
      req.data.collector_team_code =  (this.formSearch.value.CollectorTeamCode == undefined || this.formSearch.value.CollectorTeamCode == '') ? '' :   collector_team_code + ''

      console.log(req)


    } else {

      req.transaction_Id = this.getTransactionId()
      req.data = data
      req.page = page

      req.data.contract_no = ''
      req.data.request_no = ''
      req.data.telephone_no = ''
      req.data.note = ''
      req.data.action_code = ''
      req.data.related_dept_code = ''
      req.data.result_code = ''
      //req.data.contact_date = ''
      req.data.remind_date = ''
      req.data.PTP_Amount = ''
      req.data.next_action_code = ''
      req.data.next_result_code = ''
      req.data.collector_code = ''
      req.data.request_doc_flag = ''
      req.data.request_doc_other = ''
      req.data.note_dept_code = ''
      req.data.create_by = ''
      req.data.create_date = ''
      req.data.update_by = ''
      req.data.update_date = ''
      req.data.payment_no = ''
      req.data.tel_sms = ''

      req.data.create_date_from = ''
      req.data.create_date_to =  ''
      req.data.contact_date_from = ''
      req.data.contact_date_to = ''
      req.data.system_code = ''
      req.data.collector_team_code = ''


    }

    req.page.page_no = page_no + 1 + ''
    req.page.page_size = '20'
    this.contractNoteService.searchContractNoteByInquiryWeb(req).subscribe(x => {

      if (x.status.status_code == '00') {

        this.ELEMENT_DATA = x.data
        this.dataSource.data = this.ELEMENT_DATA

        this.pageIndex = page_no
        this.length = x.page.total_rows


        //  this.dataSource.paginator.length = this.length
        //  this.dataSource.paginator.pageIndex = this.pageIndex

         //this.dataSource.


        this.isLoading = false

        //console.log('update end')
      } else {
        console.log(x)
        this.isLoading = false

        this.ELEMENT_DATA =  []
        this.dataSource.data = this.ELEMENT_DATA

        this.length = 0
        this.pageIndex = 0
      }
    }
    , err => {

      console.log('err')
      console.log(err)
      this.isLoading = false
      this.ELEMENT_DATA =  []
        this.dataSource.data = this.ELEMENT_DATA

        this.length = 0
        this.pageIndex = 0

    }
    )
    //return this.ELEMENT_DATA

  }

  getFormatDateImFormSearch() {

  }

  onSearch() {
    this.is_search = true

    this.myIndex = 0

    //this.GetAllContractByPage(0 )

    if ((this.formSearch.value.txtSearch == '') &&
       (this.formSearch.value.system == undefined || this.formSearch.value.system == '') &&
       (this.formSearch.value.contract_date == '') &&
       (this.formSearch.value.create_end_Date == '')  &&
       (this.formSearch.value.actionCode == undefined || this.formSearch.value.actionCode == '')  &&
       (this.formSearch.value.resultCode == undefined || this.formSearch.value.resultCode == '') &&
       (this.formSearch.value.CollectorTeamCode == undefined || this.formSearch.value.CollectorTeamCode == '') &&
       (this.formSearch.value.CollectorCode == undefined || this.formSearch.value.CollectorCode == '') )
    {
      //this.GetAllContractByPage(-1)
      //this.GetAllContractByPage(0)

      this.dataSource = new MatTableDataSource(this.GetAllContract());
      this.is_search = false
      this.GetAllContractByPage(0)
      

      

    }else{
      this.GetAllContractByPage(0 )

    }





    

  }


  onClear() {
    this.is_search = false

    console.log(this.formSearch.value.actionCode)

    console.log(this.formSearch.value.resultCode)

    //console.log(this.selectedCountry)

    //console.log('here')
    this.formSearch.patchValue({
      txtSearch: '',
      system: '',
      actionCode: '',
      resultCode: '',
      create_end_Date: '',
      contract_date: '',
      CollectorCode : '',
      CollectorTeamCode : '',
    })

  }

  onChange(event) {

    console.log('event :' + event);
    console.log(event.value);

    //let element =  document.getElementsByClassName('p-dropdown-label')[0] as HTMLElement

    let element = document.getElementById('pr_id_1_label') as HTMLElement;
    if (element == null) {
      setTimeout(() => {

        let element = document.getElementById('pr_id_1_label') as HTMLElement;
        element.innerText = event.value.name

      }, 100)

    } else {
      element.innerText = event.value.name

    }





    //console.log(element)

    // if (element == null) {
    //   let elementMain = document.getElementById('d1') as HTMLElement;
    //   elementMain.append(element)
    // }

    //element.su


  }

  getTransactionId() {
    var d = new Date()

    let month = '' + (d.getMonth() +1)
    let day = '' + d.getDate() 
    let hours = '' + d.getHours()
    let minutes  = '' + d.getMinutes()

    if (month.length < 2)
        month =  '0' + month

    if (day.length < 2) 
        day = '0' + day;

    if (hours.length < 2) 
        hours = '0' + hours;
    
    if (minutes.length < 2) 
        minutes = '0' + minutes;




    let transaction_id  = d.getFullYear().toString() + month + day
                             + hours + minutes + d.getMilliseconds().toString()
    return transaction_id
  }

 



  filterCountry2222(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.countries as any[]).length; i++) {
        let country = (this.countries as any[])[i];
        if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }

    this.filteredCountries = filtered;
}


filterCountry(event: any) {
  let filtered: any[] = [];
  let query = event.query;

  for (let i = 0; i < (this.collectorTeamCodeList as any[]).length; i++) {
      let country = (this.collectorTeamCodeList as any[])[i];
      if (country.team_name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }

  this.filteredCountries = filtered;
}

filterActionCode(event: any) {
  let filtered: any[] = [];
  let query = event.query;

  for (let i = 0; i < (this.actionCodeList as any[]).length; i++) {
      let country = (this.actionCodeList as any[])[i];
      if (country.action_code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }

  this.filteredActionCode = filtered;
}

filterResultCode(event: any) {
  let filtered: any[] = [];
  let query = event.query;

  for (let i = 0; i < (this.resultCodeList as any[]).length; i++) {
      let country = (this.resultCodeList as any[])[i];
      if (country.result_code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }

  this.filteredResultCode = filtered;
}


filterSystem(event: any) {
  let filtered: any[] = [];
  let query = event.query;

  for (let i = 0; i < (this.systemList as any[]).length; i++) {
      let country = (this.systemList as any[])[i];
      if (country.System.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }

  this.filteredSystem = filtered;
}

filterCollectorCode(event: any) {
  let filtered: any[] = [];
  let query = event.query;

  for (let i = 0; i < (this.collectorCodeList as any[]).length; i++) {
      let country = (this.collectorCodeList as any[])[i];
      if (country.collector_code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }

  this.filteredCollectorCode = filtered;
}

filterCollectorTeamCode(event: any) {
 
  let filtered: any[] = [];
  let query = event.query;

  for (let i = 0; i < (this.collectorTeamCodeList as any[]).length; i++) {
      let country = (this.collectorTeamCodeList as any[])[i];
      if (country.team_code.toLowerCase().includes(query.toLowerCase()) == true) {
          filtered.push(country);
      }
  }

  this.filteredCollectorTeamCode = filtered;
}





getRecord(row : any) {
  // console.log(row)

  // let element: HTMLElement
  //  element = document.getElementById('note_' + row.request_no) as HTMLElement;

  //  if (element.innerText.startsWith('+')) {
  //   element.innerText = '- ' + row.note
  //  }else {
  //   element.innerText = '+ ' + row.note?.substring(0,30)
  //  }

   
   //console.log(element)
}

getColumn(row : any) {
  console.log(row)

   let element: HTMLElement
   element = document.getElementById('note_' + row.contact_note_id) as HTMLElement;

   if (element.innerText.startsWith('+')) {
    element.innerText = '- ' + row.note
   }else {
    element.innerText = '+ ' + row.note?.substring(0,30)
   }

}
  



}
