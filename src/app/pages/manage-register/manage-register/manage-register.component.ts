import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MasterSystemService } from 'src/app/core/services/master-system.service';
import { Observable, of } from 'rxjs';
import { MasterService } from 'src/app/core/services/master.service';
import { MasterReqModel } from 'src/app/core/model/Master/MasterReqModel';
import { MasterResModel } from 'src/app/core/model/Master/MasterResModel';
import { ManageMasterSystemReqModel } from 'src/app/core/model/ManageMasterSystem/ManageMasterSystemReqModel';
import { ManageRegisterResModel } from 'src/app/core/model/ManageRegister/ManageRegisterResModel';
import { ManageUserService } from 'src/app/core/services/manage-user.service';
import { ManageUserReqModel } from 'src/app/core/model/ManageUser/ManageUserReqModel';
import { ManageUserResModel } from 'src/app/core/model/ManageUser/ManageUserResModel';
import { PermissionService } from 'src/app/core/services/permission.service';
import { Router } from '@angular/router';
import { PermissionRegisterService } from 'src/app/core/services/permissionRegister.service';
import { City } from 'src/app/core/model/City';

@Component({
  selector: 'app-manage-register',
  templateUrl: './manage-register.component.html',
  styleUrls: ['./manage-register.component.scss'],
})
export class ManageRegisterComponent implements OnInit, AfterViewInit {
  formSearch: FormGroup
  taskForm: FormGroup
  formSubmitted: boolean = false
  visible: boolean = false
  action: string = ''
  user_name: string = ''
  date: Date

  myIndex: number = 0
  is_disable_button_save : boolean = false


  ELEMENT_DATA: ManageUserResModel[] = [];
  displayedColumns: string[] = ['Row_no', 'Id', 'system', 'systemName', 'UserName', 'password', 'Email', 'RequestStatus', 'request_status_text', 'request_date_text', 'Status', 'statusText', 'actions'];
  dataSource = new MatTableDataSource(this.GetAllDataRegister());


  pageEvent: PageEvent;
  pageIndex = 0;
  pageSize = 10;
  length = 50;

  systemList$: Observable<ManageMasterSystemReqModel[]> = of([])
  statusRequest$: Observable<MasterResModel[]> = of([])
  statusIsActive$: Observable<MasterResModel[]> = of([])


  systemList: ManageMasterSystemReqModel[]

  systemListWithoutPleaseSelect: ManageMasterSystemReqModel[]
  statusRequest: MasterResModel[]
  statusIsActive: MasterResModel[]

  is_view: boolean = false
  is_edit: boolean = false
  is_delete: boolean = false
  is_create: boolean = false

  isShowMessageNotify: boolean = false
  messageNotify: string = ''

  isShowMessageNotify2: boolean = false
  messageNotify2: string = ''

  rangeDates: Date[] | undefined;
  selectedSystem: City | undefined;
  filteredSystem: any[] | undefined;

  constructor(
    private confirmationService: ConfirmationService
    , private messageService: MessageService
    , private fb: FormBuilder
    , private _liveAnnouncer: LiveAnnouncer
    , private manageUserService: ManageUserService
    , private masterSystemService: MasterSystemService
    , private masterService: MasterService
    , private permissionService: PermissionRegisterService
    , private router: Router
  ) { }


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.user_name = localStorage.getItem('savedUser')

    this.setupRole()
    
    
    this.getMasterData()
    this.GetAllSystemData()

