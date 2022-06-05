import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Stock } from '../model/stock.model';
import { WatchList } from '../model/watchlist.model';
import { StockService } from '../service/stock-service.service';
import { WatchlistService } from '../service/watchlist-service.service';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.component.html',
  styleUrls: ['./dummy.component.scss']
})
export class DummyComponent implements OnInit {

  form: FormGroup;
  
  stock = {
    assignedWatchLists:[],
    name: 'label_3',
    numbers: [7, 8, 9],
    data:"ABC",
    checked:true,
    active:false,
    id:null
  };

  splice: boolean = false;

  stocks: Stock[];
  watchLists: WatchList[];
  currentActiveWatchListId: number;
  oldActiveWatchList : WatchList;

  constructor(private stockService: StockService, private watchListService: WatchlistService, private formBuilder: FormBuilder) { }
 
  title = 'infront-app';

  get selectedStocks() {
    return this.form.controls['selectedStocks'] as FormArray;
  }

  get selectedWatchLists() {
    return this.form.controls['selectedWatchLists'] as FormArray;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      selectedStocks: new FormArray([], minSelectedCheckboxes(1)),
      selectedWatchLists: new FormArray([]),
    });

    this.formBuilder.group({
      activeWatchListIde: ''
    })
    this.getWatchLists();
    this.getStocks();
    this.currentActiveWatchListId = 0;
  
  }

  private getStocks() {
    console.log('Inside Stocks Get');
    this.stockService.getStocks().subscribe(stocks => {
      console.log(stocks)
      this.stocks = stocks
      this.addCheckboxes(this.splice);
    });
  }

  private getStocksByActiveWatchListId(activeWatchListId?: number) {
    console.log('Inside Stocks Get');
    console.log(activeWatchListId)
    this.stockService.getStocks(activeWatchListId).subscribe(stocks => {
      console.log(stocks)
      this.stocks = stocks;
      this.splice = true;
      this.addCheckboxes(this.splice);
    });
  }

  private addCheckboxes(splice : boolean) {
    console.log(this.stocks);
    if (splice) {
      this.selectedStocks.clear();
    }
    this.stocks.forEach(stock =>
      this.selectedStocks.push(new FormControl(stock))
    );
  }

  private getWatchLists(activeWatchListId? : number) {
    this.watchListService.getWatchLists(activeWatchListId).subscribe(watchLists => {
      console.log(watchLists)
      this.watchLists = watchLists;
      this.watchLists.forEach(watchList => this.selectedWatchLists.push(new FormControl(watchList)));
    });
  }
  
  
 display = false;
update(){
   this.display = !this.display;
   this.edit=!this.edit;
}

delete(form : FormGroup){
  console.log(this.form.value);
  const filteredWatchList = this.form.value.selectedWatchLists.filter((obj: WatchList) => {
    return obj.active == true
  });
  this.watchListService.deleteWatchList(filteredWatchList[0].id);
  this.selectedWatchLists.removeAt(filteredWatchList[0].id - 1);
  this.stockService.getStocks().subscribe(stocks => {
    stocks.forEach(stock => {
        stock.assignedWatchLists.forEach((element, index) => {
          if (element == filteredWatchList[0].id) {
            stock.assignedWatchLists.splice(index, 1);
          }
        })
    })
    this.stocks = stocks;
    this.splice = true;
    this.addCheckboxes(this.splice);
  });
  this.display = !this.display;
  this.edit=!this.edit;
}


updateWatchList(form : FormGroup){
  console.log(this.form.value);
  
  this.display = !this.display;
  this.edit=!this.edit;
}
//edit save nd cancel toggle--start
edit=true;
cancel(){
  this.edit=!this.edit
  this.display = !this.display;
}


public async changeItemState(item: WatchList): Promise<void> {

  console.log('Change State');
  const activeId : number = item.id!;
  item.active = !item.active;
  this.watchListService.editWatchList(item);
  if(this.currentActiveWatchListId != null && this.currentActiveWatchListId != 0) {

    (await this.watchListService
    .getWatchListById(this.currentActiveWatchListId))
    .subscribe(watchList => this.oldActiveWatchList = watchList);
    
    console.log('Old Active Watch List');
    console.log(this.oldActiveWatchList);
    this.oldActiveWatchList.active=false;
    await this.watchListService.editWatchList(this.oldActiveWatchList);
  } 

  if (item.active) {
    this.currentActiveWatchListId = item.id!;
  this.getStocksByActiveWatchListId(activeId);
  }else {
    this.currentActiveWatchListId = 0;
    this.getStocks();
  }
}
values = ['Value_1', 'Value_2', 'Value_3'];
//item=[{clicked:true},{clicked:true}, {clicked:false}];

addProduct() {
  const data = {
    assignedWatchLists:this.stock.assignedWatchLists,
    name: this.stock.name,
    numbers: this.stock.numbers,
    data:this.stock.data,
    checked:this.stock.checked,
    active:this.stock.active,
  };
  this.stockService.createStock(data).subscribe(response => {
    console.log(response)
    this.getStocks();
  });
}

submit() {
  console.log('selected');
}


}

export function minSelectedCheckboxes(min = 1): ValidatorFn  {
  const validator : any = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      .map((control) => control.value)
      .reduce((prev, next) => (next ? prev + next : prev), 0);

    return totalSelected >= min ? null : { required: true };
  };

  return validator;
}

