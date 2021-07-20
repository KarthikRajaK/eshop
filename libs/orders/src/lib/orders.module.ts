import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {BadgeModule} from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputMaskModule} from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { CartService } from './services/cart.service';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';

export const ordersRoutes: Route[] = [
  { path: 'cart',  component: CartPageComponent},
  { path: 'checkout', component: CheckoutPageComponent},
  { path: 'success', component: ThankYouComponent }
];

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ordersRoutes), 
    BadgeModule,
    InputTextModule,
    InputNumberModule, 
    InputMaskModule,
    ButtonModule,
    DropdownModule
  ],
  declarations: [
    CartIconComponent,
    CartPageComponent,
    OrderSummaryComponent,
    CheckoutPageComponent,
    ThankYouComponent
  ],
  exports: [
    CartIconComponent,
    CartPageComponent,
    OrderSummaryComponent,
    CheckoutPageComponent,
    ThankYouComponent
  ]
})
export class OrdersModule {
  constructor(cartService: CartService) {
    cartService.initCart();
  }
}
