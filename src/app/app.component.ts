import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { OrderService } from './services/order.service';
import { TAB_FILTERS, EMPTY_ORDERS } from './constants/order-constants';
import { OrderPaginator, OrderContent } from './interfaces/order.interface';

declare const Liferay: any;

@Component({
	templateUrl: 
		Liferay.ThemeDisplay.getPathContext() + 
		'/o/mkpl-order/app/app.component.html'
})
export class AppComponent implements OnInit{
	emptyOrders = EMPTY_ORDERS;
	tabFilters = TAB_FILTERS;
	$orders: Observable<OrderPaginator>;
	subsidiaryId: number;
	tapId: string;
  
	constructor(private orderService: OrderService) { }
  
	ngOnInit() {
	  // TODO conseguir el subsidiaryId
	  this.subsidiaryId = 5;
	  this.getOrders();
	}
  
	getOrders(page = 0, status = 'all') {
	  this.$orders = this.orderService.getOrders({ page, status, subsidiaryId: this.subsidiaryId });
	}
  
	currentPageChange(page: number) {
	  this.getOrders(page, this.tapId);
	}
  
	changeFilter(value: string) {
	  this.tapId = value;
	  this.tabFilters = this.tabFilters.map(radio => ({
		...radio,
		checked:  radio.id === value
	  }));
	  this.getOrders(0, value);
	}
}
