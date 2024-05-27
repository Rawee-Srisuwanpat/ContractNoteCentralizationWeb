
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
  })
export class ApiUrl {

    //baseURL = 'https://localhost:7118'

    //baseURL = 'https://localhost:7296' // Dev

    //baseURL = 'http://128.1.5.78:8090' // UAT


    baseURL = environment.apiEndpoint



    heroesUrl: string = `${this.baseURL}/api/Values`
    heroesUrl2: string = `${this.baseURL}/api/Values123333333`

    users_authentication : string = `${this.baseURL}/api/UsersAuthentication`

    
    loginAndGetToken : string = `${this.baseURL}/api/Authentication/Login`
    refreshToken : string = `${this.baseURL}/api/Authentication/RefreshToken`
    login : string = `${this.baseURL}/api/UsersAuthentication/Login`
    sendOtp : string = `${this.baseURL}/api/UsersAuthentication/SendOtp`
    verifyOtp : string = `${this.baseURL}/api/UsersAuthentication/VerifyOtp`
    resetPassword : string = `${this.baseURL}/api/UsersAuthentication/ResetPassword`

    getAllMaster : string = `${this.baseURL}/api/Master/GetAllMaster`
    getAllActionCode : string = `${this.baseURL}/api/Master/GetAllActionCode`
    getAllResultCode : string = `${this.baseURL}/api/Master/GetAllResultCode`
    getAllCollectorTeamCode : string = `${this.baseURL}/api/Master/GetAllCollectorTeamCode`
    getAllCollectorCode : string = `${this.baseURL}/api/Master/GetAllCollectorCode`

    searchLogLogin  : string = `${this.baseURL}/api/LogLogin/SearchLogLogin`

    searchLogApi  : string = `${this.baseURL}/api/LogApi/Inquiry`
    
    searchMasterSystem : string = `${this.baseURL}/api/MasterSystem/SearchMasterSystem`
    createMasterSystem : string = `${this.baseURL}/api/MasterSystem/CreateMasterSystem`
    editMasterSystem : string = `${this.baseURL}/api/MasterSystem/EditMasterSystem`
    deleteMasterSystem : string = `${this.baseURL}/api/MasterSystem/DeleteMasterSystem`

    // searchRegister : string = `${this.baseURL}/api/ManageRegister/SearchRegister`
    // createRegister : string = `${this.baseURL}/api/ManageRegister/CreateRegister`
    // editRegister : string = `${this.baseURL}/api/ManageRegister/EditRegister`
    // deleteRegister : string = `${this.baseURL}/api/ManageRegister/DeleteRegister`

    searchUser : string = `${this.baseURL}/api/ManageUser/SearchUser`
    createUser : string = `${this.baseURL}/api/ManageUser/CreateUser`
    editUser : string = `${this.baseURL}/api/ManageUser/EditUser`
    deleteUser : string = `${this.baseURL}/api/ManageUser/DeleteUser`

    searchRole : string = `${this.baseURL}/api/ManageRole/SearchRole`
    searchRoleByUser : string = `${this.baseURL}/api/ManageRole/SearchRoleByUser`
    createRole : string = `${this.baseURL}/api/ManageRole/CreateRole`
    editRole : string = `${this.baseURL}/api/ManageRole/EditRole`
    deleteRole : string = `${this.baseURL}/api/ManageRole/DeleteRole`

    searchContractNote : string = `${this.baseURL}/api/ContactNote/SearchContractNote`

    searchContractNoteByInquiryWeb : string = `${this.baseURL}/api/FollowUp/InquiryWeb`


  }