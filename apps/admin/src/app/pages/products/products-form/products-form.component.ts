import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductsService, CategoriesService, Category } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit, OnDestroy {

  form: FormGroup = {} as FormGroup;
  isSubmitted = false;
  editMode = false;
  currentProductId = '';
  categories: Category[] = []
  imageDisplay: string | ArrayBuffer | null = '';
  endSubs$: Subject<any> = new Subject();

  constructor(private formBuilder: FormBuilder,private categoryService: CategoriesService, private productService: ProductsService, private messageService: MessageService, private location: Location, private route: ActivatedRoute) { }

  ngOnInit(): void {    
    this._initForm();
    this._getCategories();
    this._checkEditMode();
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false]
    });
  }

  get productForm() {
    return this.form.controls;
  }

  private _checkEditMode() {
    this.route.params.pipe(takeUntil(this.endSubs$)).subscribe((params) => {
      if(params.id) {
        this.editMode = true;
        this.currentProductId = params.id;
        this.productService.getProduct(params.id).pipe(takeUntil(this.endSubs$)).subscribe((product) => {
          if(product) {
            this.productForm.name.setValue(product.name);
            this.productForm.brand.setValue(product.brand);
            this.productForm.price.setValue(product.price);
            this.productForm.category.setValue(product.category?.id);
            this.productForm.countInStock.setValue(product.countInStock);
            this.productForm.description.setValue(product.description);
            this.productForm.richDescription.setValue(product.richDescription);
            this.productForm.isFeatured.setValue(product.isFeatured);
            this.imageDisplay = product.image as string | ArrayBuffer | null;
            this.productForm.image.setValidators([]);
            this.productForm.image.updateValueAndValidity();
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
    const productFormData = new FormData();
    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);
    });
    if(this.editMode) {
      this._updateProduct(productFormData);
    } else {
      this._addProduct(productFormData);
    }
  } 

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if(file) {
      this.form.patchValue({image: file});
      this.form.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload= () => {
        this.imageDisplay = fileReader.result;
      }
      fileReader.readAsDataURL(file);
      this.imageDisplay = file;
    }
  }

  private _getCategories() {
    this.categoryService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe((cats) => {
      this.categories = cats;
    });
  }

  private _addProduct(product: FormData) {
    this.productService.createProduct(product).pipe(takeUntil(this.endSubs$)).subscribe((response) => {
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

  private _updateProduct(product: FormData) {
    this.productService.updateProduct(product, this.currentProductId).pipe(takeUntil(this.endSubs$)).subscribe((response) => {
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
