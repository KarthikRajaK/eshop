import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models';
import { ProductsService } from '../../services/products.service';
import { CartService, CartItem } from '@bluebits/orders';

@Component({
  selector: 'products-product-page',
  templateUrl: './product-page.component.html',
  styles: [
  ]
})
export class ProductPageComponent implements OnInit, OnDestroy {

  product: Product = {} as Product;
  endSubs$: Subject<any> = new Subject();
  currentProductId = '';
  quantity = 1;

  constructor(private productService: ProductsService, private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this._getParams();
  }

  private _getParams() {
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params) => {
      if(params.id) {
        this.currentProductId =params.id;
        this._getProductDetails();
      }
    });
  }

  private _getProductDetails() {
    this.productService.getProduct(this.currentProductId).pipe(takeUntil(this.endSubs$)).subscribe((product) => {
      this.product = product;
    })
  }

  originalPrice(price: any): number {
    return price + ((price *20) / 100);
  }

  addToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: this.quantity
    }
    this.cartService.setCartItem(cartItem);
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();    
  }

}
