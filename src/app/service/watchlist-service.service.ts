import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

import { WatchList } from '../model/watchlist.model';


@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  private watchlistsUrl = 'api/watchlists/';
  constructor(private http: HttpClient) { }

  getWatchLists(activeWatchListId?: number): Observable<WatchList[]> {
    return this.http.get<WatchList[]>(this.watchlistsUrl).pipe(
      retry(2),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  async getWatchListById(activeWatchListId?: number): Promise<Observable<WatchList>>{
      return this.http.get<WatchList>(this.watchlistsUrl + activeWatchListId);
  }

  createWatchList(watchlist: WatchList): Observable<string> {
    return this.http.post<string>(this.watchlistsUrl, watchlist).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(() => error);
      })
    )
  }

  async editWatchList(watchlist: WatchList): Promise<Observable<any>> {
    console.log(watchlist);
    return this.http.put(this.watchlistsUrl + watchlist.id, watchlist);
  }


  deleteWatchList(id: number): Observable<any> {
    console.log(id);
    return this.http.delete(this.watchlistsUrl + id);
  }
}
