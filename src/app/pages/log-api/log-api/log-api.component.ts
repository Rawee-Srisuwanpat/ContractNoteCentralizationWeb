import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';


import { PeriodicElement } from 'src/app/core/model/PeriodicElement'
import { MatTableDataSource } from '@angular/material/table';


import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { LogLoginResModel } from 'src/app/core/model/log-login/LogLoginResModel';
import { Data, LogApiInquiryReqModel, Page } from 'src/app/core/model/log-api/LogApiInquiryReqModel';
import { LogApiService } from 'src/app/core/services/log-api.service';
import { ManageMasterSystemReqModel } from 'src/app/core/model/ManageMasterSystem/ManageMasterSystemReqModel';
import { Observable, of } from 'rxjs';
import { MasterSystemService } from 'src/app/core/services/master-system.service';
import { City } from 'src/app/core/model/City';



@Component({
  selector: 'app-log-api',
  templateUrl: './log-api.component.html',
  styleUrls: ['./log-api.component.scss'],
})
export class LogApiComponent implements OnInit, AfterViewInit {

  user_name: string = ''

  formSearch: FormGroup

  myIndex: number = 0

  isLoading: boolean = false

  selectedSystem: City | undefined;
  filteredSystem: any[] | undefined;
  systemList: ManageMasterSystemReqModel[]
  systemList$: Observable<ManageMasterSystemReqModel[]> = of([])


  is_search: boolean = false

  ELEMENT_DATA: LogLoginResModel[] = [];


  displayedColumns: string[] = ['Row_no', 'Id', 'system_name', 'controller', 'method', 'create_date', 'internal_status_code' ,'internal_status_desc'];
  dataSource = new MatTableDataSource(this.GetAllData());

  pageIndex = 0;
  pageSize = 20;
  length = 50;


  constructor(private apiService: ApiService
    , private confirmationService: ConfirmationService
    , private messageService: MessageService
    , private route: ActivatedRoute
    , private fb: FormBuilder
    , private _liveAnnouncer: LiveAnnouncer
    , private  logApiService : LogApiService
    , private masterSystemService: MasterSystemService
  ) { }


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {


    //this.user_name = localStorage.getItem('savedUser')

    this.GetAllSystemData()
    this.createFormSearch()


  }

  GetAllData() {
    this.isLoading = true
    const req = {} as LogApiInquiryReqModel
    const data = {} as Data
    const page = {} as Page

    req.transaction_Id = this.getTransactionId() //'2002248524485'
    req.data = data
    req.page = page

    req.data.transaction_id = ''
    req.data.method = ''
    req.data.controller = ''
    req.data.internal_status_code = ''
    req.data.http_status_code = ''
    req.data.ip_request = ''
    req.data.system_code = ''
    req.data.create_date = ''
    req.data.update_date = ''

    


    req.page.page_no = '1'
    req.page.page_size = '20'
    this.logApiService.GetAllLogApi(req).subscribe(x => {
      console.log(x)
      if (x.status.status_code == '00') {

        this.ELEMENT_DATA = x.data
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

  GetAllDataPerPage(page_no: number) {
    this.isLoading = true

    //console.log()

    


    const req = {} as LogApiInquiryReqModel
    const data = {} as Data
    const page = {} as Page

    if (this.is_search == true) {
      let system_code =  (this.formSearch.value.system?.System ==  undefined) ?  this.systemList.filter(z => z.System?.toLocaleUpperCase() == this.formSearch.value.system?.toLocaleUpperCase())[0]?.System_code   : this.formSearch.value.system.System_code

    req.transaction_Id = this.getTransactionId() //'2002248524485'
    req.data = data
    req.page = page

    req.data.transaction_id = ''
    req.data.method = (this.formSearch.value.action == undefined || this.formSearch.value.action == '') ? '' :   this.formSearch.value.action + ''
    req.data.controller = (this.formSearch.value.api == undefined || this.formSearch.value.api == '') ? '' :   this.formSearch.value.api + ''
    req.data.internal_status_code = ''
    req.data.http_status_code = ''
    req.data.ip_request = ''
    req.data.system_code = (this.formSearch.value.system == undefined || this.formSearch.value.system == '') ? '' :   system_code + ''
    req.data.create_date = (this.formSearch.value.create_end_Date == undefined || this.formSearch.value.create_end_Date == '') ? '' : this.formSearch.value.create_end_Date.toLocaleDateString('en-CA') + ''
    req.data.update_date = ''

    }else {
    req.transaction_Id = this.getTransactionId() //'2002248524485'
    req.data = data
    req.page = page

    req.data.transaction_id = ''
    req.data.method = ''
    req.data.controller = ''
    req.data.internal_status_code = ''
    req.data.http_status_code = ''
    req.data.ip_request = ''
    req.data.system_code = ''
    req.data.create_date = ''
    req.data.update_date = ''


    }

    

    


    req.page.page_no = page_no + 1 + ''
    req.page.page_size = '20'
    this.logApiService.GetAllLogApi(req).subscribe(x => {
      console.log(x)
      if (x.status.status_code == '00') {

        this.ELEMENT_DATA = x.data
        this.dataSource.data = this.ELEMENT_DATA

        this.pageIndex = page_no
        this.length = x.page.total_rows

        this.isLoading = false
      } else {
        console.log(x)
        this.isLoading = false
      }
    })
    return this.ELEMENT_DATA
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

  createFormSearch() {
    this.formSearch = this.fb.group({
      system: '',
      create_end_Date: '',
      api: '',
      action : ''
    });

  }


  announceSortChange(sortState: any) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

 




  onClear() {
    this.formSearch.patchValue({
      system: '',
      api: '',
      action: '',
      create_end_Date: '',
    })
  }

  onSearch() {
    this.is_search = true
    this.myIndex = 0

    if (
       (this.formSearch.value.system == undefined || this.formSearch.value.system == '') &&
       (this.formSearch.value.create_end_Date == '')  &&
       (this.formSearch.value.action == '')  &&
       (this.formSearch.value.api == '') 
      )
    {

      this.GetAllDataPerPage(-1)
      this.GetAllDataPerPage(0)

      

    }else{
      this.GetAllDataPerPage(0 )

    }

    

  }


  handlePageEvent(e: PageEvent) {


    // this.pageEvent = e;
    // this.length = e.length;
    // this.pageSize = e.pageSize;
    // this.pageIndex = e.pageIndex;

    //this.paginator = e
    console.log(e)

    this.GetAllDataPerPage(e.pageIndex)
    this.length = e.length;
    this.myIndex = e.pageSize * e.pageIndex
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


}
