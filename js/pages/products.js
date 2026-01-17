import { getCategories, filterByCategory } from "../services/products.service.js"

export function renderProductsPage(root){
    const categories = getCategories()
    root.innerHTML = `
        <h2>Productos</h2>
        <select id="cat">
         ${categories.map((c)=>`<option value="${c}">${c}</option>`)}
        </select>
        <div id="list" style="margin-top:12px;"></div>
    `;
    const list = root.querySelector("#list")
    const select = root.querySelector("#cat")

    function draw(category) {
        const items = filterByCategory(category);
        list.innerHTML = `
        <ul>
            ${items.map((p)=> `<li>${p.name} - ${p.category} -vendidos: ${p.sold}</li>`).join("")}
        </ul>
        `

    }
   draw("Todos")
   select.addEventListener("change", (e)=> draw(e.target.value))
}