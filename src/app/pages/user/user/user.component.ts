import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';


import { PeriodicElement } from 'src/app/core/model/PeriodicElement'
import { MatTableDataSource } from '@angular/material/table';


import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ManageMasterSystemReqModel } from 'src/app/core/model/ManageMasterSystem/ManageMasterSystemReqModel';
import { MasterSystemService } from 'src/app/core/services/master-system.service';
import { ManageUserResModel } from 'src/app/core/model/ManageUser/ManageUserResModel';
import { ManageUserService } from 'src/app/core/services/manage-user.service';
import { Observable, of } from 'rxjs';
import { ManageRoleResModel } from 'src/app/core/model/ManageRole/ManageRoleResModel';
import { ManageRoleService } from 'src/app/core/services/manage-role.service';
import { MasterResModel } from 'src/app/core/model/Master/MasterResModel';
import { MasterService } from 'src/app/core/services/master.service';
import { MasterReqModel } from 'src/app/core/model/Master/MasterReqModel';
import { ManageUserReqModel } from 'src/app/core/model/ManageUser/ManageUserReqModel';
import { UserRoleModel } from 'src/app/core/model/UserRoleModel';
import { PermissionService } from 'src/app/core/services/permission.service';
import { PermissionUserService } from 'src/app/core/services/permissionUser.service';
import { City } from 'src/app/core/model/City';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, AfterViewInit {

  request_date: string
  formSubmitted: boolean = false
  visible: boolean = false
  action: string = ''

  user_name: string = ''
  formSearch: FormGroup;
  userRole : UserRoleModel

  roleList$: Observable<ManageRoleResModel[]> = of([])

  roleList : ManageRoleResModel[] = []
  statusIsActive$: Observable<MasterResModel[]> = of([])

  authenticattionList$: Observable<MasterResModel[]> = of([])

  statusIsActive: MasterResModel[]

  rangeDates: Date[] | undefined;
  myIndex: number = 0


  ELEMENT_DATA: ManageUserResModel[] = [];
  displayedColumns: string[] = ['Row_no', 'Id', 'UserName', 'Role', 'Email','status', 'create_by', 'create_date', 'update_by', 'update_date', 'Actions'];
  dataSource = new MatTableDataSource(this.GetAllData());
  taskForm: FormGroup

  pageEvent: PageEvent;
  pageIndex = 0;
  pageSize = 10;
  length = 50;

  is_view : boolean = false
  is_edit : boolean = false
  is_delete : boolean = false
  is_create : boolean = false

  isShowMessageNotify : boolean = false
  messageNotify : string = ''

  isShowMessageNotify2 : boolean = false
  messageNotify2 : string = ''

  selectedRoleCode: City | undefined;
  filteredRole: any[] | undefined;

  selectedStatus: City | undefined;
  filteredStatus: any[] | undefined;



  constructor(
    private confirmationService: ConfirmationService
    , private messageService: MessageService
    , private fb: FormBuilder
    , private _liveAnnouncer: LiveAnnouncer
    , private manageUserService: ManageUserService
    , private manageRoleService: ManageRoleService
    , private masterService: MasterService
    , private permissionService : PermissionUserService
  ) { }


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.paginator = this.paginator;
  }

  @ViewChild('calendar') calendar: any;
   onSelect(){
    if (this.rangeDates[1]) { // If second date is selected
      this.calendar.overlayVisible=false;
    }
  }

  ngOnInit() {
    this.user_name = localStorage.getItem('savedUser')

    this.setupRole()
    this.getMasterData()
    this.GetRoleDropDown()
    this.createFormSearch()
    this.createFormInput()

    this.userRole = JSON.parse(localStorage.getItem('Role_obj'));


  }
  setupRole() {

    this.permissionService.readPermission('User Management').subscribe(x => {
    this.is_view = this.permissionService.getViewPermission()
    this.is_edit = this.permissionService.getEditPermission()
    this.is_delete = this.permissionService.getDeletePermission()
    this.is_create = this.permissionService.getCreatePermission()

    })
    
  }

  GetRoleDropDown() {
    let req: ManageMasterSystemReqModel
    this.manageRoleService.searchRole().subscribe(x => {
      if (x.status_code == '00') {

        const result = x.payload.filter(x => {
          return x
        })

        console.log(result)

        this.roleList = x.payload

        const a: ManageRoleResModel = {
          Id: 0,
          Row_no: 0,

          Role_code: '',

          Id_tbm_Role: -1,

          Role_name: 'Please select',
          Screen_code: '',
          Screen_text: '',

          description: '',
          is_active :'',

          visible_menu: '',
          create_data: '',
          edit_data: '',
          view_data: '',
          delete_data: '',

          create_by: '',
          update_by: '',
          create_date: '',
          update_date: '',

        }

       

        
        result.unshift(a)



        this.roleList$ = of(result)

         


        // this.taskForm.patchValue({
        //   //role: this.roleList[0].Id_tbm_Role
        // })


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
          return x.master_type == '008' && x.master_value == '2'
        })

        //Status is Active
        const resultIsActive = x.payload.filter(x => {
          return x.master_type == '001' || x.master_type == '009'
        })

        this.authenticattionList$ = of(result)


        this.statusIsActive$ = of(resultIsActive)
        
        this.statusIsActive = resultIsActive.sort((a, b) => a.orderList < b.orderList ? -1 : 1)
                              .filter(z => z.master_value != -1)
        

        // this.formSearch.patchValue({
        //   is_active: this.statusIsActive[0].master_value
        // })


      } else {
        console.log(x)
      }
    })
  }

  createFormSearch() {
    this.formSearch = this.fb.group({
      txtSearch: [''],
      role: [''],
      create_end_Date: [''],
      is_active : '-1' ,
    });

  }

  createFormInput() {
    this.request_date = new Date().toLocaleDateString('en-GB');
    this.taskForm = this.fb.group({
      Id: [0],
      role: [''],
      email: [ { value : '' , disabled: true}],
      user_name: ['' ,[Validators.required]],
      password: [{ value : '' , disabled: true}],
      authenticate: [{ value : '2' , disabled: true}],
      status: ['-1'],
      create_date: [''],
      update_date: [''],
      create_by: [{
        value: 'Web Register|' + this.request_date,
        disabled: true
      }],
      update_by: [{
        value: 'Web Register|' + this.request_date,
        disabled: true
      }],

    })
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

  onSubmit() {

    const expeptChar = ['@', '#' , '$' ,'%' , '&' ,'*' , '!' ,'+']

    const is_expert = expeptChar.some(i => this.taskForm.get('user_name').value?.includes(i))
    if(is_expert) {
      this.formSubmitted = true

      this.isShowMessageNotify2 = true 
      this.messageNotify2 = 'Please enter your user name correctly. Do not use special characters.Example : @#$%&*!+'

      return 
    }


    if (this.taskForm.get('role').value == '-1') {
      this.formSubmitted = true

      this.isShowMessageNotify2 = true
      this.messageNotify2 = 'Role is required'

      return
    }


    if (this.taskForm.get('status').value == '-1') {
      this.formSubmitted = true

      this.isShowMessageNotify2 = true
      this.messageNotify2 = 'Status is required'

      return
    }




    if (this.action == "Create Data") // Add
    {
      this.formSubmitted = true
      if (this.taskForm.status == 'INVALID') {
        console.log("INVALID")
        //console.log( this.taskForm.get('Description') )
        return;
      }

      let req: ManageUserReqModel
      req = this.taskForm.getRawValue()

      req.Id = 0;
      req.create_by = this.user_name + ' | ' + new Date().toISOString()
      req.create_date = new Date().toISOString()
      req.update_by = this.user_name + ' | ' + new Date().toISOString()
      req.update_date = new Date().toISOString()
      req.email=''
      req.password=''
      req.request_status = ''
      req.system_code = ''
      req.status = req.status +''


      this.manageUserService.createUser(req).subscribe(x => {
        if (x.status_code == '00') {
          //this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Save successfully' });
          
          this.GetAllData()
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
      req.create_by = this.user_name + ' | ' + new Date().toISOString()
      //req.create_date = new Date().toISOString()
      req.update_by = this.user_name + ' | ' + new Date().toISOString()
      req.update_date = new Date().toISOString()

      console.log(req)
      this.manageUserService.editUser(req).subscribe(x => {
        if (x.status_code == '00') {
          this.dataSource.data = x.payload
          //this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Edit successfully' });
          this.GetAllData()
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



  GetAllData() {

    let req : ManageUserReqModel = {
      Id : 0 ,
      user_name : '' ,
      request_status : '',
      authenticate : '2' ,
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
          return z.authenticate == '2'
        })
        this.dataSource.data = this.ELEMENT_DATA
        //this.dataSource.data = x.payload
      } else {
        console.log(x)
      }
    })
    return this.ELEMENT_DATA
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

  showDialogCreateTask(row: any, state: any) {
    this.taskForm.reset();
    console.log(row)
    this.action = 'Create Data'
    // this.taskForm.controls['create_by'].setValue(this.user_name + ' | ' +new Date().toLocaleDateString('en-GB'))
    // this.taskForm.controls['update_by'].setValue(this.user_name + ' | ' +new Date().toLocaleDateString('en-GB'))

    

    this.taskForm.controls['create_by'].setValue(this.user_name + ' | ' + this.formatDateToYYYYMMDDHHMMSS(new Date()))
    this.taskForm.controls['update_by'].setValue(this.user_name + ' | ' + this.formatDateToYYYYMMDDHHMMSS(new Date()))
    
    
    
   // this.taskForm.controls['role'].setValue(this.roleList[0].Id_tbm_Role)
    this.taskForm.controls['role'].setValue('-1')
    
    this.taskForm.controls['authenticate'].setValue('2')
    this.taskForm.controls['status'].setValue(0)

    this.visible = !this.visible

  }

  showDialogEditTask(row: any) {

    console.log(row)
    this.taskForm.reset();
    this.action = 'Edit Data'

    this.taskForm.controls['user_name'].disable()

    this.taskForm.controls['Id'].setValue(row.Id)
    this.taskForm.controls['email'].setValue(row.Email)
    this.taskForm.controls['user_name'].setValue(row.UserName)  
    this.taskForm.controls['password'].setValue(row.password) 

    this.taskForm.controls['role'].setValue(row.RoleId)
    this.taskForm.controls['authenticate'].setValue(row.authenticate)
    this.taskForm.controls['status'].setValue(row.status)

    this.taskForm.controls['create_by'].setValue(row.create_by)
    this.taskForm.controls['create_date'].setValue(row.create_date) 
    this.taskForm.controls['update_by'].setValue(row.update_by)
    this.taskForm.controls['update_date'].setValue(row.update_date)
    this.visible = !this.visible
  }

  showDialogViewTask(row: any) {
    this.setdisableControls() 
    this.taskForm.reset();
    this.action = 'View Data'
    this.taskForm.controls['Id'].setValue(row.Id)
    this.taskForm.controls['email'].setValue(row.Email)  
    this.taskForm.controls['user_name'].setValue(row.UserName) 
    this.taskForm.controls['password'].setValue(row.password) 

    this.taskForm.controls['role'].setValue(row.RoleId)
    this.taskForm.controls['authenticate'].setValue(row.authenticate)
    this.taskForm.controls['status'].setValue(row.status)

    this.taskForm.controls['create_by'].setValue(row.create_by)
    //this.taskForm.controls['create_date'].setValue(row.create_date) 
    this.taskForm.controls['update_by'].setValue(row.update_by)
    //this.taskForm.controls['update_date'].setValue(row.update_date)
    //this.taskForm.controls['is_active'].setValue(row.status)
    this.visible = !this.visible
  }

  confirmDelete(row: any) {

    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        //this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
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
    req = this.taskForm.value
    req.create_by = 'Manual|' + new Date().toISOString()
    req.create_date = new Date().toISOString()
    req.update_by = 'Manual|' + new Date().toISOString()
    req.update_date = new Date().toISOString()
    req.Id = row.Id
    //req.Row_no = row.Row_no
    this.manageUserService.deleteUser(req).subscribe(x => {
      if (x.status_code == '00') {
        //this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Delete successfully' });

        this.GetAllData()
        this.isShowMessageNotify = true
        this.messageNotify = 'Delete successfully'
      } else {
        //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Http Status: ${x.status} , ${x.status_text}` });
        this.isShowMessageNotify = true
        this.messageNotify = x.status_text

      }

    });

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
    this.myIndex = e.pageSize * e.pageIndex
  }


  onCancel() {
    this.action = "Cancel"
    this.taskForm.reset();
    this.visible = false
    this.setEnableControls()
    this.formSubmitted = false
  }

  onSearch() {
    this.myIndex = 0
    //console.log(this.formSearch.value.is_active)
    if (this.formSearch.value.txtSearch == '' && 
    this.formSearch.value.system == -1 && 
    this.formSearch.value.request_date_from_end == '' &&
    (this.formSearch.value.is_active == undefined || this.formSearch.value.is_active == -1)
    ){
      this.GetAllData()
      return
    }
    
    console.log(this.ELEMENT_DATA)

    let result = this.ELEMENT_DATA;
    if (this.formSearch.value.txtSearch != '') {
      result = this.ELEMENT_DATA.filter(s => s.UserName.toUpperCase().includes(this.formSearch.value.txtSearch.toUpperCase()) || 
                                        s.Email.toUpperCase().includes( this.formSearch.value.txtSearch.toUpperCase()))
    }

    //  if (this.formSearch.value.role != -1)
    //    result = result.filter(s => s.RoleId == this.formSearch.value.role)

    let roleCode =  (this.formSearch.value.role?.Id_tbm_Role ==  undefined) 
    ?  this.roleList.filter(z => z.Role_name?.toLocaleUpperCase() == this.formSearch.value.role?.toLocaleUpperCase())[0]?.Id_tbm_Role   
    : this.formSearch.value.role.Id_tbm_Role

    if (this.formSearch.value.role != '' && this.formSearch.value.role != undefined)
      result = result.filter(s => s.RoleId == roleCode)


    //  if (this.formSearch.value.is_active != -1)
    //    result = result.filter(s => s.status == this.formSearch.value.is_active)
    let is_active =  (this.formSearch.value.is_active?.master_value ==  undefined) 
    ?  this.statusIsActive.filter(z => z.master_text?.toLocaleUpperCase() == this.formSearch.value.is_active?.toLocaleUpperCase())[0]?.master_value   
    : this.formSearch.value.is_active.master_value

    if (this.formSearch.value.is_active != undefined && this.formSearch.value.is_active != '')
         result =  result.filter(s => s.status == is_active)

    if ((this.formSearch.value.create_end_Date != '') && (this.formSearch.value.create_end_Date != undefined) ){
      console.log(this.formSearch.value.create_end_Date)

      let dateStart = (this.formSearch.value.create_end_Date[0] + '').split(" ")
      let dateStart1 = new Date(dateStart[3] + '-' + dateStart[1] + dateStart[2] + " 00:00:00")
      let dateStart2 = new Date(dateStart[3] + '-' + dateStart[1] + dateStart[2] + " 23:59:59")

      let dateEnd = (this.formSearch.value.create_end_Date[1] + '').split(" ")
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
      role: '',
      create_end_Date: '',
      is_active : '' , //-1
    })

    console.log(this.formSearch.value.txtSearch)
  }

  setdisableControls() {
    this.taskForm.controls['authenticate'].disable()
    this.taskForm.controls['user_name'].disable()
    this.taskForm.controls['password'].disable()
    //this.taskForm.controls['password_confirm'].disable()
    this.taskForm.controls['Id'].disable()
    this.taskForm.controls['role'].disable()
    //this.taskForm.controls['system_code'].disable()
   // this.taskForm.controls['create_by'].disable()
    this.taskForm.controls['create_date'].disable()
   // this.taskForm.controls['update_by'].disable()
    this.taskForm.controls['update_date'].disable()
    this.taskForm.controls['status'].disable()
    this.taskForm.controls['email'].disable()
    //this.taskForm.controls['request_status'].disable()
  }

  setEnableControls() {
   // this.taskForm.controls['authenticate'].enable()
    this.taskForm.controls['user_name'].enable()
    //this.taskForm.controls['password'].enable()
    //this.taskForm.controls['password_confirm'].enable()
    this.taskForm.controls['Id'].enable()
    this.taskForm.controls['role'].enable()
    //this.taskForm.controls['system_code'].enable()
   // this.taskForm.controls['create_by'].enable()
    this.taskForm.controls['create_date'].enable()
   // this.taskForm.controls['update_by'].enable()
    this.taskForm.controls['update_date'].enable()
    this.taskForm.controls['status'].enable()
    //this.taskForm.controls['Email'].enable()
    //this.taskForm.controls['request_status'].enable()
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

  filterRole(event: any) {
    let filtered: any[] = [];
    let query = event.query;
  
    for (let i = 0; i < (this.roleList as any[]).length; i++) {
        let country = (this.roleList as any[])[i];
        if (country.Role_name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }
  
    this.filteredRole = filtered;
  }

  filterStatus(event: any) {
    let filtered: any[] = [];
    let query = event.query;
  
    for (let i = 0; i < (this.statusIsActive as any[]).length; i++) {
        let country = (this.statusIsActive as any[])[i];
        if (country.master_text.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }
  
    this.filteredStatus = filtered;
  }


}
