import { DOCUMENT } from "@angular/common";
import { Directive, ElementRef, EventEmitter, HostListener, Inject, Output } from "@angular/core";
import { Subscription, fromEvent, filter } from 'rxjs';

@Directive({
    selector: '[OffClick]'
  })
  export class MyOffClickDirective {
    @Output() clickOutside = new EventEmitter<void>();

    documentClickSubscription: Subscription | undefined;
  
    constructor(
      private element: ElementRef,
      @Inject(DOCUMENT) private document: Document
    ) {}
  
    ngAfterViewInit(): void {
      this.documentClickSubscription = fromEvent(this.document, 'click')
        .pipe(
          filter((event) => {
            return !this.isInside(event.target as HTMLElement);
          })
        )
        .subscribe(() => {
          this.clickOutside.emit();
        });
    }
  
    ngOnDestroy(): void {
      this.documentClickSubscription?.unsubscribe();
    }
  
    isInside(elementToCheck: HTMLElement): boolean {
      return (
        elementToCheck === this.element.nativeElement ||
        this.element.nativeElement.contains(elementToCheck)
      );
    }
  }