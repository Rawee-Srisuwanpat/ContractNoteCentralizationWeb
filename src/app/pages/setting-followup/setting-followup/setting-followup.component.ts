import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable, Observer, of } from 'rxjs';
import { MasterSystemService } from 'src/app/core/services/master-system.service';
import { ManageMasterSystemReqModel } from 'src/app/core/model/ManageMasterSystem/ManageMasterSystemReqModel';
import { MasterResModel } from 'src/app/core/model/Master/MasterResModel';
import { MasterReqModel } from 'src/app/core/model/Master/MasterReqModel';
import { MasterService } from 'src/app/core/services/master.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { PermissionSystemCodeService } from 'src/app/core/services/permissionSystemCode.service';
import { City } from 'src/app/core/model/City';
import { IdleService } from 'src/app/core/services/IdleService';
import { MasterSystemComponent } from '../../master-system/master-system/master-system.component';

@Component({
  selector: 'app-setting-followup',
  templateUrl: './setting-followup.component.html',
  styleUrls: ['./setting-followup.component.scss'],
})
export class SettingFollowUpComponent implements OnInit {

  activeIndex : number = 0
  
  ngOnInit() {
  }


}
