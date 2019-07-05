import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { MaterialInstance } from "../shared/classes/material.service";
import { MaterialService } from "src/app/shared/classes/material.service";
import { OdersService } from "../shared/services/orders.service";
import { Subscription } from "rxjs";
import { Order, Filter } from "../shared/interfaces";

const STEP = 2;

@Component({
  selector: "app-history-page",
  templateUrl: "./history-page.component.html",
  styleUrls: ["./history-page.component.css"]
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("tooltip") tooltipRef: ElementRef;
  tooltip: MaterialInstance;
  isFilterVisible = false;
  offset = 0;
  limit = STEP;
  oSub: Subscription;
  orders: Order[] = [];
  loading = false;
  reloading = false;
  noMoreOrders = false;
  filter: Filter = Object.assign({});

  constructor(private odersService: OdersService) {}

  private fetch() {
    let params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    });
    this.oSub = this.odersService.fetch(params).subscribe(orders => {
      this.orders = this.orders.concat(orders);
      this.noMoreOrders = orders.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }
  ngOnInit() {
    this.reloading = true;
    this.fetch();
  }
  isFilered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }
  ngOnDestroy() {
    this.oSub.unsubscribe();
    if (this.tooltip) {
      this.tooltip.destroy();
    }
  }
  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }
  loadMore() {
    this.loading = true;
    this.offset += STEP;
    this.fetch();
  }
  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.filter = Object.assign({});
    this.reloading = true;
    this.fetch();
  }
}
