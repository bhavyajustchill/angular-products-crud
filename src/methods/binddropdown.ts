import { gid } from './shortmethods';

export function bindDropdown(dropdownId: string, productId?: number) {
  let categoriesList: any[] = JSON.parse(
    localStorage.getItem('categories') || '{}'
  );
  let productsList: any[] = JSON.parse(
    localStorage.getItem('products') || '{}'
  );
  let dropdownInput = gid(dropdownId) as HTMLSelectElement;
  dropdownInput.innerHTML = '';
  if (!productId) {
    dropdownInput.innerHTML = `<option selected='true' value="">Select a Category...</option>`;
    categoriesList.forEach((c) => {
      dropdownInput.innerHTML += `<option value=${c.name}>${c.name}</option>`;
    });
  } else {
    const tempIndex = productsList.findIndex((product) => {
      return product.id === productId;
    });
    let tempProductCategory = productsList[tempIndex].category;
    console.log(tempProductCategory);
    categoriesList.forEach((c) => {
      dropdownInput.innerHTML += `<option value=${c.name} ${
        c.name === tempProductCategory ? 'selected=true' : ''
      }>${c.name}</option>`;
    });
  }
}
