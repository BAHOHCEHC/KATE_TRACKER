import { Injectable } from "@angular/core";
import { Position, OrderPosition } from "../shared/interfaces";
import { PositionsService } from "../shared/services/positions.service";

@Injectable()
export class OrderService {
  public list: OrderPosition[] = [];
  public price = 0;

  constructor(private positionsService: PositionsService) {}
  add(position: Position) {
    let localPosition: OrderPosition = Object.assign(
      {},
      {
        name: position.name,
        cost: position.cost,
        quantity: position.quantity,
        _id: position._id
      }
    );
    let candidate = this.list.find(p => p._id === localPosition._id);
    if (candidate) {
      candidate.quantity += localPosition.quantity;
    } else {
      this.list.push(localPosition);
    }
    this.computePrice();
  }
  private computePrice() {
    this.price = this.list.reduce((total, item) => {
      return (total += item.quantity * item.cost);
    }, 0);
  }

  remove(orderPosition: OrderPosition) {
    let indx = this.list.indexOf(orderPosition);
    if (indx > -1) {
      this.list.splice(indx, 1);
      this.computePrice();
    }
  }

  clear() {
    this.list = [];
    this.price = 0;
  }
}
