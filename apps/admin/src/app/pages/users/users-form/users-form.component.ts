import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService, User } from '@bluebits/users';
import { MessageService } from 'primeng/api';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-users-form',
  templateUrl: './users-form.component.html',
  styles: [
  ]
})
export class UsersFormComponent implements OnInit, OnDestroy {

  form: FormGroup = {} as FormGroup;
  isSubmitted = false;
  editMode = false;
  currentUserId = '';
  countries: any[] = [];
  endSubs$: Subject<any> = new Subject();

  constructor(private formBuilder: FormBuilder,private userService: UsersService,  private messageService: MessageService, private location: Location, private route: ActivatedRoute) { }

  ngOnInit(): void {    
    this._initForm();
    this._getCountries();
    this._checkEditMode();
  }

  private _getCountries() {
    this.countries = this.userService.getCountries();
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      country: [''],
      isAdmin: [false]
    });
  }

  get userForm() {
    return this.form.controls;
  }

  private _checkEditMode() {
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params) => {
      if(params.id) {
        this.editMode = true;
        this.currentUserId = params.id;
        this.userService.getUser(params.id).pipe(takeUntil(this.endSubs$)).subscribe((user) => {
          if(user) {
            this.userForm.name.setValue(user.name);
            this.userForm.email.setValue(user.email);
            this.userForm.phone.setValue(user.phone);
            this.userForm.isAdmin.setValue(user.isAdmin);
            this.userForm.street.setValue(user.street);
            this.userForm.apartment.setValue(user.apartment);
            this.userForm.zip.setValue(user.zip);
            this.userForm.city.setValue(user.city);
            this.userForm.country.setValue(user.country);
            this.userForm.password.setValidators([]);
            this.userForm.password.updateValueAndValidity();
          }
        });
      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.form.invalid) {
      return;
    }
    const user: User = {
      id: this.currentUserId,
      name: this.userForm.name.value,
      email: this.userForm.email.value,
      phone: this.userForm.phone.value,
      isAdmin: this.userForm.isAdmin.value,
      street: this.userForm.street.value,
      apartment: this.userForm.apartment.value,
      zip: this.userForm.zip.value,
      city: this.userForm.city.value,
      country: this.userForm.country.value
    }
    if(this.editMode) {
      this._updateUser(user);
    } else {
      this._addUser(user);
    }
  } 

  private _addUser(user: User) {
    this.userService.createUser(user).pipe(takeUntil(this.endSubs$)).subscribe((response) => {
      if(response) {
        this.messageService.add({severity:'success', summary:'Success', detail:'Product created successfully!'});
        timer(1000).toPromise().then(done => {
          this.location.back();
        });
      }
    }, (error) => {
      this.messageService.add({severity:'error', summary:'Error', detail:error});
    });
  }

  private _updateUser(user: User) {
    this.userService.updateUser(user, this.currentUserId).pipe(takeUntil(this.endSubs$)).subscribe((response) => {
      if(response) {
        this.messageService.add({severity:'success', summary:'Success', detail:'Product updated successfully!'});
        timer(1000).toPromise().then(done => {
          this.location.back();
        });
      }
    }, (error) => {
      this.messageService.add({severity:'error', summary:'Error', detail:error});
    });
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

}
