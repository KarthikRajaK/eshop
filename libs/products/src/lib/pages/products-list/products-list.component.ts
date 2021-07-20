import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category, Product } from '../../models';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  categories: Category[] = [];
  currentCategoryId = '';
  endSubs$: Subject<any> = new Subject();

  constructor(private productService: ProductsService, private categoryService: CategoriesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._checkFilter();
    this._getCategories();
  }

  private _checkFilter() {
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params) => {
      this.currentCategoryId = params.id;
      this.currentCategoryId ? this._getProducts([this.currentCategoryId]) : this._getProducts();
    });
  }

  private _getProducts(categoriesFilter?: string[]) {
    this.productService.getProducts(categoriesFilter).pipe(takeUntil(this.endSubs$)).subscribe((products) => {
      this.products = products;
    });
  }

  private _getCategories() {
    this.categoryService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe((categories) => {
      this.categories = categories;
      if(this.currentCategoryId) {
        this.categories.map((category) => {
          category.id == this.currentCategoryId ? category['checked'] = true : category['checked'] = false;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  categoryFilter() {
    const selectedCategories: string[] = this.categories.filter((category) => category.checked).map(category => category.id) as string[];
    this._getProducts(selectedCategories);
  }

}
