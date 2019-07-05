import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import {
  MaterialService,
  MaterialInstance
} from "src/app/shared/classes/material.service";
import { OrderService } from "./order.service";
import { OrderPosition, Order } from "../shared/interfaces";
import { OdersService } from "../shared/services/orders.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-order-page",
  templateUrl: "./order-page.component.html",
  styleUrls: ["./order-page.component.css"],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("modal") modalRef: ElementRef;
  isRoot: boolean;
  modal: MaterialInstance;
  panding = false;
  oSub: Subscription;
  constructor(
    private router: Router,
    private order: OrderService,
    private ordersService: OdersService
  ) {}

  ngOnInit() {
    this.isRoot = this.router.url === "/order";
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === "/order";
      }
    });
  }
  ngOnDestroy() {
    this.modal.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }
  onEnd() {
    this.modal.open();
  }
  cancel() {
    this.modal.close();
  }
  submit() {
    this.panding = true;
    this.modal.close();
    let order: Order = {
      list: this.order.list.map(item => {
        delete item._id;
        return item;
      })
    };
    this.oSub = this.ordersService.create(order).subscribe(
      newOrder => {
        MaterialService.toast(`Заказ #${newOrder.order} был добавлен`);
        this.order.clear();
      },
      error => {
        MaterialService.toast(error.error.message);
      },
      () => {
        this.panding = false;
        this.modal.close();
      }
    );
  }
  removePosition(orderPosition: OrderPosition):void {
    this.order.remove(orderPosition);
  }
}
