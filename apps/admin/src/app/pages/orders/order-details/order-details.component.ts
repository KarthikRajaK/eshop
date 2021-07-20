import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService, Order, ORDER_STATUS } from '@bluebits/orders';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-order-details',
  templateUrl: './order-details.component.html',
  styles: [
  ]
})
export class OrderDetailsComponent implements OnInit, OnDestroy {

  currentOrderId = '';
  selectedStatus = '';
  orderStatus: any = ORDER_STATUS;
  orderDetails: Order = {} as Order;
  orderStatuses: any[] = [];
  endSubs$: Subject<any> = new Subject();

  constructor(private orderService: OrdersService, private messageService: MessageService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrderDetails();
  }

  private _mapOrderStatus() {
    this.orderStatuses = Object.keys(this.orderStatus).map((key) => {
      return {
        id: key,
        name: this.orderStatus[key].label
      }
    });
  }

  private _getOrderDetails() {
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params) => {
      if(params.id) {
        this.currentOrderId = params.id;
        this.orderService.getOrder(params.id).pipe(takeUntil(this.endSubs$)).subscribe((order) => {
          if(order) {
            this.orderDetails = order;
            this.selectedStatus = order.status as string;
          }
        });
      }
    });
  }

  calculatePrice(quantity?: number, price?: number) {
    if(quantity && price) {
      return quantity * price;
    }
    return 0;
  }

  onStatusChange(event: any) {
    this.orderService.updateOrder({status: event.value}, this.currentOrderId).pipe(takeUntil(this.endSubs$)).subscribe((order) => {
      this.messageService.add({severity:'success', summary:'Success', detail:'Order updated successfully!'});
    }, () => {
      this.messageService.add({severity:'error', summary:'Error', detail:'Order update failed!'});
    })
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

}
