import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, mergeMap, of, takeUntil } from 'rxjs';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

  constructor(private router: Router, private layoutService: LayoutService) {
    this.layoutService.visibilityNav.next(false);
   }

  navigate() {
    this.router.navigate(['./collections'], {
      skipLocationChange: false,
    });
  }
}
