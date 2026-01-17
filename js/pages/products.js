import {productsSeed} from "../data/products.js";


export function renderProductsPage(root){
    root.innerHTML = `
    <h1>Products</h1>
    <p>Esta es la pagina Products</p>
    <ul id="products-list"></ul>
  `;

  const ul = root.querySelector("#products-list");

  productsSeed.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p.name;
    ul.appendChild(li);
  });
}