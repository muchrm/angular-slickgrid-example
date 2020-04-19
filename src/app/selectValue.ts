import { Aggregator } from 'angular-slickgrid';


export class SelectGroupAggregator implements Aggregator {
  private _result: number;
  private _level:number;

  constructor(level:number) {
    this._level = level;
  }

  init(): void {
    this._result = null;
  }

  accumulate(item) {
    if(item.isGroupKey && this._level == item.level){
      this._result = item;
    }
  }

  storeResult(groupTotals) {
    if (!groupTotals.group) {
      groupTotals.group = {};
    }
    groupTotals.group = this._result;
  }
}
