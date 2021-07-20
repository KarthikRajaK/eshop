import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-featured-product',
  templateUrl: './featured-product.component.html',
  styles: [
  ]
})
export class FeaturedProductComponent implements OnInit, OnDestroy {

  featuredProducts: Product[] = [];
  endSubs$: Subject<any> = new Subject();

  constructor(private productService: ProductsService) { }

  ngOnInit(): void {
    this._getFeaturedProducts();
  }

  private _getFeaturedProducts() {
    this.productService.getFeaturedProducts(4).pipe(takeUntil(this.endSubs$)).subscribe((products) => {
      this.featuredProducts = products;
    });
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

}
