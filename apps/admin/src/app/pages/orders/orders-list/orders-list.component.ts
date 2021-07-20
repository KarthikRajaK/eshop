import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService, Order, ORDER_STATUS } from '@bluebits/orders';
import {ConfirmationService, MessageService} from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent implements OnInit, OnDestroy {

  orders: Order[] = [];
  orderStatus: any = ORDER_STATUS;
  endSubs$: Subject<any> = new Subject();

  constructor(private orderService: OrdersService, private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this._getOrders();
  }

  deleteOrder(orderId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this order ?',
      header: 'Delete order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orderService.deleteOrder(orderId).pipe(takeUntil(this.endSubs$)).subscribe((response) => {
          if(response) {
            this.messageService.add({severity:'success', summary:'Success', detail:'Order deleted successfully!'});
            this._getOrders();
          }
        }, () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to delete order!'
          });
      });
      }
    });    
  }

  viewOrder(orderId: string) {
    this.router.navigateByUrl(`orders/${orderId}`);
  }

  private _getOrders() {
    this.orderService.getOrders().pipe(takeUntil(this.endSubs$)).subscribe((order) => {
      this.orders = order;
    });
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

}
