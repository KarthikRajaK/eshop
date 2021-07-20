import { Component, OnInit } from '@angular/core';
import { CartService } from '@bluebits/orders';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'ngshop-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  constructor(private cartService: CartService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'success',
        detail: 'Cart added!'
      });
    });
  }

}
