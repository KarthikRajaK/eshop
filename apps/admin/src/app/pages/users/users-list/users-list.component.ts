import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UsersService } from '@bluebits/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  endSubs$: Subject<any> = new Subject();

  constructor(private userService: UsersService,private usersService: UsersService, private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this._getUsers();
  }

  private _getUsers() {
    this.userService.getUsers().pipe(takeUntil(this.endSubs$)).subscribe((user) => {
      this.users = user;
    });
  }

  deleteUser(UserId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this user ?',
      header: 'Delete user',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(UserId).pipe(takeUntil(this.endSubs$)).subscribe((response) => {
          if(response) {
            this.messageService.add({severity:'success', summary:'Success', detail:'User deleted successfully!'});
            this._getUsers();
          }
        }, () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to delete user!'
            });
        });
      }
    });
  }

  getCountryName(countryKey: string) {
    return this.usersService.getCountry(countryKey);
  }

  updateUser(userId: string) {
    this.router.navigateByUrl(`users/form/${userId}`);
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

}
