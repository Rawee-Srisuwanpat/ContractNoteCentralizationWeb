import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { MatSort, MatSortable } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ManageRoleResModel } from 'src/app/core/model/ManageRole/ManageRoleResModel';
import { Observable, of } from 'rxjs';
import { ManageMasterSystemReqModel } from 'src/app/core/model/ManageMasterSystem/ManageMasterSystemReqModel';
import { MasterSystemService } from 'src/app/core/services/master-system.service';
import { ManageRoleResModel2 } from 'src/app/core/model/ManageRole/ManageRoleResModel2';
import { ManageRoleResModel3 } from 'src/app/core/model/ManageRole/ManageRoleResModel3';
import { SelectionModel } from '@angular/cdk/collections';
import { ManageRoleService } from 'src/app/core/services/manage-role.service';
import { ActionSelected, ManageRoleCreateReqModel, Scrren } from 'src/app/core/model/ManageRole/ManageRoleCreateReqModel';
import { MasterResModel } from 'src/app/core/model/Master/MasterResModel';
import { MasterReqModel } from 'src/app/core/model/Master/MasterReqModel';
import { MasterService } from 'src/app/core/services/master.service';
import { ManageRoleReqModel } from 'src/app/core/model/ManageRole/ManageRoleReqModel';
import { ManageRoleDeleteReqModel } from 'src/app/core/model/ManageRole/ManageRoleDeleteReqModel';
import { PermissionService } from 'src/app/core/services/permission.service';
import { PermissionRoleService } from 'src/app/core/services/permissionRole.service';
import { City } from 'src/app/core/model/City';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit, AfterViewInit {

  formSearch: FormGroup
  taskForm: FormGroup
  formSubmitted: boolean = false
  visible: boolean = false
  action: string = ''
  user_name: string = ''
  date: Date
  myIndex: number = 0

  is_disableCheckBox: boolean = false

  rangeDates: Date[] | undefined;

  req: ManageRoleCreateReqModel
  screens: Scrren[] = []
  actions: ActionSelected[] = []

  currentRow: number = -1


  screens_state: Scrren[] = []


  action1: ActionSelected[] = []
  action2: ActionSelected[] = []
  action3: ActionSelected[] = []
  action4: ActionSelected[] = []
  action5: ActionSelected[] = []
  action6: ActionSelected[] = []



  ELEMENT_DATA: ManageRoleResModel[] = [];


  displayedColumns: string[] = ['Row_no', 'Id', 'Role_name', 'description', 'is_active_text', 'create_by', 'update_by', 'actions'];
  dataSource = new MatTableDataSource(this.GetAllDataRole());

  pageEvent: PageEvent;
  pageIndex = 0;
  pageSize = 10;
  length = 50;


  ELEMENT_DATA2: ManageRoleResModel2[] = [
    { Row_no: 1, Screen: 'Register Management', description: 'Register Management' },
    { Row_no: 2, Screen: 'User Management', description: 'User Management' },
    { Row_no: 3, Screen: 'Role Management', description: 'Role Management' },
    { Row_no: 4, Screen: 'Log', description: 'Log' },
    { Row_no: 5, Screen: 'Master Data', description: 'Master Data' },
    { Row_no: 6, Screen: 'Contract Note', description: 'Contract Note' },
  ];
  dataSource2 = new MatTableDataSource(this.ELEMENT_DATA2);
  displayedColumns2: string[] = ['select', 'Row_no', 'Screen', 'Description'];


  ELEMENT_DATA3: ManageRoleResModel3[] = [
    { Row_no: 1, Action_name: 'View', description: 'View icon' },
    { Row_no: 2, Action_name: 'Save', description: 'Save icon' },
    { Row_no: 3, Action_name: 'Edit', description: 'Edit icon' },
    { Row_no: 4, Action_name: 'Delete', description: 'Delete icon' },
    { Row_no: 5, Action_name: 'Visible', description: 'Visible Menu' },
  ];
  //ELEMENT_DATA3: ManageRoleResModel3[] = []

  dataSource3 = new MatTableDataSource(this.ELEMENT_DATA3);
  displayedColumns3: string[] = ['select', 'Row_no', 'Action_name', 'Description'];


  systemList$: Observable<ManageMasterSystemReqModel[]> = of([])
  statusIsActive$: Observable<MasterResModel[]> = of([])

  actionList$: Observable<MasterResModel[]> = of([])

  systemList: ManageMasterSystemReqModel[]
  statusIsActive: MasterResModel[]
  actionList: MasterResModel[]

  actionListWithoutAll$: Observable<MasterResModel[]> = of([])


  selection = new SelectionModel<ManageRoleResModel2>(true, []);

  selection3 = new SelectionModel<ManageRoleResModel3>(true, []);


  is_view: boolean = false
  is_edit: boolean = false
  is_delete: boolean = false
  is_create: boolean = false

  isShowMessageNotify: boolean = false
  messageNotify: string = ''

  isShowMessageNotify2: boolean = false
  messageNotify2: string = ''

  selectedStatus: City | undefined;
  filteredStatus: any[] | undefined;


  constructor(
    private confirmationService: ConfirmationService
    , private messageService: MessageService
    , private fb: FormBuilder
    , private _liveAnnouncer: LiveAnnouncer
    , private masterSystemService: MasterSystemService
    , private manageRoleService: ManageRoleService
    , private masterService: MasterService
    , private permissionService: PermissionRoleService
  ) { }


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  ngAfterViewInit(): void {

    // this.sort.sort(({ id: 'is_active_text', start: 'asc'}) as MatSortable);
    // this.sort.sort(({ id: 'update_date', start: 'desc'}) as MatSortable);

    this.dataSource.sort = this.sort;

    this.dataSource.paginator = this.paginator;

    // const sortState = {
    //   active: 'is_active_text',
    //    direction: 'desc'
    // }

    // this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  }


  @ViewChild('calendar') calendar: any;
  onSelect() {
    if (this.rangeDates[1]) { // If second date is selected
      this.calendar.overlayVisible = false;
    }
  }

  ngOnInit() {

    this.user_name = localStorage.getItem('savedUser')

    this.setupRole()
    this.getMasterData()

    this.createFormSearch()
    this.createFormInput()



  }

  setupRole() {


    this.permissionService.readPermission('Role Management')
    this.is_view = this.permissionService.getViewPermission()
    this.is_edit = this.permissionService.getEditPermission()
    this.is_delete = this.permissionService.getDeletePermission()
    this.is_create = this.permissionService.getCreatePermission()
  }

  GetAllDataRole() {
    let req: ManageMasterSystemReqModel
    this.manageRoleService.searchRole().subscribe(x => {
      if (x.status_code == '00') {
        this.ELEMENT_DATA = x.payload
        this.dataSource.data = this.ELEMENT_DATA
      } else {
        console.log(x)
      }
    })
    return this.ELEMENT_DATA
  }



  getMasterData() {
    let req: MasterReqModel
    this.masterService.GetAllMaster().subscribe(x => {
      if (x.status_code == '00') {

        // Action List
        const result = x.payload.filter(x => {
          return x.master_type == '004'
        })

        //Status is Active
        const resultIsActive = x.payload.filter(x => {
          return x.master_type == '001' //|| x.master_type == '009'
        })

        this.actionList$ = of(result)
        this.statusIsActive$ = of(resultIsActive)

        this.actionList = result

        //this.ELEMENT_DATA3 = result

        this.statusIsActive = resultIsActive.sort((a, b) => a.orderList < b.orderList ? -1 : 1)

        // this.formSearch.patchValue({
        //   //request_status : result[0].master_value ,
        //   is_active: this.statusIsActive[0].master_value
        //   //is_active: this.statusIsActive.find(x => x.master_value == '-1').master_value
        // })



        const resultIsActiveWithoutAll = x.payload.filter(x => {
          return x.master_type == '001'
        })
        this.actionListWithoutAll$ = of(resultIsActiveWithoutAll)
        this.taskForm.patchValue({
          is_active: '0'
        })


      } else {
        console.log(x)
      }
    })
  }

  createFormSearch() {
    this.formSearch = this.fb.group({
      txtSearch: [''],
      is_active: [''],
      create_end_Date: [''],
    });
  }

  createFormInput() {


    this.taskForm = this.fb.group({
      Id: [0],
      role_name: ['', [Validators.required]],
      Description: [''],
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
      is_active: ['']
    })
  }

  announceSortChange(sortState: any) {
    console.log(sortState)
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onSubmit() {



    this.formSubmitted = true
    // const str = 'Hello I am ab1c'
    // const regularExpression = /ab+c/



    // if (str.match(regularExpression) == null) {
    //   console.log('Not Match')
    // }

    //console.log(str.match(regularExpression) )

    //console.log(this.screens)



    const expeptChar = ['@', '#', '$', '%', '&', '*', '!', '+']

    const is_expert = expeptChar.some(i => this.taskForm.get('role_name').value?.includes(i))
    if (is_expert) {
      this.formSubmitted = true

      this.isShowMessageNotify2 = true
      this.messageNotify2 = 'Please enter your role name correctly. Do not use special characters.Example : @#$%&*!+'

      return
    }

    if (this.taskForm.get('is_active').value == '-1') {
      this.formSubmitted = true

      this.isShowMessageNotify2 = true
      this.messageNotify2 = 'Status is required'

      return
    }



    // if(this.screens.length == 0) {
    //   this.isShowMessageNotify2 = true
    //   this.messageNotify2 = 'Please select one screen at least'
    //   return
    // }


    //let tmp_screen  = { ... this.screens }

    // console.log(tmp_screen)

    // this.screens.forEach(x => {
    //   if (x.actions.length ==0)
    //     tmp_screen = tmp_screen.filter(z => z.Screen_name != x.Screen_name)
    // })


    // let element: HTMLInputElement = <HTMLInputElement>document.getElementById('mat-checkbox-8'+'-input');
    // let element2: HTMLInputElement = <HTMLInputElement>document.getElementById('mat-checkbox-1'+'-input');

    // console.log(this.isAllSelected3())
    // if (this.isAllSelected3()) {
    //   console.clear();
    //   console.log(element.checked)
    //   if (element.checked && element2.checked) {
    //     this.action1.push( {Row_no: 1, Action_name: 'View', description: 'View icon'})
    //   this.action1.push( {Row_no: 2, Action_name: 'Save', description: 'Save icon'})
    //   this.action1.push( {Row_no: 3, Action_name: 'Edit', description: 'Edit icon'})
    //   this.action1.push( {Row_no: 4, Action_name: 'Delete', description: 'Delete icon'})
    //   this.action1.push( {Row_no: 5, Action_name: 'Visible', description: 'Visible Menu'})

    //   this.action2.push( {Row_no: 1, Action_name: 'View', description: 'View icon'})
    //   this.action2.push( {Row_no: 2, Action_name: 'Save', description: 'Save icon'})
    //   this.action2.push( {Row_no: 3, Action_name: 'Edit', description: 'Edit icon'})
    //   this.action2.push( {Row_no: 4, Action_name: 'Delete', description: 'Delete icon'})
    //   this.action2.push( {Row_no: 5, Action_name: 'Visible', description: 'Visible Menu'})

    //   this.action3.push( {Row_no: 1, Action_name: 'View', description: 'View icon'})
    //   this.action3.push( {Row_no: 2, Action_name: 'Save', description: 'Save icon'})
    //   this.action3.push( {Row_no: 3, Action_name: 'Edit', description: 'Edit icon'})
    //   this.action3.push( {Row_no: 4, Action_name: 'Delete', description: 'Delete icon'})
    //   this.action3.push( {Row_no: 5, Action_name: 'Visible', description: 'Visible Menu'})

    //   this.action4.push( {Row_no: 1, Action_name: 'View', description: 'View icon'})
    //   this.action4.push( {Row_no: 2, Action_name: 'Save', description: 'Save icon'})
    //   this.action4.push( {Row_no: 3, Action_name: 'Edit', description: 'Edit icon'})
    //   this.action4.push( {Row_no: 4, Action_name: 'Delete', description: 'Delete icon'})
    //   this.action4.push( {Row_no: 5, Action_name: 'Visible', description: 'Visible Menu'})

    //   this.action5.push( {Row_no: 1, Action_name: 'View', description: 'View icon'})
    //   this.action5.push( {Row_no: 2, Action_name: 'Save', description: 'Save icon'})
    //   this.action5.push( {Row_no: 3, Action_name: 'Edit', description: 'Edit icon'})
    //   this.action5.push( {Row_no: 4, Action_name: 'Delete', description: 'Delete icon'})
    //   this.action5.push( {Row_no: 5, Action_name: 'Visible', description: 'Visible Menu'})

    //   this.action6.push( {Row_no: 1, Action_name: 'View', description: 'View icon'})
    //   this.action6.push( {Row_no: 2, Action_name: 'Save', description: 'Save icon'})
    //   this.action6.push( {Row_no: 3, Action_name: 'Edit', description: 'Edit icon'})
    //   this.action6.push( {Row_no: 4, Action_name: 'Delete', description: 'Delete icon'})
    //   this.action6.push( {Row_no: 5, Action_name: 'Visible', description: 'Visible Menu'})

    //   }
    // }else{
    //   this.action1 = []
    //   this.action2 = []
    //   this.action3 = []
    //   this.action4 = []
    //   this.action5 = []
    //   this.action6 = []

    // }

    console.log(this.currentRow)
    console.log(this.action1)

    if (this.currentRow == 1 && this.taskForm.status != 'INVALID') {
      if (this.action1.length == 0) {
        this.isShowMessageNotify2 = true
        this.messageNotify2 = 'Please select one action at least'
        return
      }
    }
    if (this.currentRow == 2 && this.taskForm.status != 'INVALID') {
      if (this.action2.length == 0) {
        this.isShowMessageNotify2 = true
        this.messageNotify2 = 'Please select one action at least'
        return
      }
    }
    if (this.currentRow == 3 && this.taskForm.status != 'INVALID') {
      if (this.action3.length == 0) {
        this.isShowMessageNotify2 = true
        this.messageNotify2 = 'Please select one action at least'
        return
      }
    }
    if (this.currentRow == 4 && this.taskForm.status != 'INVALID') {
      if (this.action4.length == 0) {
        this.isShowMessageNotify2 = true
        this.messageNotify2 = 'Please select one action at least'
        return
      }
    }
    if (this.currentRow == 5 && this.taskForm.status != 'INVALID') {
      if (this.action5.length == 0) {
        this.isShowMessageNotify2 = true
        this.messageNotify2 = 'Please select one action at least'
        return
      }
    }
    if (this.currentRow == 6 && this.taskForm.status != 'INVALID') {
      if (this.action6.length == 0) {
        this.isShowMessageNotify2 = true
        this.messageNotify2 = 'Please select one action at least'
        return
      }
    }

    console.log('here')
    //*************************************************** */

    if (this.selection.selected.length == 0 && this.taskForm.status != 'INVALID') {
      this.isShowMessageNotify2 = true
      this.messageNotify2 = 'Please select one screen at least'
      return
    }

    if (this.taskForm.status == 'INVALID') {
      console.log("INVALID")
      return;
    }






    if (this.action == "Create Data") // Add
    {
      let req: ManageRoleReqModel
      req = this.taskForm.getRawValue()

      req.Id = 0;
      req.create_by = this.user_name + ' | ' + new Date().toISOString()
      req.create_date = new Date().toISOString()
      req.update_by = this.user_name + ' | ' + new Date().toISOString()
      req.update_date = new Date().toISOString()

      this.add()

      this.screens.forEach(z => {
        z.actions = [];
        if (z.Screen_name == 'Register Management') {
          z.actions = this.action1
        }
        if (z.Screen_name == 'User Management') {
          z.actions = this.action2
        }
        if (z.Screen_name == 'Role Management') {
          z.actions = this.action3
        }
        if (z.Screen_name == 'Log') {
          z.actions = this.action4
        }
        if (z.Screen_name == 'Master Data') {
          z.actions = this.action5
        }
        if (z.Screen_name == 'Contract Note') {
          z.actions = this.action6
        }
      })


      req.screens = this.screens

      console.log(this.screens)


      this.manageRoleService.createRole(req).subscribe(x => {
        if (x.status_code == '00') {
          // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Save successfully' });
          // this.ELEMENT_DATA = x.payload
          // this.dataSource.data = this.ELEMENT_DATA

          this.GetAllDataRole()
          this.isShowMessageNotify = true
          this.messageNotify = 'Save successfully'

          this.onClear()



        } else {
          //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: x.status_text });

          // this.isShowMessageNotify = true
          //   this.messageNotify = x.status_text

          if (x.status_text == 'Please select one screen at least' || x.status_text.includes('Please select one action of')) {
            this.isShowMessageNotify2 = true
            this.messageNotify2 = x.status_text
            this.selection3.clear()
          } else {
            this.isShowMessageNotify = true
            this.messageNotify = x.status_text
          }
        }

      })

    }
    else // Edit
    {
      console.log(2)
      let req: ManageRoleReqModel
      req = this.taskForm.getRawValue()

      req.create_by = this.user_name + ' | ' + new Date().toISOString()
      req.create_date = new Date().toISOString()
      req.update_by = this.user_name + ' | ' + new Date().toISOString()
      req.update_date = new Date().toISOString()

      this.add()


      //req.screens = this.screens

      req.screens = this.screens_state

      console.log(req)


      this.manageRoleService.editRole(req).subscribe(x => {
        if (x.status_code == '00') {
          // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Save successfully' });
          // this.ELEMENT_DATA = x.payload
          // this.dataSource.data = this.ELEMENT_DATA
          this.GetAllDataRole()
          this.isShowMessageNotify = true
          this.messageNotify = 'Save successfully'

          // for (let i = 1; i <= 6; i++) {
          //   let element: HTMLElement
          //   element = document.getElementById('screen_' + i) as HTMLElement;
          //   let str = element.innerText
          //   //console.log(element)
          //   element.innerHTML = str

          // }

        } else {
          //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: x.status_text });
          this.isShowMessageNotify = true
          this.messageNotify = x.status_text

        }

      })

    }



    this.dataSource.data = this.ELEMENT_DATA

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


  showDialogCreateTask(row: any) {
    this.formSubmitted = false
    this.taskForm.reset();
    this.action = 'Create Data'
    //new Date().toLocaleDateString('en-GB')
    //this.taskForm.controls['create_by'].setValue(this.user_name + ' | ' + new Date().toLocaleDateString('sv-SE'))
    // this.taskForm.controls['update_by'].setValue(this.user_name + ' | ' + new Date().toLocaleDateString('sv-SE'))

    this.taskForm.controls['create_by'].setValue(this.user_name + ' | ' + this.formatDateToYYYYMMDDHHMMSS(new Date()))
    this.taskForm.controls['update_by'].setValue(this.user_name + ' | ' + this.formatDateToYYYYMMDDHHMMSS(new Date()))
    //this.taskForm.controls['system'].setValue(this.systemList[0].Id)
    //this.taskForm.controls['request_status'].setValue(this.actionList[0].master_value)
    //this.taskForm.controls['is_active'].setValue(this.statusIsActive[0].master_value)
    this.taskForm.controls['is_active'].setValue('0')

    this.visible = !this.visible


  }

  showDialogEditTask(row: any) {
    this.currentRow = -1
    this.formSubmitted = false
    this.taskForm.reset();
    this.action = 'Edit Data'
    console.log(row)



    this.screens = row.screens
    this.screens_state = this.screens
    this.add()



    this.taskForm.controls['role_name'].setValue(row.Role_name)
    this.taskForm.controls['Description'].setValue(row.description)
    this.taskForm.controls['is_active'].setValue(row.is_active)
    this.taskForm.controls['Id'].setValue(row.Id_tbm_Role)
    this.taskForm.controls['create_by'].setValue(row.create_by)
    this.taskForm.controls['update_by'].setValue(row.update_by)

    this.dataSource2.data.forEach(x => {
      //console.log(x)
      const found = this.screens.filter(z => z.Screen_name == x.Screen)
      if (found.length > 0) {
        if (found[0].actions.length > 0)
          this.selection.select(x)
      }

    })

    this.visible = !this.visible
  }

  showDialogViewTask(row: any) {
    this.formSubmitted = false
    this.taskForm.reset();
    this.action = 'View Data'

    this.setdisableControls()



    this.screens = row.screens
    this.screens_state = this.screens
    this.add()


    this.taskForm.controls['role_name'].setValue(row.Role_name)
    this.taskForm.controls['Description'].setValue(row.description)
    this.taskForm.controls['is_active'].setValue(row.is_active)
    this.taskForm.controls['create_by'].setValue(row.create_by)
    this.taskForm.controls['update_by'].setValue(row.update_by)

    this.dataSource2.data.forEach(x => {
      //console.log(x)
      const found = this.screens.filter(z => z.Screen_name == x.Screen)
      if (found.length > 0) {
        if (found[0].actions.length > 0)
          this.selection.select(x)
      }

    })

    this.is_disableCheckBox = true
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

  getColumn(row: any) {
    console.clear()
    console.log(this.selection.isSelected(row))

    if (this.selection.isSelected(row)) {
      console.log('1')
      this.selection.deselect(row)
      this.selection.toggle(row)

      var element: HTMLInputElement = <HTMLInputElement>document.getElementById('mat-checkbox-' + (row.Row_no + 1) + '-input');
      console.log(element)
      console.log(element.checked)
      if (element.checked && row.Row_no == 1) {
        this.action1 = []
        this.selection3.clear()
      }

      if (element.checked && row.Row_no == 2) {
        this.action2 = []
        this.selection3.clear()
      }

      if (element.checked && row.Row_no == 3) {
        this.action3 = []
        this.selection3.clear()
      }

      if (element.checked && row.Row_no == 4) {
        this.action4 = []
        this.selection3.clear()
      }

      if (element.checked && row.Row_no == 5) {
        this.action5 = []
        this.selection3.clear()
      }

      if (element.checked && row.Row_no == 6) {
        this.action6 = []
        this.selection3.clear()
      }


      this.currentRow = -1

    } else {
      console.log('2')
      this.getRecord(row)
      this.selection.toggle(row)
    }



  }

  deleteRecord(row: any) {
    console.log(row)
    let req: ManageRoleDeleteReqModel =
    {
      Id: row.Id_tbm_Role,

    }
    //req = this.taskForm.getRawValue()

    //req.Role_name = row.role_name
    this.manageRoleService.deleteRole(req).subscribe(x => {
      if (x.status_code == '00') {
        // this.ELEMENT_DATA = x.payload
        // this.dataSource.data = this.ELEMENT_DATA
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Delete successfully' });

        this.GetAllDataRole()
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


  handlePageEvent(e: PageEvent) {


    // this.pageEvent = e;
    // this.length = e.length;
    // this.pageSize = e.pageSize;
    // this.pageIndex = e.pageIndex;

    //this.paginator = e
    console.log(e)
    this.myIndex = e.pageSize * e.pageIndex
  }

  onSearch() {
    this.myIndex = 0

    console.log(this.formSearch.value.is_active)
    let result = this.ELEMENT_DATA;
    if (this.formSearch.value.txtSearch != '') {
      result = this.ELEMENT_DATA.filter(s => s.Role_name?.toUpperCase().includes(this.formSearch.value.txtSearch.toUpperCase()) ||
        s.description?.toUpperCase().includes(this.formSearch.value.txtSearch.toUpperCase()))
    }

    // if (this.formSearch.value.is_active != -1)
    //   result = result.filter(s => s.is_active == this.formSearch.value.is_active)
    let is_active = (this.formSearch.value.is_active?.master_value == undefined)
      ? this.statusIsActive.filter(z => z.master_text?.toLocaleUpperCase() == this.formSearch.value.is_active?.toLocaleUpperCase())[0]?.master_value
      : this.formSearch.value.is_active.master_value

    if (this.formSearch.value.is_active != undefined && this.formSearch.value.is_active != '')
      result = result.filter(s => s.is_active == is_active)

    if (this.formSearch.value.create_end_Date != '' && this.formSearch.value.create_end_Date != undefined) {
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
      //system: -1,
      is_active: '', // -1,
      create_end_Date: ''
    })

    this.dataSource.data = this.ELEMENT_DATA;

  }

  onCancel() {


    this.screens = []
    this.selection3.clear()
    this.selection.clear()



    this.formSubmitted = false

    this.is_disableCheckBox = false

    this.setEnableControls()

    this.action1 = []
    this.action2 = []
    this.action3 = []
    this.action4 = []
    this.action5 = []
    this.action6 = []

    this.currentRow = -1

    this.is_select_all_action = false


    this.visible = false
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource2.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource2.data.forEach(row => this.selection.select(row));
  }

  isAllSelected3() {
    const numSelected = this.selection3.selected.length;
    const numRows = this.dataSource3.data.length;

    // let element: HTMLInputElement = <HTMLInputElement>document.getElementById('mat-checkbox-8-input');
    // if (numSelected == 5){
    //   console.log(element.checked)
    // }

    return numSelected === numRows;
  }

  masterToggle3() {
    this.isAllSelected3() ?
      this.selection3.clear() :
      this.dataSource3.data.forEach(row => this.selection3.select(row));
  }

  getRecord(row: any) {

    if (this.action != 'View Data') {
      if (this.selection.hasValue() && this.isAllSelected()) {
        this.isShowMessageNotify2 = true
        this.messageNotify2 = 'Please UnSelect check all before choose one screen'
        return
      }
    }


    // let element: HTMLElement
    // element = document.getElementById('screen_' + row.Row_no) as HTMLElement;
    // element.innerHTML = '<u>' + row.Screen + '</u>'

    // console.log(row)

    if (this.action == 'Create Data') {
      //   this.add()
      console.log(this.currentRow)
      console.log(row.Row_no)
      if (row.Row_no != this.currentRow && this.currentRow == 1) {
        if (this.action1.length == 0) {
          console.log('action1 : ', this.action1)
          this.isShowMessageNotify2 = true
          this.messageNotify2 = 'Please select action one least'
          return
        }
      }

      if (row.Row_no != this.currentRow && this.currentRow == 2) {
        if (this.action2.length == 0) {
          this.isShowMessageNotify2 = true
          this.messageNotify2 = 'Please select action one least'
          return
        }
      }
      if (row.Row_no != this.currentRow && this.currentRow == 3) {
        if (this.action3.length == 0) {
          this.isShowMessageNotify2 = true
          this.messageNotify2 = 'Please select action one least'
          return
        }
      }
      if (row.Row_no != this.currentRow && this.currentRow == 4) {
        if (this.action4.length == 0) {
          this.isShowMessageNotify2 = true
          this.messageNotify2 = 'Please select action one least'
          return
        }
      }
      if (row.Row_no != this.currentRow && this.currentRow == 5) {
        if (this.action5.length == 0) {
          this.isShowMessageNotify2 = true
          this.messageNotify2 = 'Please select action one least'
          return
        }
      }
      if (row.Row_no != this.currentRow && this.currentRow == 6) {
        if (this.action6.length == 0) {
          this.isShowMessageNotify2 = true
          this.messageNotify2 = 'Please select action one least'
          return
        }
      }
      this.selection.select(row)
      this.currentRow = row.Row_no
      this.selection3.clear()

      if (row.Row_no == '1') {
        console.log('action1 : ', this.action1)
        this.action1.forEach(z => {
          this.selection3.select(z)
          this.selection3.select(this.dataSource3.data[z.Row_no - 1])
        })

      }

      if (row.Row_no == '2') {
        console.log('action2 : ', this.action2)
        this.action2.forEach(z => {
          this.selection3.select(z)
          this.selection3.select(this.dataSource3.data[z.Row_no - 1])
        })
      }

      if (row.Row_no == '3') {
        this.action3.forEach(z => {
          this.selection3.select(z)
          this.selection3.select(this.dataSource3.data[z.Row_no - 1])
        })
      }

      if (row.Row_no == '4') {
        this.action4.forEach(z => {
          this.selection3.select(z)
          this.selection3.select(this.dataSource3.data[z.Row_no - 1])
        })
      }

      if (row.Row_no == '5') {
        this.action5.forEach(z => {
          this.selection3.select(z)
          this.selection3.select(this.dataSource3.data[z.Row_no - 1])
        })
      }

      if (row.Row_no == '6') {
        this.action6.forEach(z => {
          this.selection3.select(z)
          this.selection3.select(this.dataSource3.data[z.Row_no - 1])
        })
      }

      return
    }



    // || this.action == 'Edit Data'
    if (this.action == 'View Data') {
      this.add()
      console.log(this.screens_state)
      const found = this.screens_state.find(z => z.Screen_name == row.Screen)
      if (found == undefined) {
        this.selection3.clear()
      } else {
        this.selection3.clear()

        found.actions.forEach(z => {
          this.selection3.select(this.dataSource3.data[z.Row_no - 1])
        })

      }
    }
    // else {
    //   this.add()

    //   this.selection.clear()
    //   this.selection.select(row)

    //   const found = this.screens.find(z => z.Screen_name == row.Screen)
    //   if (found == undefined) {
    //     this.selection3.clear()
    //   } else {
    //     this.selection3.clear()

    //     found.actions.forEach(z => {
    //       this.selection3.select(this.dataSource3.data[z.Row_no - 1])
    //     })

    //   }
    // }



    if (this.action == 'Edit Data') {

      this.selection3.clear()
      const obj2 = this.screens_state.filter(z => {
        return z.Screen_name == row.Screen
      })


      obj2[0]?.actions.forEach(z => {
        this.selection3.select(this.dataSource3.data[z.Row_no - 1])


        if (obj2[0].Screen_name == 'Register Management') {

          const isExists = this.action1.filter(y => y.Action_name == z.Action_name)
          if (isExists.length == 0) {
            this.action1.push(z)
          } else {
            // const remove_obj = this.action1.filter(y => y.Action_name != z.Action_name)
            // this.action1 = remove_obj
          }
        }

        if (obj2[0].Screen_name == 'User Management') {
          const isExists = this.action2.filter(y => y.Action_name == z.Action_name)
          if (isExists.length == 0) {
            this.action2.push(z)
          } else {
            // const remove_obj = this.action2.filter(y => y.Action_name != z.Action_name)
            // this.action2 = remove_obj
          }
        }
        if (obj2[0].Screen_name == 'Role Management') {
          const isExists = this.action3.filter(y => y.Action_name == z.Action_name)
          if (isExists.length == 0) {
            this.action3.push(z)
          } else {
            // const remove_obj = this.action3.filter(y => y.Action_name != z.Action_name)
            // this.action3 = remove_obj
          }
        }
        if (obj2[0].Screen_name == 'Log') {
          const isExists = this.action4.filter(y => y.Action_name == z.Action_name)
          if (isExists.length == 0) {
            this.action4.push(z)
          } else {
            // const remove_obj = this.action4.filter(y => y.Action_name != z.Action_name)
            // this.action4 = remove_obj
          }
        }
        if (obj2[0].Screen_name == 'Master Data') {
          const isExists = this.action5.filter(y => y.Action_name == z.Action_name)
          if (isExists.length == 0) {
            this.action5.push(z)
          } else {
            // const remove_obj = this.action5.filter(y => y.Action_name != z.Action_name)
            // this.action5 = remove_obj
          }
        }
        if (obj2[0].Screen_name == 'Contract Note') {
          const isExists = this.action6.filter(y => y.Action_name == z.Action_name)
          if (isExists.length == 0) {
            this.action6.push(z)
          } else {
            // const remove_obj = this.action6.filter(y => y.Action_name != z.Action_name)
            // this.action6 = remove_obj
          }
        }
      })

      console.clear()

      console.log(this.action1)
      console.log(this.action2)
      console.log(this.action3)
      console.log(this.action4)
      console.log(this.action5)
      console.log(this.action6)

      console.log(obj2)

      // return

      if (row.Row_no != this.currentRow && this.currentRow == 1) {
        if (this.action1.length == 0) {
          this.isShowMessageNotify2 = true
          this.messageNotify2 = 'Please select action one least'
          this.selection3.clear()
          return
        }
      }

      if (row.Row_no != this.currentRow && this.currentRow == 2) {
        if (this.action2.length == 0) {
          this.isShowMessageNotify2 = true
          this.messageNotify2 = 'Please select action one least'
          this.selection3.clear()
          return
        }
      }
      if (row.Row_no != this.currentRow && this.currentRow == 3) {
        if (this.action3.length == 0) {
          this.isShowMessageNotify2 = true
          this.messageNotify2 = 'Please select action one least'
          this.selection3.clear()
          return
        }
      }
      if (row.Row_no != this.currentRow && this.currentRow == 4) {
        if (this.action4.length == 0) {
          this.isShowMessageNotify2 = true
          this.messageNotify2 = 'Please select action one least'
          this.selection3.clear()
          return
        }
      }
      if (row.Row_no != this.currentRow && this.currentRow == 5) {
        if (this.action5.length == 0) {
          this.isShowMessageNotify2 = true
          this.messageNotify2 = 'Please select action one least'
          this.selection3.clear()
          return
        }
      }
      if (row.Row_no != this.currentRow && this.currentRow == 6) {
        if (this.action6.length == 0) {
          this.isShowMessageNotify2 = true
          this.messageNotify2 = 'Please select action one least'
          this.selection3.clear()
          return
        }
      }


      this.selection.select(row)
      this.currentRow = row.Row_no
      // this.selection3.clear()


      return


    }


    /*
    // if (this.selection.isSelected)
    //   this.selection.toggle(row)


    if (row.Row_no == 1) {
      //this.selection3.clear()
      //this.selection3.select(this.dataSource3.data[1])
      //this.selection3.select(this.dataSource3.data[3])

    } else if (row.Row_no == 2) {
      this.selection3.clear()
      this.selection3.select(this.dataSource3.data[0])
      this.selection3.select(this.dataSource3.data[2])

    } 

*/
  }

  getColumnAction(row: any) {

    console.clear()
    console.log(row)
    console.log(this.screens_state)

    if (this.selection.selected.length == 0) {
      this.selection3.clear()
      this.selection3.toggle(row)

      this.isShowMessageNotify2 = true
      this.messageNotify2 = 'Please select screen before select action'
      return
    }

    // 

    //console.log(this.selection3)
    //console.log(this.selection3.selection)
    if (this.currentRow == 1) {
      const isExists = this.action1.filter(z => z.Action_name == row.Action_name)
      if (isExists.length == 0) {
        this.action1.push(row)
      } else {
        const remove_obj = this.action1.filter(z => z.Action_name != row.Action_name)
        this.action1 = remove_obj
      }

      const is_existsScreen = this.screens_state.filter(a => a.Screen_name == 'Register Management')
      if (is_existsScreen.length == 0) {
        this.screens_state.push({ Screen_name: 'Register Management', Screen_description: '', actions: this.action1 })
      } else {
        is_existsScreen[0].actions = this.action1
      }
    }

    if (this.currentRow == 2) {
      const isExists = this.action2.filter(z => z.Action_name == row.Action_name)
      if (isExists.length == 0) {
        this.action2.push(row)
      } else {
        const remove_obj = this.action2.filter(z => z.Action_name != row.Action_name)
        this.action2 = remove_obj
      }

      const is_existsScreen = this.screens_state.filter(a => a.Screen_name == 'User Management')
      if (is_existsScreen.length == 0) {
        this.screens_state.push({ Screen_name: 'User Management', Screen_description: '', actions: this.action2 })
      } else {
        is_existsScreen[0].actions = this.action2
      }
    }

    if (this.currentRow == 3) {
      const isExists = this.action3.filter(z => z.Action_name == row.Action_name)
      if (isExists.length == 0) {
        this.action3.push(row)
      } else {
        const remove_obj = this.action3.filter(z => z.Action_name != row.Action_name)
        this.action3 = remove_obj
      }

      const is_existsScreen = this.screens_state.filter(a => a.Screen_name == 'Role Management')
      if (is_existsScreen.length == 0) {
        this.screens_state.push({ Screen_name: 'Role Management', Screen_description: '', actions: this.action3 })
      } else {
        is_existsScreen[0].actions = this.action3
      }
    }

    if (this.currentRow == 4) {
      const isExists = this.action4.filter(z => z.Action_name == row.Action_name)
      if (isExists.length == 0) {
        this.action4.push(row)

      } else {
        const remove_obj = this.action4.filter(z => z.Action_name != row.Action_name)
        this.action4 = remove_obj
      }

      const is_existsScreen = this.screens_state.filter(a => a.Screen_name == 'Log')
      if (is_existsScreen.length == 0) {
        this.screens_state.push({ Screen_name: 'Log', Screen_description: '', actions: this.action4 })
      } else {
        is_existsScreen[0].actions = this.action4
      }
    }

    if (this.currentRow == 5) {
      //console.log('action 5 : ',this.action5)
      const isExists = this.action5.filter(z => z.Action_name == row.Action_name)
      if (isExists.length == 0) {
        this.action5.push(row)
      } else {
        const remove_obj = this.action5.filter(z => z.Action_name != row.Action_name)
        this.action5 = remove_obj
      }

      const is_existsScreen = this.screens_state.filter(a => a.Screen_name == 'Master Data')
      if (is_existsScreen.length == 0) {
        this.screens_state.push({ Screen_name: 'Master Data', Screen_description: '', actions: this.action5 })
      } else {
        is_existsScreen[0].actions = this.action5
      }

      //console.log('action 5 : ',this.action5)
    }

    if (this.currentRow == 6) {
      const isExists = this.action6.filter(z => z.Action_name == row.Action_name)
      if (isExists.length == 0) {
        this.action6.push(row)
      } else {
        const remove_obj = this.action6.filter(z => z.Action_name != row.Action_name)
        this.action6 = remove_obj
      }

      const is_existsScreen = this.screens_state.filter(a => a.Screen_name == 'Contract Note')
      if (is_existsScreen.length == 0) {
        this.screens_state.push({ Screen_name: 'Contract Note', Screen_description: '', actions: this.action6 })
      } else {
        is_existsScreen[0].actions = this.action6
      }
    }

    //console.log(this.action1)
    //console.log(this.action2)

  }



  // isCheckAllScreen: boolean = false
  getAllScreen() {

    console.log('isAllSelected :', this.isAllSelected())
    if (this.selection.hasValue() && this.isAllSelected() && this.selection3.selected.length != 0) {
      this.masterToggle3()
      this.selection3.clear()
    } else {
      this.selection3.clear()
    }
    this.currentRow = -1

  }

  is_select_all_action : boolean = false
  getAllAction(checked: any) {
    if (this.selection.selected.length == 0) {
      this.masterToggle3()
      this.isShowMessageNotify2 = true
      this.messageNotify2 = 'Please select screen before select action'
      return
    }

    this.is_select_all_action = !this.is_select_all_action
    console.log(this.is_select_all_action)

    if (this.is_select_all_action ) {

      console.log('do')


      if (this.currentRow == -1) {
        this.action1 = []
        this.action1.push({ Row_no: 1, Action_name: 'View', description: 'View icon' })
        this.action1.push({ Row_no: 2, Action_name: 'Save', description: 'Save icon' })
        this.action1.push({ Row_no: 3, Action_name: 'Edit', description: 'Edit icon' })
        this.action1.push({ Row_no: 4, Action_name: 'Delete', description: 'Delete icon' })
        this.action1.push({ Row_no: 5, Action_name: 'Visible', description: 'Visible Menu' })

        this.action2 = []
        this.action2.push({ Row_no: 1, Action_name: 'View', description: 'View icon' })
        this.action2.push({ Row_no: 2, Action_name: 'Save', description: 'Save icon' })
        this.action2.push({ Row_no: 3, Action_name: 'Edit', description: 'Edit icon' })
        this.action2.push({ Row_no: 4, Action_name: 'Delete', description: 'Delete icon' })
        this.action2.push({ Row_no: 5, Action_name: 'Visible', description: 'Visible Menu' })

        this.action3 = []
        this.action3.push({ Row_no: 1, Action_name: 'View', description: 'View icon' })
        this.action3.push({ Row_no: 2, Action_name: 'Save', description: 'Save icon' })
        this.action3.push({ Row_no: 3, Action_name: 'Edit', description: 'Edit icon' })
        this.action3.push({ Row_no: 4, Action_name: 'Delete', description: 'Delete icon' })
        this.action3.push({ Row_no: 5, Action_name: 'Visible', description: 'Visible Menu' })

        this.action4 = []
        this.action4.push({ Row_no: 1, Action_name: 'View', description: 'View icon' })
        this.action4.push({ Row_no: 2, Action_name: 'Save', description: 'Save icon' })
        this.action4.push({ Row_no: 3, Action_name: 'Edit', description: 'Edit icon' })
        this.action4.push({ Row_no: 4, Action_name: 'Delete', description: 'Delete icon' })
        this.action4.push({ Row_no: 5, Action_name: 'Visible', description: 'Visible Menu' })

        this.action5 = []
        this.action5.push({ Row_no: 1, Action_name: 'View', description: 'View icon' })
        this.action5.push({ Row_no: 2, Action_name: 'Save', description: 'Save icon' })
        this.action5.push({ Row_no: 3, Action_name: 'Edit', description: 'Edit icon' })
        this.action5.push({ Row_no: 4, Action_name: 'Delete', description: 'Delete icon' })
        this.action5.push({ Row_no: 5, Action_name: 'Visible', description: 'Visible Menu' })

        this.action6 = []
        this.action6.push({ Row_no: 1, Action_name: 'View', description: 'View icon' })
        this.action6.push({ Row_no: 2, Action_name: 'Save', description: 'Save icon' })
        this.action6.push({ Row_no: 3, Action_name: 'Edit', description: 'Edit icon' })
        this.action6.push({ Row_no: 4, Action_name: 'Delete', description: 'Delete icon' })
        this.action6.push({ Row_no: 5, Action_name: 'Visible', description: 'Visible Menu' })



      }
      else if (this.currentRow == 1) {
        this.action1 = []
        this.action1.push({ Row_no: 1, Action_name: 'View', description: 'View icon' })
        this.action1.push({ Row_no: 2, Action_name: 'Save', description: 'Save icon' })
        this.action1.push({ Row_no: 3, Action_name: 'Edit', description: 'Edit icon' })
        this.action1.push({ Row_no: 4, Action_name: 'Delete', description: 'Delete icon' })
        this.action1.push({ Row_no: 5, Action_name: 'Visible', description: 'Visible Menu' })
      } else if (this.currentRow == 2) {
        this.action2 = []
        this.action2.push({ Row_no: 1, Action_name: 'View', description: 'View icon' })
        this.action2.push({ Row_no: 2, Action_name: 'Save', description: 'Save icon' })
        this.action2.push({ Row_no: 3, Action_name: 'Edit', description: 'Edit icon' })
        this.action2.push({ Row_no: 4, Action_name: 'Delete', description: 'Delete icon' })
        this.action2.push({ Row_no: 5, Action_name: 'Visible', description: 'Visible Menu' })

       


      } else if (this.currentRow == 3) {
        this.action3 = []
        this.action3.push({ Row_no: 1, Action_name: 'View', description: 'View icon' })
        this.action3.push({ Row_no: 2, Action_name: 'Save', description: 'Save icon' })
        this.action3.push({ Row_no: 3, Action_name: 'Edit', description: 'Edit icon' })
        this.action3.push({ Row_no: 4, Action_name: 'Delete', description: 'Delete icon' })
        this.action3.push({ Row_no: 5, Action_name: 'Visible', description: 'Visible Menu' })

      } else if (this.currentRow == 4) {
        this.action4 = []
        this.action4.push({ Row_no: 1, Action_name: 'View', description: 'View icon' })
        this.action4.push({ Row_no: 2, Action_name: 'Save', description: 'Save icon' })
        this.action4.push({ Row_no: 3, Action_name: 'Edit', description: 'Edit icon' })
        this.action4.push({ Row_no: 4, Action_name: 'Delete', description: 'Delete icon' })
        this.action4.push({ Row_no: 5, Action_name: 'Visible', description: 'Visible Menu' })

      } else if (this.currentRow == 5) {
        this.action5 = []
        this.action5.push({ Row_no: 1, Action_name: 'View', description: 'View icon' })
        this.action5.push({ Row_no: 2, Action_name: 'Save', description: 'Save icon' })
        this.action5.push({ Row_no: 3, Action_name: 'Edit', description: 'Edit icon' })
        this.action5.push({ Row_no: 4, Action_name: 'Delete', description: 'Delete icon' })
        this.action5.push({ Row_no: 5, Action_name: 'Visible', description: 'Visible Menu' })

      } else if (this.currentRow == 6) {
        this.action6 = []
        this.action6.push({ Row_no: 1, Action_name: 'View', description: 'View icon' })
        this.action6.push({ Row_no: 2, Action_name: 'Save', description: 'Save icon' })
        this.action6.push({ Row_no: 3, Action_name: 'Edit', description: 'Edit icon' })
        this.action6.push({ Row_no: 4, Action_name: 'Delete', description: 'Delete icon' })
        this.action6.push({ Row_no: 5, Action_name: 'Visible', description: 'Visible Menu' })
      }

    }

    else {
      console.log('else')
      this.selection3.clear()
      this.masterToggle3()

      if (this.currentRow == -1) {
        this.action1 = []
        this.action2 = []
        this.action3 = []
        this.action4 = []
        this.action5 = []
        this.action6 = []
      } else if (this.currentRow == 1) {
        this.action1 = []
      } else if (this.currentRow == 2) {
        this.action2 = []
      } else if (this.currentRow == 3) {
        this.action3 = []
      } else if (this.currentRow == 4) {
        this.action4 = []
      } else if (this.currentRow == 5) {
        this.action5 = []
      } else if (this.currentRow == 6) {
        this.action6 = []
      }

    }
  }



  add() {



    this.selection.selected.forEach(row => {

      const found = this.screens.find(z => z.Screen_name == row.Screen)

      console.log(found)
      if (found == undefined) {
        this.screens.push(
          {
            Screen_name: row.Screen,
            Screen_description: '',
            actions: this.selection3.selected
          })
      } else {
        const newObj = this.screens.filter(z => z.Screen_name != row.Screen)
        newObj.push(
          {
            Screen_name: row.Screen,
            Screen_description: '',
            actions: this.selection3.selected
          })

        this.screens = newObj

      }
    })

    //console.log(this.screens)




  }

  setdisableControls() {
    this.taskForm.controls['role_name'].disable()
    this.taskForm.controls['Description'].disable()
    this.taskForm.controls['is_active'].disable()


    this.taskForm.controls['create_by'].disable()
    this.taskForm.controls['update_by'].disable()


  }

  setEnableControls() {
    this.taskForm.controls['role_name'].enable()
    this.taskForm.controls['Description'].enable()
    this.taskForm.controls['is_active'].enable()


    //this.taskForm.controls['create_by'].enable()
    //this.taskForm.controls['update_by'].enable()
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
