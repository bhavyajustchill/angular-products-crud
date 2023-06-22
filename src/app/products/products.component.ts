import { Component, OnInit } from '@angular/core';
import { bindDropdown } from 'src/methods/binddropdown';
import productsData from '../../data/products.json';
import { Product } from 'src/interfaces';
import { gid, dqs } from 'src/methods/shortmethods';
import { formatDate } from 'src/methods/formatdate';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  addLocationCheckBoxValue: boolean = false;
  editLocationCheckBoxValue: boolean = false;
  productsHeadings: string[] = Object.keys(productsData[0]);
  productsList: Product[] = [];
  editProductModal: string = '#editProductModal1';
  deleteProductModal: string = '#deleteProductModal';
  addProductForm!: FormGroup;
  updateProductForm!: FormGroup;
  addProductFormSubmitted: boolean = false;
  updateProductFormSubmitted: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (localStorage.getItem('products')) {
      this.productsList = JSON.parse(localStorage.getItem('products') || '{}');
    } else {
      this.productsList = productsData;
      localStorage.setItem('products', JSON.stringify(this.productsList));
    }
    this.addProductForm = this.formBuilder.group({
      productName: ['', Validators.required],
      productPrice: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      productCategory: ['', Validators.required],
      productQuantity: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
    });
    this.updateProductForm = this.formBuilder.group({
      editProductName: ['', Validators.required],
      editProductPrice: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
      editProductQuantity: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
    });
  }

  get editProductName() {
    return this.updateProductForm.get('editProductName');
  }
  get editProductPrice() {
    return this.updateProductForm.get('editProductPrice');
  }
  get editProductQuantity() {
    return this.updateProductForm.get('editProductQuantity');
  }

  clickAddProductButton(event: Event) {
    event.preventDefault();
    bindDropdown('product-category');
  }

  addProduct() {
    const nextId = this.productsList[this.productsList.length - 1].id + 1;
    const productName = (gid('product-name') as HTMLInputElement).value;
    const productPrice = (gid('product-price') as HTMLInputElement).value;
    const productCategory = (gid('product-category') as HTMLInputElement).value;
    const productQuantity = (gid('product-quantity') as HTMLInputElement).value;
    const productExpiry = (gid('product-expiry') as HTMLInputElement).value;
    const productLocation = this.addLocationCheckBoxValue
      ? (gid('product-location-latitude') as HTMLInputElement).value +
        ' / ' +
        (gid('product-location-longitude') as HTMLInputElement).value
      : (gid('product-location') as HTMLInputElement).value;
    const newProduct = {
      id: nextId,
      name: productName,
      price: parseInt(productPrice),
      category: productCategory,
      quantity: parseInt(productQuantity),
      expiry: productExpiry ? formatDate(productExpiry) : 'N/A',
      location: productLocation,
    };
    this.productsList.push(newProduct);
    localStorage.setItem('products', JSON.stringify(this.productsList));
    (gid('product-name') as HTMLInputElement).value = '';
    (gid('product-price') as HTMLInputElement).value = '';
    (gid('product-category') as HTMLInputElement).value = '';
    (gid('product-quantity') as HTMLInputElement).value = '';
    (gid('product-expiry') as HTMLInputElement).value = '';
    if (this.addLocationCheckBoxValue) {
      (gid('product-location-latitude') as HTMLInputElement).value = '';
      (gid('product-location-longitude') as HTMLInputElement).value = '';
    } else {
      (gid('product-location') as HTMLInputElement).value = '';
    }
    this.addLocationCheckBoxValue = false;
  }

  edit(item: Product) {
    const tempIndex = this.productsList.findIndex(
      (product) => product.id === item.id
    );
    let product = this.productsList[tempIndex];
    console.log('product', product);
    localStorage.setItem('productIndex', tempIndex.toString());
    let editNameInput = dqs('#edit-product-name') as HTMLInputElement;
    let editPriceInput = dqs('#edit-product-price') as HTMLInputElement;
    let editQuantityInput = dqs('#edit-product-quantity') as HTMLInputElement;
    let editExpiryDateInput = dqs('#edit-product-expiry') as HTMLInputElement;
    let editLocationInput = dqs('#edit-product-location') as HTMLInputElement;
    this.updateProductForm.patchValue({ editProductName: product.name });
    this.updateProductForm.patchValue({ editProductPrice: product.price });
    this.updateProductForm.patchValue({
      editProductQuantity: product.quantity,
    });
    editNameInput.value = product.name;
    editPriceInput.value = product.price.toString();
    bindDropdown('edit-product-category', item.id);
    editQuantityInput.value = product.quantity.toString();
    if (product.location.includes(' / ')) {
      this.editLocationCheckBoxValue = true;
      let latLong = product.location.split(' / ');
      console.log(latLong);
      let editLatitudeInput = dqs(
        '#edit-product-location-latitude'
      ) as HTMLInputElement;
      let editLongitudeInput = dqs(
        '#edit-product-location-longitude'
      ) as HTMLInputElement;
      console.log(editLatitudeInput);
      editLatitudeInput.value = latLong[0];
      editLongitudeInput.value = latLong[1];
    } else {
      this.editLocationCheckBoxValue = false;
      editLocationInput.value = product.location;
    }
    const dateParts =
      (product.expiry && product.expiry.split('/')) || '01/01/1970'.split('/');
    const expiryDate = new Date(
      +dateParts[2],
      parseInt(dateParts[1]) - 1,
      +dateParts[0]
    );
    const expiryDateString = `${expiryDate.getFullYear()}-${
      expiryDate.getMonth() <= 10
        ? '0' + (parseInt(expiryDate.getMonth().toString()) + 1)
        : expiryDate.getMonth() + 1
    }-${expiryDate.getDate()}`;
    editExpiryDateInput.value = expiryDateString;
  }

  update() {
    const tempIndex: number = parseInt(localStorage.getItem('productIndex')!);
    const tempId: number = this.productsList[tempIndex].id;
    let tempProductsList = this.productsList;
    const productName = (gid('edit-product-name') as HTMLInputElement).value;
    const productPrice = (gid('edit-product-price') as HTMLInputElement).value;
    const productCategory = (gid('edit-product-category') as HTMLInputElement)
      .value;
    const productQuantity = (gid('edit-product-quantity') as HTMLInputElement)
      .value;
    const productExpiry = (gid('edit-product-expiry') as HTMLInputElement)
      .value;
    let productLocation = '';
    if (this.editLocationCheckBoxValue) {
      productLocation =
        (gid('edit-product-location-latitude') as HTMLInputElement).value +
        ' / ' +
        (gid('edit-product-location-longitude') as HTMLInputElement).value;
    } else {
      productLocation = (gid('edit-product-location') as HTMLInputElement)
        .value;
    }
    const newProduct = {
      id: tempId,
      name: productName,
      price: parseInt(productPrice),
      category: productCategory,
      quantity: parseInt(productQuantity),
      expiry: productExpiry ? formatDate(productExpiry) : 'N/A',
      location: productLocation,
    };
    tempProductsList[tempIndex] = newProduct;
    localStorage.setItem('products', JSON.stringify(tempProductsList));
    this.productsList = tempProductsList;
    localStorage.removeItem('edit-productIndex');
    (gid('edit-product-name') as HTMLInputElement).value = '';
    (gid('edit-product-price') as HTMLInputElement).value = '';
    (gid('edit-product-category') as HTMLInputElement).value = '';
    (gid('edit-product-quantity') as HTMLInputElement).value = '';
    (gid('edit-product-expiry') as HTMLInputElement).value = '';
    (gid('edit-product-location') as HTMLInputElement).value = '';
    (gid('edit-product-location-latitude') as HTMLInputElement).value = '';
    (gid('edit-product-location-longitude') as HTMLInputElement).value = '';
  }
  confirmDelete(item: Product) {
    const tempIndex = this.productsList.findIndex((product) => {
      return product.id === item.id;
    });
    let product = this.productsList[tempIndex];
    localStorage.setItem('deleteProductIndex', tempIndex.toString());
    let deleteItemSpan = gid('delete-product-name') as HTMLInputElement;
    console.log(deleteItemSpan);
    deleteItemSpan.innerHTML = product.name;
  }
  delete(event: Event) {
    event.preventDefault();
    const index = this.productsList.findIndex((product) => {
      return (
        product.id ===
        parseInt(localStorage.getItem('deleteProductIndex' + 1) || '-1')
      );
    });
    let tempProductsList = this.productsList;
    tempProductsList.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(tempProductsList));
    this.productsList = tempProductsList;
    localStorage.removeItem('deleteProductIndex');
  }
  onSubmitAddProductForm() {
    this.addProductFormSubmitted = true;
    if (this.addProductForm.invalid) {
      return;
    }
    this.addProduct();
  }

  onSubmitUpdateProductForm() {
    this.updateProductFormSubmitted = true;
    console.log('this.updateProductForm', this.updateProductForm.value);
    if (this.updateProductForm.invalid) {
      console.log('this.updateProductForm', this.updateProductForm.invalid);
      return;
    }
    this.update();
  }

  cancelButtonClick(event: Event) {
    event.preventDefault();
    this.addProductForm.controls['productName'].setErrors(null);
    this.addProductForm.controls['productPrice'].setErrors(null);
    this.addProductForm.controls['productCategory'].setErrors(null);
    this.addProductForm.controls['productQuantity'].setErrors(null);
  }
}
