import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggleMenu = new EventEmitter();
  IsshowProfile: boolean = false;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {}

  toggleProfile(clickOutside = '') {
    if (clickOutside)
      this.IsshowProfile = false;
    else
      this.IsshowProfile = !this.IsshowProfile
  }

  toggleBurgerMenu() {
    this.toggleMenu.emit();
  }

  signout() {
    this.authService.logout();
  }
}
