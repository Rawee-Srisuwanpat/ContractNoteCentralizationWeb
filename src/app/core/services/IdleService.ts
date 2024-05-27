import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { fromEvent, Subject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class IdleService {

  public idle$: Subject<boolean> = new Subject();
  public wake$: Subject<boolean> = new Subject();

  isIdle = false;
  //private idleAfterSeconds = 10;
  private idleAfterSeconds = 300;
  private countDown;

  constructor(private router: Router) {
    // Setup events
    fromEvent(document, 'mousemove').subscribe(() => this.onInteraction());
    fromEvent(document, 'touchstart').subscribe(() => this.onInteraction());
    fromEvent(document, 'keydown').subscribe(() => this.onInteraction());
  }

  onInteraction() {
    // Is idle and interacting, emit Wake
    if (this.isIdle) {
        console.log( new Date().toLocaleString() + ' : Not Idle')
      this.isIdle = false;
      this.wake$.next(true);
    }

    // User interaction, reset start-idle-timer
    clearTimeout(this.countDown);
    
    
    this.countDown = setTimeout(() => {
        // Countdown done without interaction - emit Idle
        this.isIdle = true;
        //this.idle$.next(true);
        
        console.log( new Date().toLocaleString() + ' : Idle')

        if (window.location.href.includes('/login')) {
          console.log( new Date().toLocaleString() + ' : You are at login page')
        }else{
          localStorage.clear();
          this.router.navigate(['/login']);
        }

        
    }, this.idleAfterSeconds * 1_000)
  }

  onFristTimeComein() {
    console.log(new Date().toLocaleString() + ' : Frist time')
  }


}