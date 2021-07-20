import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Cart } from '../models';

export const CART_KEY = 'cart'

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart()); 

  // constructor() { }

  initCart() {
    const cart: Cart = this.getCart();
    if(!cart) {
      const initialCart = {
        items: []
      }
      localStorage.setItem(CART_KEY, JSON.stringify(initialCart));
    }
  }

  getCart(): Cart {
    const cart: Cart = JSON.parse(localStorage.getItem(CART_KEY) as string);
    return cart;
  }

  emptyCart() {
    const initialCart = {
      items: []
    }
    localStorage.setItem(CART_KEY, JSON.stringify(initialCart));
    this.cart$.next(initialCart);
  }

  setCartItem(cartItem: CartItem, updateCart?: boolean): Cart {
    const cart: Cart = this.getCart();
    const isItemExist = cart.items?.find((item) => item.productId === cartItem.productId);
    if(isItemExist) {
      cart.items?.map(item => {
        if(item.productId === cartItem.productId && item.quantity && cartItem.quantity) {
          item.quantity = updateCart ? cartItem.quantity : item.quantity + cartItem.quantity;
        }
      })
    } else {
      cart.items?.push(cartItem);
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    this.cart$.next(cart);
    return cart;
  }

  deleteCartItem(productId: string) {
    const cart: Cart = this.getCart();
    const newCart = cart.items?.filter(item => item.productId !== productId);
    cart.items = newCart;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    this.cart$.next(cart);
  }
}
