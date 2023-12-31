import { Component, OnInit } from '@angular/core';
import categoriesData from '../../data/categories.json';
import { Category } from 'src/interfaces';
import { gid, dqs } from 'src/methods/shortmethods';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categoriesHeadings: string[] = Object.keys(categoriesData[0]);
  categoriesList: Category[] = [];
  editCategoryModal: string = '#editCategoryModal';
  deleteCategoryModal: string = '#deleteCategoryModal';
  addCategoryForm!: FormGroup;
  updateCategoryForm!: FormGroup;
  addCategoryFormSubmitted: boolean = false;
  updateCategoryFormSubmitted: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (localStorage.getItem('categories')) {
      this.categoriesList = JSON.parse(
        localStorage.getItem('categories') || ''
      );
    } else {
      this.categoriesList = categoriesData;
      localStorage.setItem('categories', JSON.stringify(this.categoriesList));
    }
    this.addCategoryForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
    });
    this.updateCategoryForm = this.formBuilder.group({
      editCategoryName: ['', Validators.required],
    });
  }

  get editCategoryName() {
    return this.updateCategoryForm.get('editCategoryName');
  }

  saveCategory() {
    const nextId = this.categoriesList[this.categoriesList.length - 1].id + 1;
    const categoryName = (gid('category-name') as HTMLInputElement).value;
    const newCategory = {
      id: nextId,
      name: categoryName,
    };
    this.categoriesList.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(this.categoriesList));
    (gid('category-name') as HTMLInputElement).value = '';
  }
  edit(item: Category) {
    const tempIndex = this.categoriesList.findIndex((category) => {
      return category.id === item.id;
    });
    let category = this.categoriesList[tempIndex];
    localStorage.setItem('categoryIndex', tempIndex.toString());
    let editInput = dqs('#edit-category-name') as HTMLInputElement;
    editInput.value = category.name;
    this.updateCategoryForm.patchValue({ editCategoryName: category.name });
  }

  update() {
    const tempIndex: number = parseInt(
      localStorage.getItem('categoryIndex') || '0'
    );
    const tempId: number = this.categoriesList[tempIndex].id;
    let tempCategoriesList = this.categoriesList;
    const categoryName = (gid('edit-category-name') as HTMLInputElement).value;
    const newCategory = {
      id: tempId,
      name: categoryName,
    };
    tempCategoriesList[tempIndex] = newCategory;
    localStorage.setItem('categories', JSON.stringify(tempCategoriesList));
    this.categoriesList = tempCategoriesList;
    localStorage.removeItem('categoryIndex');
    (gid('edit-category-name') as HTMLInputElement).value = '';
  }

  confirmDelete(item: Category) {
    const tempIndex = this.categoriesList.findIndex((category) => {
      return category.id === item.id;
    });
    let category = this.categoriesList[tempIndex];
    localStorage.setItem('deleteCategoryIndex', tempIndex.toString());
    let deleteItemSpan = gid('delete-category-name') as HTMLInputElement;
    console.log(deleteItemSpan);
    deleteItemSpan.innerHTML = category.name;
  }

  delete(event: Event) {
    event.preventDefault();
    const index = this.categoriesList.findIndex((category) => {
      return (
        category.id ===
        parseInt(localStorage.getItem('deleteCategoryIndex' + 1) || '-1')
      );
    });
    let tempCategoriesList = this.categoriesList;
    tempCategoriesList.splice(index, 1);
    localStorage.setItem('categories', JSON.stringify(tempCategoriesList));
    this.categoriesList = tempCategoriesList;
    localStorage.removeItem('deleteCategoryIndex');
  }

  onSubmitAddCategoryForm() {
    this.addCategoryFormSubmitted = true;
    if (this.addCategoryForm.invalid) {
      return;
    }
    this.saveCategory();
  }
  onSubmitUpdateCategoryForm() {
    this.updateCategoryFormSubmitted = true;
    if (this.updateCategoryForm.invalid) {
      return;
    }
    this.update();
  }
  cancelButtonClick(event: Event) {
    event.preventDefault();
    this.addCategoryForm.controls['categoryName'].setErrors(null);
  }
}
