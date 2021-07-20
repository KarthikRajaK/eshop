import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartItemDetailed } from '../../models';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: [
  ]
})
export class CartPageComponent implements OnInit, OnDestroy {

  endSubs$: Subject<any> = new Subject();
  cartItemsDetailed: CartItemDetailed[] = [];
  cartCount = 0;

  constructor(private router: Router, private cartService: CartService, private productService: OrdersService) { }

  ngOnInit(): void {
    this._getCartDetails();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _getCartDetails() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((cart) => {
      this.cartCount = cart?.items?.length ?? 0;
      this.cartItemsDetailed = [];
      cart.items?.forEach(cartItem => {
        if(cartItem.productId) {
          this.productService.getProduct(cartItem.productId).pipe(takeUntil(this.endSubs$)).subscribe((product) => {
            this.cartItemsDetailed.push({
              product,
              quantity: cartItem.quantity
            });
          });
        }
      });
    });
  }

  backToShop() {
    this.router.navigate(['/products']);
  }

  updateCartItem(event: any, cartItem: CartItemDetailed) {
    this.cartService.setCartItem({
      productId: cartItem.product?.id,
      quantity: event.value
    }, true);
  }

  deleteCartItem(cartItem: CartItemDetailed) {
    if(cartItem && cartItem.product && cartItem.product.id) {
      this.cartService.deleteCartItem(cartItem.product.id);
    }
  }

}
