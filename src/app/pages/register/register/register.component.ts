import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { ManageMasterSystemReqModel } from 'src/app/core/model/ManageMasterSystem/ManageMasterSystemReqModel';
import { ManageRegisterCreateReqModel } from 'src/app/core/model/ManageRegister/ManageRegisterCreateReqModel';
import { ManageUserReqModel } from 'src/app/core/model/ManageUser/ManageUserReqModel';
import { MasterReqModel } from 'src/app/core/model/Master/MasterReqModel';
import { MasterResModel } from 'src/app/core/model/Master/MasterResModel';
import { ManageRegisterService } from 'src/app/core/services/manage-register.service';
import { ManageUserService } from 'src/app/core/services/manage-user.service';
import { MasterSystemService } from 'src/app/core/services/master-system.service';
import { MasterService } from 'src/app/core/services/master.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  request_date : string 
  registerForm : FormGroup;
  formSubmitted : boolean = false
  isShowConfirm : boolean = false
  isShowMessageNotify : boolean = false
  messageNotify : string = ''
  systemList : Observable<ManageMasterSystemReqModel[]> = of([])

  statusRequest$ :  Observable<MasterResModel[]> = of([]) 
  statusIsActive$ :  Observable<MasterResModel[]> = of([]) 

  isShowMessageNotify2 : boolean = false
  messageNotify2 : string = ''

  constructor(private formBuilder: FormBuilder
             ,private confirmationService: ConfirmationService
             ,private messageService: MessageService
             ,private masterSystemService: MasterSystemService 
             ,private masterService: MasterService
             ,private manageRegisterService : ManageRegisterService 
             ,private manageUserService : ManageUserService
             ,private router: Router) { }

  ngOnInit() {

    this.getMasterData();

    this.GetAllSystemData()

    this.createForm()

  }

  getMasterData() {
    let req : MasterReqModel 
    this.masterService.GetAllMaster().subscribe(x => {
      if (x.status_code == '00'){
        const result = x.payload.filter (x => {
          return x.master_type == '003'
        })

        const resultIsActive = x.payload.filter (x => {
          return x.master_type == '001'
        })

        this.statusRequest$ = of(result)

        this.statusIsActive$ = of(resultIsActive)

        this.registerForm.patchValue({
          request_status : result[0].master_value ,
          is_active : resultIsActive[1].master_value
         })

        
      }else {
        console.log(x)
      }
    })
  }

  createForm() {
    this.request_date = new Date().toLocaleDateString('en-GB');
    this.registerForm = this.formBuilder.group({
      user_name: ['', [Validators.required ]],
      password: ['', [Validators.required ] ],
      password_confirm: ['', [Validators.required  ]],
     // email: ['' , [Validators.required ,  Validators.pattern('[a-z0-9\.]+@[a-z]+[.][a-z]{2,3}|.[\S]+[.]+co+[.]th')]],
     //email: ['' , [Validators.required ,  {validator : this.checkEmail('email') } ]],
     //email: ['' , [Validators.required  ,Validators.pattern('[a-z0-9\.]+@[a-z]+[.][a-z]{2,3}|.[\S]+[.]')]],  
     //email: ['' ,[Validators.required , Validators.pattern('[a-z0-9\.]+@[a-z]+[.][a-z]{2,3}|.[\S]+[.].*$') ]],
     email: ['' ,[Validators.required  ]],
      system: [ '' , Validators.required],
      request_date: [
      {
        value : this.request_date,
        disabled : true
      }],
      request_status: [ {
        value : 'Request',
        disabled : true
      }],
      is_active: [ {
        value : 'Inactive',
        disabled : true
      }],
      create_by: [{
        value :  'Manual Register|' + this.request_date,
        disabled : true
      }],
      update_by: [{
        value : 'Manual Register|' + this.request_date,
        disabled : true
      }],

    },{ validator: this.passwordMatchValidator('password', 'password_confirm') }
    );

   

  }


  onCloseDialogNotifyMessage2() {
    //console.log('z')

    this.isShowMessageNotify2 = false
    //this.visible = false
    //this.router.navigate(['/manage-register']);
  }


  // checkUser(firstControl : string) : ValidatorFn {

  //   return (control: AbstractControl): ValidationErrors | null => {
 
  //     const email = control.get(firstControl).value;
     
  //     console.log(email)
  //     if (email) { 
  //       return { 'noMatch': true } 
  //     }
 
  //     return null
 
  //   }
  // }


  checkUser (firstControl : string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
 
      const email = control.get(firstControl).value;
     
      console.log(email)
      if (email) { 
        return { 'noMatch': true } 
      }
 
      return null
 
    }
  }

  checkEmail (firstControl : string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
 
      const email = control.get(firstControl).value;
     
      console.log(email)
      if (email) { 
        return { 'noMatch': true } 
      }
 
      return null
 
    }
  }


  GetAllSystemData(){

    let req : ManageMasterSystemReqModel 
    this.masterSystemService.searchMasterSystem().subscribe(x => {
      if (x.status_code == '00'){

        const result = x.payload.filter( x => {
           return x.status == '1'
        })
        //this.systemList = of(x.payload)

        this.systemList = of(result)

        this.registerForm.patchValue({
          // system : '23',
          //system : x.payload[0].Id
          system : result[0].System_code +''
         })

        
      }else {
        console.log(x)
      }
    })
  }

  passwordMatchValidator(firstControl : string , secondControl : string ) : ValidatorFn   {
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

  onSubmit() {


    const expeptChar = ['@', '#' , '$' ,'%' , '&' ,'*' , '!' ,'+' ,'.']

    const is_expert = expeptChar.some(i => this.registerForm.get('user_name').value?.includes(i))
    if(is_expert) {
      this.formSubmitted = true

      this.isShowMessageNotify2 = true 
      this.messageNotify2 = 'Please enter your username correctly. Do not use special characters.Example : @#$%&*!+.'

      return 
    }


    if (this.registerForm.get('email').value != '' &&  this.registerForm.get('email').value != null) {

    const expepttring = ['.co.th', '.com' ]

    if (! (this.registerForm.get('email').value.endsWith('.com')  || this.registerForm.get('email').value.endsWith('.co.th'))) {
      this.formSubmitted = true

      this.isShowMessageNotify2 = true 
      this.messageNotify2 = 'Please enter your email in the correct format. Example : xxx@xxmail.com'

      return 

    }

    if  (!this.registerForm.get('email').value.includes('@')) {
      this.formSubmitted = true

      this.isShowMessageNotify2 = true 
      this.messageNotify2 = 'Please enter your email in the correct format. Example : xxx@xxmail.com'

      return 

    }

  }


    
   
    console.log(this.registerForm.value)
    let req : ManageUserReqModel 
    //req = this.registerForm.value

    req = this.registerForm.getRawValue()

    req.request_status = "2"

    req.create_by = 'Manual Register|' + new Date().toISOString()
    req.update_by = 'Manual Register|' + new Date().toISOString()
    req.update_date =  new Date().toISOString()
    req.create_date =  new Date().toISOString()
    req.Id = 0
    req.authenticate = "1"
    req.role = "0"

    req.system_code = this.registerForm.value.system

    req.status = "0"

    console.log(req);

    if (this.registerForm.valid)
    {
      this.confirm2(req);
    }else{
      this.formSubmitted = true

      console.log(this.registerForm)
    }

    

     
  }

  onCloseDialogNotifyMessage() {
    //console.log('z')

    this.isShowMessageNotify = false
    this.router.navigate(['/login']);
  }

  confirm2(req : ManageUserReqModel ){
    this.confirmationService.confirm({
      message: 'Do you want to register this record?',
      header: 'Register Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.manageUserService.createUser(req).subscribe(x => {
          if (x.status_code == '00') {
           // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Save successfully' });

           this.isShowMessageNotify = true 
            this.messageNotify = 'Save successfully'

                // setTimeout(() => {
                //   this.router.navigate(['/login']);
                // }, 3000);  //5s
          }else{
            //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: x.status_text });
            this.isShowMessageNotify = true 
            this.messageNotify = x.status_text 

          }
        })
          
          
      },
      reject: (type) => {
          switch (type) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                  break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                  break;
          }
      }
  });
}

}
