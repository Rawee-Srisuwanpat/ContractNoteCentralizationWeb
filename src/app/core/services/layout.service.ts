import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  visibilityNav = new BehaviorSubject<any>(false);

  constructor() {}

}
