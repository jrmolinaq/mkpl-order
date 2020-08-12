import { Component, Input, OnInit } from '@angular/core';
import { HEADER_TABLE, MAX_REGISTER_PER_PAGE } from './constants/item-constants';
import { STATES } from './constants/states';
import { OrderContent } from './interfaces/order.interface';

declare const Liferay: any;

@Component({
  selector: 'order-item',
  templateUrl: 
    Liferay.ThemeDisplay.getPathContext() + 
    '/o/mkpl-order/app/item.component.html'
})
export class OrderItemComponent implements OnInit {
  configTable = HEADER_TABLE;
  @Input() data: OrderContent;
  @Input() withOutTimer: boolean;
  states = STATES;
  maxRegister = MAX_REGISTER_PER_PAGE;
  paginateStart = 0;
  paginateEnd = 5;
  totalItems: number;
  currentPage = 1;
  orders: any[] = [];

  ngOnInit() {
    this.orders = this.data.orders.sort((a, b) => a.id > b.id ? -1 : 1);
    this.totalItems = this.orders.length;
  }

  prevPage() {
    this.currentPage -= 1;
    this.paginateEnd = this.paginateStart;
    this.paginateStart = this.paginateStart - this.maxRegister >= this.maxRegister ? this.paginateStart - this.maxRegister : 0;
  }

  nextPage() {
    this.currentPage += 1;
    this.paginateStart = this.paginateEnd;
    this.paginateEnd = this.paginateEnd * this.currentPage > this.totalItems ? this.totalItems : this.paginateEnd * this.currentPage;
  }

  handleOrderDown(id: string) {
    this.orders = this.orders.sort((a, b) => {
      if (id === 'status') {
        return this.states[a[id]].text > this.states[b[id]].text ? -1 : 1;
      }
      return a[id] > b[id] ? -1 : 1;
    });
  }

  handleOrderUp(id: string) {
    this.orders = this.orders.sort((a, b) => {
      if (id === 'status') {
        return this.states[a[id]].text < this.states[b[id]].text ? -1 : 1;
      }
      return a[id] < b[id] ? -1 : 1;
    });
  }
}
