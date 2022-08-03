import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product-service.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products$?: Observable<Product[]>
  filterProducts$?: Observable<Product[]>
  displayedColumns = ['name', 'price', 'stock', 'operations']

  @ViewChild('name') productName!: ElementRef

  productForm = this.fb.nonNullable.group({
    id: [undefined],
    name: ['', [Validators.required]],
    stock: [0, [Validators.required]],
    price: [0, [Validators.required]],
  })

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.products$ = this.productService.getProducts()
  }

  onSubmit(): void {
    let p = this.productForm.value
    if(!p.id){
      this.addProduct(p as Product)
    }
    else{
      this.updateProduct(p as Product)
    }
  }

  addProduct(p: Product): void {
    this.productService.addProduct(p)
    .then(() => {
      this.snackBar.open('Product added!', 'OK', {duration: 2000})
      this.productForm.reset({name: '', stock: 0, price: 0, id: undefined})
      this.productName.nativeElement.focus()
    })
    .catch(() => {
      this.snackBar.open('Error on submiting the product!', 'OK', {duration: 2000})
    })
  }

  updateProduct(p: Product): void {
    this.productService.updateProduct(p)
    .then(()=> {
      this.snackBar.open('Product has been updated.', 'OK', {duration:2000})
      this.productForm.reset({name: '', stock: 0, price: 0, id: undefined})
      this.productName.nativeElement.focus()
    })
    .catch(()=> {
      this.snackBar.open('Error when trying to update the product.', 'OK', {duration:2000})
    })
  }

  edit(p: any): void {
    this.productForm.setValue(p)
  }

  del(p: Product): void {
    this.productService.deleteProduct(p)
    .then(()=> {
      this.snackBar.open('Product has been removed.', 'OK', {duration:2000})
    })
    .catch(()=> {
      this.snackBar.open('Error when trying to remove the product.', 'OK', {duration:2000})
    })
  }

  filter(e: any) {
    let ele = e.target as HTMLInputElement
    this.filterProducts$ = this.productService.searchByName(ele.value)
  }
}
