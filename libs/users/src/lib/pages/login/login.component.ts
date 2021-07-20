import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup = {} as FormGroup;
  isSubmitted = false;
  authError = false;
  authMessage = 'Invalid email or password!';
  endSubs$: Subject<any> = new Subject();

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private localService: LocalstorageService, private router: Router) { }

  ngOnInit(): void {
    this._initLoginForm();
  }

  private _initLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get login() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.loginForm.invalid) {
      return;
    }
    this.auth.login(this.login.email.value, this.login.password.value).pipe(takeUntil(this.endSubs$)).subscribe((user) => {
      if(user) {
        this.authError = false;
        this.localService.setToken(user.token as string);
        this.router.navigate(['/']);
      }      
    }, (error: HttpErrorResponse) => {
      this.authError = true;
      if(error.status != 400) {
        this.authMessage = 'Server error! pls try again!';
      }
    });
  }
  
  ngOnDestroy(): void {
      this.endSubs$.next();
      this.endSubs$.complete();
  }

}
