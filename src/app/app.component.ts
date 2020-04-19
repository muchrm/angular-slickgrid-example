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
        id: 'sel', name: '#', field: 'num', width: 40,
        excludeFromExport: true,
        maxWidth: 70,
        resizable: true,
        filterable: true,
        selectable: false,
        focusable: false
      },
      {
        id: 'title', name: 'Title', field: 'title',
        width: 50,
        minWidth: 50,
        cssClass: 'cell-title',
        filterable: true,
        sortable: true
      },
      {
        id: 'duration', name: 'Duration', field: 'duration',
        minWidth: 50, width: 60,
        filterable: true,
        filter: { model: Filters.slider, operator: '>=' },
        sortable: true,
        type: FieldType.number,
        groupTotalsFormatter: GroupTotalFormatters.sumTotals,
        params: { groupFormatterPrefix: 'Totalx: ' }
      },
      {
        id: '%', name: '% Complete', field: 'percentComplete',
        minWidth: 70, width: 90,
        formatter: Formatters.percentCompleteBar,
        filterable: true,
        filter: { model: Filters.compoundSlider },
        sortable: true,
        type: FieldType.number,
        // groupTotalsFormatter: GroupTotalFormatters.avgTotalsPercentage,
        // params: { groupFormatterPrefix: '<i>Avg</i>: ' }
      },
      {
        id: 'start', name: 'Start', field: 'start',
        minWidth: 60,
        filterable: true,
        filter: { model: Filters.compoundDate },
        sortable: true,
        type: FieldType.dateIso,
        formatter: Formatters.dateIso,
        exportWithFormatter: true
      },
      {
        id: 'finish', name: 'Finish', field: 'finish',
        minWidth: 60,
        filterable: true,
        filter: { model: Filters.compoundDate },
        sortable: true,
        type: FieldType.dateIso,
        formatter: Formatters.dateIso,
        exportWithFormatter: true
      },
      {
        id: 'cost', name: 'Cost', field: 'cost',
        minWidth: 70,
        width: 100,
        filterable: true,
        filter: { model: Filters.compoundInputNumber },
        type: FieldType.number,
        sortable: true,
        exportWithFormatter: true,
        formatter: Formatters.dollar,
        // groupTotalsFormatter: GroupTotalFormatters.sumTotalsDollar,
        // params: { groupFormatterPrefix: '<b>Total</b>: ' /*, groupFormatterSuffix: ' USD'*/ }
      },
      {
        id: 'effort-driven', name: 'Effort Driven',
        minWidth: 20, width: 80, maxWidth: 80,
        cssClass: 'cell-effort-driven',
        field: 'effortDriven',
        formatter: Formatters.checkmark,
        sortable: true,
        filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect,
        }
      }
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 10
      },
      enableExcelExport: true,
      enableFiltering: true,
      enableGrouping: true,
      exportOptions: {
        sanitizeDataExport: true
      },
      excelExportOptions: {
        sanitizeDataExport: true
      },
      gridMenu: {
        hideExportTextDelimitedCommand: false
      }
    };


    this.loadData(100);
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataviewObj = angularGrid.dataView;
    this.dataviewObj.setGrouping([
      {
        getter: 'duration',
        formatter: (g) => {
          // console.log(g);
          return `Duration: ${g.value}  <span style="color:green">(${g.count} items)</span>`;
        } ,
        aggregators: [
          new SelectGroupAggregator(0),
        ],
        collapsed: true,
      },
      {
        getter: 'effortDriven',
        formatter: (g) => `Effort-Driven: ${(g.value ? 'True' : 'False')} <span style="color:green">(${g.count} items) ${g.totals.group.title}</span> `,
        aggregators: [
          new SelectGroupAggregator(1),
        ],
        collapsed: true,
      }
    ] as Grouping[]);
    this.angularGrid.dataView.onGroupExpanded.subscribe(console.log);
    this.angularGrid.dataView.onGroupCollapsed.subscribe(console.log);
  }

  loadData(rowCount: number) {
    // mock a dataset
    this.dataset = [];
    for (let i = 0; i < rowCount; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      this.dataset[i] = {
        id: 'id_' + i,
        num: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        cost: (i % 33 === 0) ? null : Math.round(Math.random() * 10000) / 100,
        effortDriven: (i % 5 === 0),
        isGroupKey:true,
        level:1,
      };
    }
  }
}