    this.createFormSearch()
    this.createFormInput()

  }

  ngDoCheck() {
    

  }

  @ViewChild('calendar') calendar: any;
   onSelect(){
    if (this.rangeDates[1]) { // If second date is selected
      this.calendar.overlayVisible=false;
    }
  }

  getRoleStyle() : Object {
    if (this.is_view) {
      return {'visibility':  'visible' }
    }else{
      return {'visibility':  'hidden'}
    }

  }

  setupRole() {
    console.log('setupRole')

    this.permissionService.readPermission('Register Management').subscribe(x => {
      this.is_view = this.permissionService.getViewPermission()
      this.is_edit = this.permissionService.getEditPermission()
      this.is_delete = this.permissionService.getDeletePermission()
      this.is_create = this.permissionService.getCreatePermission()

    })
    
  }

  createFormSearch() {
    this.formSearch = this.fb.group({
      txtSearch: [''],
      system: [''],
      request_date_from_end: [''],
    });
  }

  createFormInput() {
    this.taskForm = this.fb.group({
      Id: [0],
      //email: ['' ,[Validators.required , Validators.pattern('[a-z0-9\.]+@[a-z]+[.][a-z]{2,3}|.[\S]+[.].*$') ]],
      email: ['', [Validators.required]],
      request_status: [''],
      request_date: [{ value: '', disabled: true }],
      password_confirm: ['', Validators.required],
      password: ['', Validators.required],
      Row_no: [''],
      system_code: ['', [Validators.required, Validators.maxLength(50)]],
      user_name: ['', [Validators.required]],
      create_date: [''],
      update_date: [''],

      create_by: [{
        value: '',
        disabled: true
      }],
      update_by: [{
        value: '',
        disabled: true
      }],
      status: ['']
    }, { validator: this.passwordMatchValidator('password', 'password_confirm') })
  }


  checkUserName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      // const password = control.get('user_name').value;

      const password = this.taskForm.get('user_name').value

      if (password != 'ccc') {
        return { 'noMatch': true }
      }

      return null

    }

  }

  passwordMatchValidator(firstControl: string, secondControl: string): ValidatorFn {
    /* some implementation */


    return (control: AbstractControl): ValidationErrors | null => {

      const password = control.get(firstControl).value;
      const confirm = control.get(secondControl).value;

      if (password != confirm) {
        return { 'noMatch': true }
      }

      return null

    }

  }

  getMasterData() {
    let req: MasterReqModel
    this.masterService.GetAllMaster().subscribe(x => {
      if (x.status_code == '00') {

        // Status-Request
        const result = x.payload.filter(x => {
          return x.master_type == '003' && x.master_value != '1'
        })

        //Status is Active
        const resultIsActive = x.payload.filter(x => {
          return x.master_type == '001'
        })

        this.statusRequest$ = of(result)

        this.statusIsActive$ = of(resultIsActive)

        this.statusRequest = result
        this.statusIsActive = resultIsActive

        this.taskForm.patchValue({
          request_status: result[0].master_value,
          status: resultIsActive[1].master_value
        })


      } else {
        console.log(x)
      }
    })
  }

  GetAllDataRegister() {
    let req : ManageUserReqModel = {
      Id : 0 ,
      user_name : '' ,
      request_status : '',
      authenticate : '1' ,
      system_code : '',
      email : '' ,
      status : '' ,
      password : '',
      role : '',
      create_by : '' ,
      create_date : '' ,
      update_by : '',
      update_date : ''
    }



    this.manageUserService.searchUser(req).subscribe(x => {
      if (x.status_code == '00') {
        this.ELEMENT_DATA = x.payload.filter(z => {
          return z.authenticate == '1'
        })

        //this.ELEMENT_DATA = this.ELEMENT_DATA.sort((a, b) => a.status < b.status ? 1 : -1)

        this.dataSource.data = this.ELEMENT_DATA
      } else {
        console.log(x)
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

        this.systemList$ = of(x.payload)
        this.systemListWithoutPleaseSelect = result


        const resultNew = [{
          "Row_no": 0,
          "Id": -1,
          "System": "Please select",
          "Description": "",
          "create_by": "Manual|2023-12-13T07:22:57.760Z",
          "create_date": "2023-12-13T07:22:57.76",
          "update_by": "Manual|2023-12-13T07:22:57.761Z",
          "update_date": "2023-12-13T07:22:57.76",
          "status": "1",
          "System_code": "-1"
        }].concat(result)

        console.log(resultNew)
        //this.systemList = of(x.payload)

        this.systemList = resultNew

        

        // this.formSearch.patchValue({
        //   system: resultNew[0].Id
        // })

      } else {
        console.log(x)
      }
    })
  }

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onSubmit() {

    //console.log(this.taskForm)

    const expeptChar = ['@', '#', '$', '%', '&', '*', '!', '+' ,'.']

    const is_expert = expeptChar.some(i => this.taskForm.get('user_name').value?.includes(i))
    if (is_expert) {
      this.formSubmitted = true

      this.isShowMessageNotify2 = true
      this.messageNotify2 = 'Please enter your username correctly. Do not use special characters.Example : @#$%&*!+.'

      return
    }

    console.log(this.taskForm.get('email').value )

    if (this.taskForm.get('email').value != '' &&  this.taskForm.get('email').value != null) {
      const expepttring = ['.co.th', '.com' ]

      if (!(this.taskForm.get('email').value?.toLowerCase().endsWith('.com') || this.taskForm.get('email').value?.toLowerCase().endsWith('.co.th'))) {
        this.formSubmitted = true

        this.isShowMessageNotify2 = true
        this.messageNotify2 = 'Please enter your email in the correct format. Example : xxx@xxmail.com'

        return

      }

      // console.log(this.taskForm.get('email').value)
      // console.log(this.taskForm.get('email').value?.includes('@'))

      if (!this.taskForm.get('email').value?.includes('@')) {
        this.formSubmitted = true

        this.isShowMessageNotify2 = true
        this.messageNotify2 = 'Please enter your email in the correct format. Example : xxx@xxmail.com'

        return

      }

    }



    if (this.taskForm.get('system_code').value == '-1') {
      this.formSubmitted = true

      this.isShowMessageNotify2 = true
      this.messageNotify2 = 'System is required'

      return
    }




    //console.log(this.taskForm.get('system_code').value)
    if (this.action == "Create Data") // Add
    {
      this.formSubmitted = true
      if (this.taskForm.status == 'INVALID') {
        console.log("INVALID")
        return;
      }

      let req: ManageUserReqModel
      req = this.taskForm.getRawValue()

      req.Id = 0;
      //req.Row_no = 0;
      //req.request_date = new Date().toISOString()
      req.create_by = this.user_name + ' | ' + new Date().toISOString()
      req.create_date = new Date().toISOString()
      req.update_by = this.user_name + ' | ' + new Date().toISOString()
      req.update_date = new Date().toISOString()

      req.authenticate = "1"
      req.role = "0"
      

      this.manageUserService.createUser(req).subscribe(x => {
        if (x.status_code == '00') {
          //this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Save successfully' });

          this.GetAllDataRegister()
          this.isShowMessageNotify = true
          this.messageNotify = 'Save successfully'



        } else {
          //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: x.status_text });
          this.isShowMessageNotify = true
          this.messageNotify = x.status_text

        }

      })

    }
    else if (this.action == "Edit Data")  // Edit
    {
      this.formSubmitted = true
      if (this.taskForm.status == 'INVALID') {
        console.log("INVALID")
        //console.log( this.taskForm.get('Description') )
        return;
      }

      let req: ManageUserReqModel
      req = this.taskForm.getRawValue()
      //req.create_by = 'Manual|' + new Date().toISOString()
      //req.create_date = new Date().toISOString()
      req.update_by = this.user_name + ' | ' + new Date().toISOString()
      req.update_date = new Date().toISOString()
      req.role = "0"
      req.authenticate = "1"
      this.manageUserService.editUser(req).subscribe(x => {
        if (x.status_code == '00') {
          // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Edit successfully' });
          this.GetAllDataRegister()
          this.isShowMessageNotify = true
          this.messageNotify = 'Save successfully'
        } else {
          //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: x.status_text });

          this.isShowMessageNotify = true
          this.messageNotify = x.status_text

        }

      });
    }


  }

  onCloseDialogNotifyMessage() {
    //console.log('z')

    this.isShowMessageNotify = false
    this.visible = false
    //this.router.navigate(['/manage-register']);
  }

  onCloseDialogNotifyMessage2() {
    //console.log('z')

    this.isShowMessageNotify2 = false
    //this.visible = false
    //this.router.navigate(['/manage-register']);
  }

  onCancel() {
    this.visible = false
    this.setEnableControls()
  }


  onSearch() {
    console.log(this.formSearch.value.system)

    let system_code =  (this.formSearch.value.system?.System ==  undefined) ?  this.systemList.filter(z => z.System?.toLocaleUpperCase() == this.formSearch.value.system?.toLocaleUpperCase())[0]?.System_code   : this.formSearch.value.system.System_code

    if (this.formSearch.value.txtSearch == '' && this.formSearch.value.system == -1 && this.formSearch.value.request_date_from_end == '') {
      this.GetAllDataRegister()
      return
    }


    let result = this.ELEMENT_DATA;
    if (this.formSearch.value.txtSearch != '') {
      result = this.ELEMENT_DATA.filter(s => s.UserName.toUpperCase().includes(this.formSearch.value.txtSearch.toUpperCase()) ||
        s.Email.toUpperCase().includes(this.formSearch.value.txtSearch.toUpperCase()))
    }

    //if (this.formSearch.value.system != -1)
      //result = result.filter(s => s.system == this.formSearch.value.system)

    if (this.formSearch.value.system != '' && this.formSearch.value.system != undefined)
      result = result.filter(s => s.system == system_code)

    if (this.formSearch.value.request_date_from_end != '' && this.formSearch.value.request_date_from_end != undefined) {
      let dateStart = (this.formSearch.value.request_date_from_end[0] + '').split(" ")
      let dateStart1 = new Date(dateStart[3] + '-' + dateStart[1] + dateStart[2] + " 00:00:00")
      let dateStart2 = new Date(dateStart[3] + '-' + dateStart[1] + dateStart[2] + " 23:59:59")

      let dateEnd = (this.formSearch.value.request_date_from_end[1] + '').split(" ")
      let dateEnd1 = new Date(dateEnd[3] + '-' + dateEnd[1] + dateEnd[2] + " 23:59:59")

      // console.log(dateStart1.toDateString())
      // console.log(dateEnd1.toDateString())
      if (dateEnd1.toDateString() != 'Invalid Date') {
        result = result.filter(s => new Date(s.create_date) >= dateStart1
          && new Date(s.create_date) <= dateEnd1)
      } else {
        result = result.filter(s => new Date(s.create_date) >= dateStart1 && new Date(s.create_date) <= dateStart2)
      }


    }

    this.dataSource.data = result
  }

  onClear() {
    this.formSearch.patchValue({
      txtSearch: '',
      system: '' , //-1,
      request_date_from_end: ''
    })

    this.dataSource.data = this.ELEMENT_DATA;

    //this.dataSource.
    this.GetAllDataRegister();
  }

  setEnableControls() {
    //this.taskForm.controls['request_date'].enable()
    this.taskForm.controls['user_name'].enable()
    this.taskForm.controls['password'].enable()
    this.taskForm.controls['password_confirm'].enable()
    this.taskForm.controls['Id'].enable()
    this.taskForm.controls['Row_no'].enable()
    this.taskForm.controls['system_code'].enable()
    //this.taskForm.controls['create_by'].enable()
    this.taskForm.controls['create_date'].enable()
    //this.taskForm.controls['update_by'].enable()
    this.taskForm.controls['update_date'].enable()
    this.taskForm.controls['status'].enable()
    this.taskForm.controls['email'].enable()
    this.taskForm.controls['request_status'].enable()
  }

  setdisableControls() {
    //this.taskForm.controls['request_date'].disable()
    this.taskForm.controls['user_name'].disable()
    this.taskForm.controls['password'].disable()
    this.taskForm.controls['password_confirm'].disable()
    this.taskForm.controls['Id'].disable()
    this.taskForm.controls['Row_no'].disable()
    this.taskForm.controls['system_code'].disable()
    // this.taskForm.controls['create_by'].disable()
    this.taskForm.controls['create_date'].disable()
    // this.taskForm.controls['update_by'].disable()
    this.taskForm.controls['update_date'].disable()
    this.taskForm.controls['status'].disable()
    this.taskForm.controls['email'].disable()
    this.taskForm.controls['request_status'].disable()
  }

  onSelectChange(newValue) {
    console.log(newValue.target.value)
    if (newValue.target.value == 4 || newValue.target.value == 2) // Reject Or Waitting Approve
    {
      this.taskForm.controls['status'].setValue('0')

    } else if (newValue.target.value == 3) { //Approve
      this.taskForm.controls['status'].setValue('1')
    }

  }


  formatDateToYYYYMMDDHHMMSS(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  showDialogCreateTask() {
    this.formSubmitted = false
    this.taskForm.reset();
    this.action = 'Create Data'

    this.taskForm.controls['request_date'].setValue(new Date().toLocaleDateString('en-GB'))
    // this.taskForm.controls['create_by'].setValue(this.user_name + ' | ' + new Date().toLocaleDateString('en-GB'))
    // this.taskForm.controls['update_by'].setValue(this.user_name + ' | ' + new Date().toLocaleDateString('en-GB'))
    
    
    this.taskForm.controls['request_date'].setValue(this.formatDateToYYYYMMDDHHMMSS(new Date()))
    this.taskForm.controls['create_by'].setValue(this.user_name + ' | ' + this.formatDateToYYYYMMDDHHMMSS(new Date()))
    this.taskForm.controls['update_by'].setValue(this.user_name + ' | ' + this.formatDateToYYYYMMDDHHMMSS(new Date()))
    
    
    
    
    
    this.taskForm.controls['system_code'].setValue(this.systemList[0].System_code)

    
    this.taskForm.controls['request_status'].setValue('3')
    this.taskForm.controls['status'].setValue('1')

    this.visible = !this.visible
  }

  showDialogViewTask(row: any) {
    this.formSubmitted = false
    this.taskForm.reset();
    this.action = 'View Data'

    this.setdisableControls()
    this.taskForm.controls['request_date'].setValue(row.create_date.toString().replace('T',' ').substring(0,19))
    this.taskForm.controls['user_name'].setValue(row.UserName)
    this.taskForm.controls['password'].setValue(row.password)
    this.taskForm.controls['password_confirm'].setValue(row.password)
    this.taskForm.controls['Id'].setValue(row.Id)
    this.taskForm.controls['Row_no'].setValue(row.Row_no)
    this.taskForm.controls['system_code'].setValue(row.system)
    this.taskForm.controls['create_by'].setValue(row.create_by)
    this.taskForm.controls['create_date'].setValue(row.create_date)
    this.taskForm.controls['update_by'].setValue(row.update_by)
    this.taskForm.controls['update_date'].setValue(row.update_date)
    this.taskForm.controls['status'].setValue(row.status)
    this.taskForm.controls['email'].setValue(row.Email)
    this.taskForm.controls['request_status'].setValue(row.request_status)

    this.visible = !this.visible
  }

  showDialogEditTask(row: any) {
    this.formSubmitted = false
    this.taskForm.reset();
    this.action = 'Edit Data'

    this.setEnableControls()

    this.taskForm.controls['user_name'].disable()

    if (row.request_status == 3) {
      this.taskForm.controls['request_status'].disable()
      this.taskForm.controls['system_code'].disable()
    }

    if (row.request_status == 2) {
      this.taskForm.controls['system_code'].disable()
    }

    if (row.request_status == 4) {
      this.setdisableControls()

      this.is_disable_button_save = true
      

      // let element: HTMLElement
      // element = document.getElementById('note_' + row.Id) as HTMLElement;

      // console.log(row)
      // console.log(element)
      //console.log(document.getElementById('btnSave'))
      

    } else {
      this.is_disable_button_save = false
    }

    //this.taskForm.controls['request_date'].setValue(row.create_date)
    this.taskForm.controls['request_date'].setValue(row.create_date.toString().replace('T',' ').substring(0,19))
    this.taskForm.controls['user_name'].setValue(row.UserName)
    this.taskForm.controls['password'].setValue(row.password)
    this.taskForm.controls['password_confirm'].setValue(row.password)
    this.taskForm.controls['Id'].setValue(row.Id)
    this.taskForm.controls['Row_no'].setValue(row.Row_no)
    this.taskForm.controls['system_code'].setValue(row.system)
    this.taskForm.controls['create_by'].setValue(row.create_by)
    this.taskForm.controls['create_date'].setValue(row.create_date)
    this.taskForm.controls['update_by'].setValue(row.update_by)
    this.taskForm.controls['update_date'].setValue(row.update_date)
    this.taskForm.controls['status'].setValue(row.status)
    this.taskForm.controls['email'].setValue(row.Email)
    this.taskForm.controls['request_status'].setValue(row.request_status)

    this.visible = !this.visible

   
  }

  showConfirmDelete(row: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteRecord(row)
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            //this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });

  }

  deleteRecord(row: any) {
    let req: ManageUserReqModel
    req = this.taskForm.getRawValue()
    req.Id = row.Id
    this.manageUserService.deleteUser(req).subscribe(x => {
      if (x.status_code == '00') {
        this.GetAllDataRegister()
        this.isShowMessageNotify = true
        this.messageNotify = 'Delete successfully'

        //this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Delete successfully' });
      } else {
        this.isShowMessageNotify = true
        this.messageNotify = x.status_text
        //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Http Status: ${x.status} , ${x.status_text}` });
      }

    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handlePageEvent(e: PageEvent) {


    // this.pageEvent = e;
    // this.length = e.length;
    // this.pageSize = e.pageSize;
    // this.pageIndex = e.pageIndex;

    //this.paginator = e
    console.log(e)

    this.myIndex = e.pageSize * e.pageIndex
  }

  filterSystem(event: any) {
    let filtered: any[] = [];
    let query = event.query;
  
    for (let i = 0; i < (this.systemListWithoutPleaseSelect as any[]).length; i++) {
        let country = (this.systemListWithoutPleaseSelect as any[])[i];
        if (country.System.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }
  
    this.filteredSystem = filtered;
  }


}
