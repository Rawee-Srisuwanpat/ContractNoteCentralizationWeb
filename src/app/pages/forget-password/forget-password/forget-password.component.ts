import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SendOtpModel } from 'src/app/core/model/SendOtpModel';
import { VerifyOtpModel } from 'src/app/core/model/VerifyOtpModel';
import { ForgotPasswordService } from 'src/app/core/services/forgotPass.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  model: any = Object.assign({});
  isUser = false;
  isPass = false;

  forgotPasswordForm;
  formSubmitted : boolean = false
  isShowMessageNotify : boolean = false
  messageNotify : string = ''

  
  isShowConfirm : boolean = false

  VerifyForm;

  constructor(private formBuilder: FormBuilder
    ,private forgotPassService: ForgotPasswordService
    ,private messageService: MessageService
    ,private router: Router) { }

  ngOnInit() {

    this.forgotPasswordForm = this.formBuilder.group({
      user_name: ['' ,[Validators.required  ] ],
    });

    this.VerifyForm = this.formBuilder.group({
      verify_code : ['' ,[Validators.required  ]]
    })
  }

  onSendOTP(){

    
    if (!this.forgotPasswordForm.valid) {
      this.formSubmitted = true
      return
    }
    console.log(this.forgotPasswordForm.value)

    let req : SendOtpModel 
    req = this.forgotPasswordForm.value

      this.forgotPassService.sendOtp(req).subscribe(x => {
        console.log(x)

        if (x.status_code == "00"){
          //this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'ส่ง OTP แล้ว' });

          this.isShowMessageNotify = true 
          this.messageNotify = x.status_text
        }else{
          //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: x.status_text });
          this.isShowMessageNotify = true 
          this.messageNotify = x.status_text
        }

      })

  }

  onCloseDialogNotifyMessage() {
    //console.log('z')

    this.isShowMessageNotify = false
    //this.router.navigate(['/login']);
  }


  onVerifytOtp() {
    console.log(this.VerifyForm.controls['verify_code'].value)
    console.log(this.forgotPasswordForm.controls['user_name'].value)

    if (!this.forgotPasswordForm.valid) {
      this.formSubmitted = true
      return
    }

    if (!this.VerifyForm.valid) {
      this.formSubmitted = true
      return
    }


    let req : VerifyOtpModel = {
      user_name :  this.forgotPasswordForm.controls['user_name'].value
      ,verify_code :this.VerifyForm.controls['verify_code'].value
    }
      this.forgotPassService.verifyOtp(req).subscribe(x => {
        console.log(x)

        if (x.status_code == "00"){
          localStorage.setItem('verify_code', req.verify_code);
          this.router.navigate(['/resetpassword'],{queryParams : {user_name : req.user_name}});
        }else{
          //this.messageService.add({ severity: 'error', summary: 'Rejected', detail: x.status_text });

          this.isShowMessageNotify = true 
          this.messageNotify = x.status_text 
        }

      })
  }

}
