import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map, filter } from 'rxjs/operators';
import { Stock } from '../model/stock.model';
@Injectable({
  providedIn: 'root'
})
export class StockService {
  private productsUrl = 'api/stocks/';
  constructor(private http: HttpClient) { }

  getStocks(watchListId? : number): Observable<Stock[]> {


    if (watchListId != null) {
      return this.http.get<Stock[]>(this.productsUrl).pipe(
        map(items => items.filter(item => item.assignedWatchLists.includes(watchListId))),
        retry(2),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(() => error);
        })
      );
    }else {
    return this.http.get<Stock[]>(this.productsUrl).pipe(
      retry(2),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(() => error);
      })
    );
    }
  }

  createStock(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(this.productsUrl, stock).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(() => error);
      })
    )
  }

  editStock(product: Stock): Observable<any> {
    return this.http.put(this.productsUrl + product.id, product);
  }

  deleteStock(id: number): Observable<any> {
    return this.http.delete(this.productsUrl + id);
  }
}
