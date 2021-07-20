import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@bluebits/products';
import {ConfirmationService, MessageService} from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [
  ]
})
export class CategoriesListComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  endSubs$: Subject<any> = new Subject();

  constructor(private categoryService: CategoriesService, private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this._getCategories();    
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this category ?',
      header: 'Delete category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryService.deleteCategory(categoryId).pipe(takeUntil(this.endSubs$)).subscribe((response) => {
          if(response) {
            this.messageService.add({severity:'success', summary:'Success', detail:'Category deleted successfully!'});
            this._getCategories();
          }
        }, () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to delete category!'
          });
      });
      }
    });
  }

  updateCategory(categoryId: string) {
    this.router.navigateByUrl(`categories/form/${categoryId}`);
  }

  private _getCategories() {
    this.categoryService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe((cats) => {
      this.categories = cats;
    });
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

}
