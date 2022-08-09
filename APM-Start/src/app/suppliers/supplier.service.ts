import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError, Observable, of, map, tap, concatMap, mergeMap, switchMap, shareReplay, catchError } from 'rxjs';
import { Supplier } from './supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';
  suppliers$ = this.http.get<Supplier[]>(this.suppliersUrl).pipe(
    tap((data) => console.log('Suppliers: ', JSON.stringify(data))),
    shareReplay(1),
    catchError(this.handleError)
  );

  suppliersWithMap$ = of(1,5,8).pipe(
    map(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)),
  );

  suppliersWithConcatMap$ = of(1,5,8).pipe(
    tap(id => console.log('concatMap source', id)),
    concatMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)),
  );
  suppliersWithMergeMap$ = of(1,5,8).pipe(
    tap(id => console.log('mergeMap source', id)),
    mergeMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)),
  );
  suppliersWithSwitchMap$ = of(1,5,8).pipe(
    tap(id => console.log('switchMap source', id)),
    switchMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)),
  );

  constructor(private http: HttpClient) { 
    // this.suppliersWithConcatMap$.subscribe(
    //   supplier => console.log('concatMap result', supplier),
    // );
    // this.suppliersWithMergeMap$.subscribe(
    //   supplier => console.log('mergeMap result', supplier),
    // );
    // this.suppliersWithSwitchMap$.subscribe(
    //   supplier => console.log('switchMap result', supplier),
    // );

    // this.suppliersWithMap$.subscribe( o => o.subscribe(
    //   item => console.log('map result', item))
    // );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

}
