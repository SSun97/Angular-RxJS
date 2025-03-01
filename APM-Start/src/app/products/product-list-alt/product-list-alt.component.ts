import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { catchError, EMPTY, Subject, Subscription } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent{
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  // errorMessage = '';
  // selectedProductId = 0;

  products$ = this.productService.productsWithCategory$
    .pipe(
      catchError((err: string) => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  selectedProduct$ = this.productService.selectedProduct$;
  constructor(private productService: ProductService) { }


  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
