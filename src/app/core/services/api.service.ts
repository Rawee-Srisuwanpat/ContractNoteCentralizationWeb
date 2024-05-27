import { Injectable } from '@angular/core';
import { Hero } from '../model/hero';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,of} from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';
import { ApiUrl } from './api-url.service';



@Injectable({
  providedIn: 'root',
})
export class ApiService {

    hero: Hero = {
        id: 1,
        name: 'Windstorm'
      };

      //private heroesUrl = 'https://localhost:7118/api/Values';  // URL to web api

      

      heroList : Hero []

  constructor(private http: HttpClient ,private url : ApiUrl) { }

  getHeroData() : Observable<Hero[]> {
    this.heroList.push(this.hero)
    this.heroList.push(this.hero)
    this.heroList.push(this.hero)

    const heros = of(this.heroList)

    return heros

  }

  getHeroDataFromURL() : Observable<Hero[]> {
    
    return this.http.get<Hero[]>(this.url.heroesUrl)
    .pipe(
      tap(_ => console.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    )

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}