import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@bluebits/users';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Cart, Order } from '../../models';
import { OrderItem } from '../../models/order-item';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrdersService
  ) {}
  endSubs$: Subject<any> = new Subject();
  checkoutFormGroup: FormGroup = {} as FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  userId = '60ece05d109f583fe036b95c';
  countries: any[] = [];

  ngOnInit(): void {
    this._initCheckoutForm();
    this._getCartItems();
    this._getCountries();
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      apartment: ['', Validators.required],
      street: ['', Validators.required]
    });
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  private _getCartItems() {
    const cart: Cart = this.cartService.getCart();
    const tempOrder: any = cart.items?.map(item => {
      return {
        product: item.productId,
        quantity: item.quantity
      }
    });
    this.orderItems = tempOrder;
    console.log(this.orderItems);
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }

  placeOrder() {
    this.isSubmitted = true;
    if (this.checkoutFormGroup.invalid) {
      return;
    }

    const order: Order = {
      orderItems: this.orderItems,
      shippingAddress1: this.checkoutForm.street.value,
      shippingAddress2: this.checkoutForm.apartment.value,
      city: this.checkoutForm.city.value,
      zip: this.checkoutForm.zip.value,
      country: this.checkoutForm.country.value,
      phone: this.checkoutForm.phone.value,
      status: 0,
      user: this.userId,
      dateOrdered: `${Date.now()}`
    }
    this.orderService.createOrder(order).pipe(takeUntil(this.endSubs$)).subscribe(() => {
      this.cartService.emptyCart();
      this.router.navigate(['/success']);
    }, () => {

    });
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();    
  }
}