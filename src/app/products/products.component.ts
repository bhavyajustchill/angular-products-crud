import { Component, OnInit } from '@angular/core';
import { bindDropdown } from 'src/methods/binddropdown';
import productsData from '../../data/products.json';
import { Product } from 'src/interfaces';
import { gid, dqs } from 'src/methods/shortmethods';
import { formatDate } from 'src/methods/formatdate';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  productsHeadings: string[] = Object.keys(productsData[0]);
  productsList: Product[] = [];
  editProductModal: string = '#editProductModal1';
  deleteProductModal: string = '#deleteProductModal';
  ngOnInit(): void {
    if (localStorage.getItem('products')) {
      this.productsList = JSON.parse(localStorage.getItem('products') || '{}');
    } else {
      this.productsList = productsData;
      localStorage.setItem('products', JSON.stringify(this.productsList));
    }
  }

  clickAddProductButton(event: Event) {
    event.preventDefault();
    bindDropdown('product-category');
  }

  addProduct(event: Event) {
    event.preventDefault();
    const nextId = this.productsList[this.productsList.length - 1].id + 1;
    const productName = (gid('product-name') as HTMLInputElement).value;
    const productPrice = (gid('product-price') as HTMLInputElement).value;
    const productCategory = (gid('product-category') as HTMLInputElement).value;
    const productQuantity = (gid('product-quantity') as HTMLInputElement).value;
    const productExpiry = (gid('product-expiry') as HTMLInputElement).value;
    const productLocation = (gid('product-location') as HTMLInputElement).value;
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
    (gid('product-location') as HTMLInputElement).value = '';
  }

  edit(item: Product) {
    const tempIndex = this.productsList.findIndex((product) => {
      return product.id === item.id;
    });
    let product = this.productsList[tempIndex];
    localStorage.setItem('productIndex', tempIndex.toString());
    let editNameInput = dqs('#edit-product-name') as HTMLInputElement;
    let editPriceInput = dqs('#edit-product-price') as HTMLInputElement;
    let editQuantityInput = dqs('#edit-product-quantity') as HTMLInputElement;
    let editExpiryDateInput = dqs('#edit-product-expiry') as HTMLInputElement;
    let editLocationInput = dqs('#edit-product-location') as HTMLInputElement;
    editNameInput.value = product.name;
    editPriceInput.value = product.price.toString();
    bindDropdown('edit-product-category', item.id);
    editQuantityInput.value = product.quantity.toString();
    editLocationInput.value = product.location;
    const dateParts =
      (product.expiry && product.expiry.split('/')) || '01/01/1970'.split('/');
    const expiryDate = new Date(
      +dateParts[2],
      parseInt(dateParts[1]) - 1,
      +dateParts[0]
    );
    const expiryDateString = `${expiryDate.getFullYear()}-${expiryDate.getMonth() <= 10
      ? '0' + (parseInt(expiryDate.getMonth().toString()) + 1)
      : expiryDate.getMonth() + 1
      }-${expiryDate.getDate()}`;
    editExpiryDateInput.value = expiryDateString;
  }

  update(event: Event) {
    event.preventDefault();
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
    const productLocation = (gid('edit-product-location') as HTMLInputElement)
      .value;
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
      return product.id === parseInt(localStorage.getItem("deleteProductIndex" + 1) || "-1");
    });
    let tempProductsList = this.productsList;
    tempProductsList.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(tempProductsList));
    this.productsList = tempProductsList;
    localStorage.removeItem("deleteProductIndex");
  }
}
