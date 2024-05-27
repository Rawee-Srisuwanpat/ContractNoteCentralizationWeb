import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ResetPasswordModel } from 'src/app/core/model/ResetPasswordModel';
import { ResetPasswordService } from 'src/app/core/services/resetPassword.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm : FormGroup

  isShowConfirm : boolean = false
  formSubmitted : boolean = false

  isShowMessageNotify : boolean = false
  messageNotify : string = ''

  constructor( private router: Router
    ,private routeActive: ActivatedRoute
    ,private formBuilder: FormBuilder 
    ,private resetPassService: ResetPasswordService
    ,private messageService: MessageService) { }

  ngOnInit() {


    

    if (!localStorage.getItem('verify_code')){
      this.router.navigate(['/404']);
    }

    this.resetPasswordForm = this.formBuilder.group({
      user_name: [ {value : '', disabled : true }  ,Validators.required
             ],
      password : ['' ,Validators.required],
      password_confirm : ['' ,Validators.required],
    },{ validator: this.passwordMatchValidator('password', 'password_confirm') });


    window.addEventListener('beforeunload', function (e) {
      localStorage.removeItem('verify_code'); 
    });

    this.routeActive.queryParams.subscribe(x => {
      //console.log(x['user_name'])
      this.resetPasswordForm.patchValue({
        user_name : x['user_name']
       })
    })

    
  }

  ngOnDestroy() {
    localStorage.removeItem('verify_code');
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


  onCloseDialogNotifyMessage() {
    //console.log('z')

    this.isShowMessageNotify = false
    this.router.navigate(['/login']);
  }


  onResetPassword() {

    if (!this.resetPasswordForm.valid) {
      this.formSubmitted = true

      //console.log(this.resetPasswordForm.get('user_name').value)
      return
    }

    let req : ResetPasswordModel 
    req = this.resetPasswordForm.getRawValue()

    console.log(req)

    this.resetPassService.resetPassword(req).subscribe(x => {
      console.log(x)

      if (x.status_code == "00"){
        //this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Save successfully' });

        this.isShowMessageNotify = true 
        this.messageNotify = 'Save successfully'
      }else{
       // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: x.status_text });
        this.isShowMessageNotify = true 
        this.messageNotify = x.status_text 

      }

    })

  }

}
