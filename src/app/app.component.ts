import { Component } from '@angular/core';
import { GridOption, Column, AngularGridInstance, Filters, FieldType, GroupTotalFormatters, Formatters, FileType, DelimiterType, Aggregators, Sorters, SortDirectionNumber, Grouping } from 'angular-slickgrid';
import { SelectGroupAggregator } from './selectValue';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Example 14: Grouping';
  subTitle = `
  (<a href="https://github.com/ghiscoding/Angular-Slickgrid/wiki/Grouping-&-Aggregators" target="_blank">Wiki docs</a>)
  <ul>
    <li>
    Fully dynamic and interactive multi-level grouping with filtering and aggregates over 50'000 items
    </li>
    <li>Each grouping level can have its own aggregates (over child rows, child groups, or all descendant rows)..</li>
  </ul>
  `;

  angularGrid: AngularGridInstance;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  gridObj: any;
  dataviewObj: any;
  processing = false;

  constructor() { }

  ngOnInit(): void {
    this.columnDefinitions = [
      {
        id: 'id', name: 'Id', field: 'id',
        minWidth: 50, width: 60,
      },
      {
        id: 'group', name: 'group', field: 'group',
        minWidth: 50, width: 60,
        type: FieldType.number,
        groupTotalsFormatter: (totals, columnDef) => {
          return 'totalX: ddkdkdkd'
        }
      },
      {
        id: 'gender', name: 'gender', field: 'gender',
        minWidth: 50, width: 60,
        type: FieldType.number,
        groupTotalsFormatter: (totals, columnDef) => {
          return 'totalY: ddkdkdkd'
        }
      },
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 10
      },
      enableGrouping: true,
    };


    this.loadData(100);
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataviewObj = angularGrid.dataView;
    this.dataviewObj.setGrouping([
      {
        getter: 'group',
        formatter: (g) => {
          // console.log(g);
          return `group: ${g.value}  <span style="color:green">(${g.count} items)</span>`;
        } ,
        aggregators: [
          new SelectGroupAggregator(0),
        ],
        collapsed: true,
      },
      {
        getter: 'gender',
        formatter: (g) => `gender: ${(g.value ? 'True' : 'False')} <span style="color:green">(${g.count} items) ${g.totals.group ? g.totals.group.title:''}</span> `,
        aggregators: [
          new SelectGroupAggregator(1),
        ],
        collapsed: true,
      }
    ] as Grouping[]);
    this.angularGrid.dataView.onGroupExpanded.subscribe((e,args)=> {
      this.angularGrid.dataView
      console.log(args)
      this.dataset.push(
        {
          "name": "Ethel Price",
          "gender": 2,
          "company": "Enersol",
          "id": this.dataset.length,
          "group": 1
        },
      )
    });
    this.angularGrid.dataView.onGroupCollapsed.subscribe(console.log);
  }

  loadData(rowCount: number) {
    // mock a dataset
    this.dataset = [
      {
        "name": "Ethel Price",
        "gender": 2,
        "company": "Enersol",
        "id": 1,
        "group": 1
      },
      {
        "name": "Claudine Neal",
        "gender": 1,
        "company": "Sealoud",
        "id": 2,
        "group": 2
      },
      {
        "name": "Beryl Rice",
        "gender": 2,
        "company": "Velity",
        "id": 3,
        "group": 3
      },
      {
        "name": "Wilder Gonzales",
        "gender": 1,
        "company": "Geekko",
        "id": 4,
        "group": 4
      },
    ];
  }

  setFormat(c) {
    return c;
  }
}
