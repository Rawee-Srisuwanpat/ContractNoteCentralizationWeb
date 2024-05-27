import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from '../../shared/directive/Sortable.directive';

@Injectable({
    providedIn: 'root'
})

export class NgTableService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _data$ = new BehaviorSubject<any[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _staticData$ = new BehaviorSubject<any[]>([]);
  compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(100),
      switchMap(() => this._search()),
      delay(100),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._data$.next(result.sources);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get data$() { return this._data$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  //get staticData$() {return this._staticData$.asObservable();}

  set setdata$(source: any) { this._data$.next(source);}
  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  set setstaticData$(source: any) {this._staticData$.next(source);}

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    // 1. sort
    let objectsKey = Object.keys(this._staticData$?.value?.[0] || {}).map(d => {
      return {
        key: d,
        type: typeof (this._staticData$?.value?.[0][d])
      }
    }) || []
    let sources = this.sort(this._staticData$.value, sortColumn, sortDirection);

    // 2. filter
    sources = sources.filter(data => this.matches(data, searchTerm, this.pipe, objectsKey));
    const total = sources.length;

    // 3. paginate
    sources = sources.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({sources, total});  
  }

  matches(source: any, term: string, pipe: PipeTransform, objectsKey: any) {
    // return country.name.toLowerCase().includes(term.toLowerCase())
    //   || pipe.transform(country.area).includes(term)
    //   || pipe.transform(country.population).includes(term);
      //return pipe.transform(source[term])?.includes(term) || source
      return objectsKey.find(d => {
        return d.type == 'number' ? pipe.transform(source[d.key])?.includes(term)
         : source[d.key]?.toString()?.toLowerCase()?.includes(term?.toLowerCase())
      })
  }

  sort(datasource: any, column: any, direction: string): any[] {
    if (direction === '' || column === '') {
      return datasource;
    } else {
      return [...datasource].sort((a, b) => {
        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}

interface SearchResult {
  sources: any[];
   total: number;
}
  
interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}
  
  
