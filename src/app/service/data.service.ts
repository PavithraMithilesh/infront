import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  createDb() {
    
    const stocks= [
      {
        id: 1,
        assignedWatchLists:[1,2,3],
        name: 'label_5',
        numbers: [1, 2, 3],
        data:"ABC",
        checked:true,
        active:true,
    
      },
      {
        id: 2,
        assignedWatchLists:[2,3],
        name: 'label_2',
        numbers: [4, 5, 6],
        data:"ABC",
        checked:false,
        active:false,
      },
      {
        id: 3,
        assignedWatchLists:[1,3],
        name: 'label_3',
        numbers: [7, 8, 9],
        data:"ABC",
        checked:true,
        active:false,
      }
    ];
  
    const watchlists= [
      {
        id: 1,
        watchlistname:"Watchlist1",
        active:false,
    
      },
      {
        id: 2,
        watchlistname:"Watchlist2",
        active:false,
    
      },
      {
        id: 3,
        watchlistname:"Watchlist3",
        active:false,
    
      },
    ];

    return {stocks, watchlists};
}
}
