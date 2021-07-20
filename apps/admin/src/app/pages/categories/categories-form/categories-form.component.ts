import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [
  ]
})
export class CategoriesFormComponent implements OnInit, OnDestroy {

  form: FormGroup = {} as FormGroup;
  isSubmitted = false;
  editMode = false;
  currentCategoryId = '';
  endSubs$: Subject<any> = new Subject();

  constructor(private formBuilder: FormBuilder, private categoryService: CategoriesService, private messageService: MessageService, private location: Location, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#fff'],
    });
    this._checkEditMode();
  }

  get categoryForm() {
    return this.form.controls;
  }

  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if(params.id) {
        this.editMode = true;
        this.currentCategoryId = params.id;
        this.categoryService.getCategory(params.id).pipe(takeUntil(this.endSubs$)).subscribe((category) => {
          if(category) {
            this.categoryForm.name.setValue(category.name);
            this.categoryForm.icon.setValue(category.icon);
            this.categoryForm.color.setValue(category.color);
          }
        })
      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.form.invalid) {
      return;
    }
    const category: Category =  {
      name: this.categoryForm.name.value,
      icon: this.categoryForm.icon.value,
      color: this.categoryForm.color.value
    }
    if(this.editMode) {
      this._updateCategory(category);
    } else {
      this._addCategory(category);
    }
  } 

  private _addCategory(category: Category) {
    this.categoryService.createCategory(category).pipe(takeUntil(this.endSubs$)).subscribe((response) => {
      if(response) {
        this.messageService.add({severity:'success', summary:'Success', detail:'Category created successfully!'});
        timer(2000).toPromise().then(done => {
          this.location.back();
        });
      }
    }, (error) => {
      this.messageService.add({severity:'error', summary:'Error', detail:error});
    });
  }

  private _updateCategory(category: Category) {
    this.categoryService.updateCategory(category, this.currentCategoryId).pipe(takeUntil(this.endSubs$)).subscribe((response) => {
      if(response) {
        this.messageService.add({severity:'success', summary:'Success', detail:'Category updated successfully!'});
        timer(2000).toPromise().then(done => {
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
 