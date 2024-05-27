import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { ManageRoleService } from 'src/app/core/services/manage-role.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginFormGroup : FormGroup
 
  isUser = false;
  isPass = false;

  messageLogin :string
  isShowAlert :boolean = false
  isSuccess : boolean = false

  constructor(private router: Router
              ,private authenticationService: AuthenticationService
              ,private  manageRoleService : ManageRoleService
  ){ }

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      userName : new FormControl(''),
      password : new FormControl(''),
    })
  }

  login(user :string , password :string) {
    this.isShowAlert = false

    if(user == '' && password == '') {
      this.messageLogin = 'Please enter user name and password.'
      this.isShowAlert = true
      return
    }

    if(user == '') {
      this.messageLogin = 'Please enter User name.'
      this.isShowAlert = true
      return
    }

    if(password == '') {
      this.messageLogin = 'Please enter password.'
      this.isShowAlert = true
      return
    }

    

    this.authenticationService.loginApiAndGetToken(user,password).subscribe(data => {
          // if (rememberMe) {
          //     localStorage.setItem('savedUserEmail', email);
          // } else {
          //     localStorage.removeItem('savedUserEmail');
          // }
          console.log(data)

          if (data === false) {
            this.messageLogin = 'Cannot connect API'
            this.isShowAlert = true
            return
          }

          if (data?.status?.status_code == '00')
          {
            console.log('xxx')

            localStorage.setItem('token', data.token);
            localStorage.setItem('refresh_token', data.refresh_token);
            this.getRole(user)

           
          }else{

            this.messageLogin = data?.status?.status_desc
            this.isShowAlert = true
          }
      },
      error => {
        console.log(error.error)
          //this.notificationService.openSnackBar(error.error);
          //this.loading = false;

          this.messageLogin = 'Password incorrect'
          this.isShowAlert = true
      }
    );

  }

  onClear()
  {
    this.loginFormGroup.patchValue({
      userName : '',
      password : '',
    })

    this.isShowAlert = false
  }

  onKeyPress()
  {
    this.isShowAlert = false
  }

  getRole(user) {
    this.manageRoleService.searchRoleByUser(user).subscribe(data => {
       //localStorage.setItem('Role', { Role : data.payload.Role}.Role );

      

       localStorage.setItem('Role', data.payload[0].Role_name );

       localStorage.setItem('Role_obj', JSON.stringify(data.payload[0]) );
       localStorage.setItem('savedUser', user.toUpperCase());
       this.router.navigate(['/welcome']);
    
    })

  }

  

}
