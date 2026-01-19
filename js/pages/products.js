import { getCategories, filterByCategory, getAllProducts, deleteProduct, isDuplicateName, generateProductId, addProduct } from "../services/products.service.js"

export function renderProductsPage(root){
    const categories = getCategories()
    root.innerHTML = `
   <h2>Productos</h2>
    <!-- FORM: AGREGAR -->
    <div style="border:1px solid #ddd; padding: 12px; border-radius: 10px;margin-bottom: 14px;">
        <h3 style="margin: 0 0 10px 0;">Agregar Producto</h3>
        <div style="display: grid; grid-template-columns:1fr 1fr; gap: 10px;">
            <div>
                <label for="">Nombre</label>
                <input id="pName" type="text" placeholder="Ej: Teclado mecánico" style="width: 100%;padding: 8px;">
            </div>    
            <div>
                <label for="">Categoria</label>
                <input id="pCategory" type="text" placeholder="Ej: Perifericos" style="width: 100%;padding: 8px;">
            </div>    
            <div>
                <label for="">Precio (Bs)</label>
                <input id="pPrice" type="number" min="0" placeholder="Ej: 450" style="width: 100%;padding: 8px;">
            </div>    
            <div>
                <label for="">Stock</label>
                <input id="pStock" type="number" min="0" placeholder="Ej: 12" style="width: 100%;padding: 8px;">
            </div>    
        </div>
        <div style="margin-top: 10px; display: flex;gap: 10px; align-items: center;">
            <button id="btnAdd" style="padding: 10px 12px; cursor: pointer;" >Agregar</button>
            <small id="msg" style="opacity:.8;"></small>

        </div>
    </div>
     <!-- FILTRO -->
      <div style="margin-bottom: 10px;">
        <label for="">Filtrar por categoria:</label>
        <select id="cat">
         ${categories.map((c)=>`<option value="${c}">${c}</option>`)}
        </select>
        <span id="debug" style="margin-left: 10px; font-size: 12px; opacity: .7;"></span>
      </div>
    <!-- LIST -->
     <div id="list"></div>
    `;

    //refs
    const msg = root.querySelector("#msg")
    const debug = root.querySelector("#debug")

    const list = root.querySelector("#list")
    const select = root.querySelector("#cat")

    const pName = root.querySelector("#pName")
    const pCategory = root.querySelector("#pCategory")
    const pPrice = root.querySelector("#pPrice")
    const pStock = root.querySelector("#pStock")

    function setMessage(text, isError = false) {
        msg.textContent = text;
        msg.style.color = isError ? "crimson" : "green"
    }

    function clearForm(params) {
        pName.value = "";
        pCategory.value = "";
        pPrice.value = "";
        pStock.value = "";
        pName.focus()
    }

    function draw(category) { console.log("category " +  category);
        const all = getAllProducts()
        const items = filterByCategory(category)

        debug.textContent = `Total : ${all.length} | Mostrando : ${items.length}`;
        if (items.length === 0) {
            list.innerHTML = `<p>No hay productos para mostrar</p>`
            return
        }
        
        list.innerHTML = `
         <table border="1" cellpading="8" cellspacing = "0" style = "border-collapse:collapse; width:100%">
            <thead>
                 <tr>
                    <th>Nombre</th>
                    <th>Categoria</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Vendidos</th>
                    <th>Acciones</th>
                 </tr>   
            </thead>
            <tbody>
                ${items.map(
                    (p) => `
                        <tr>
                            <td>${p.name}</td>
                            <td>${p.category}</td>
                            <td>${p.price}</td>
                            <td>${p.stock}</td>
                            <td>${p.sold ?? 0}</td>
                            <td>
                                <button class="btnDelete" data-id="${p.id}" style="cursor: pointer;">Eliminar</button>
                            </td>
                        </tr>
                        `
                ).join("")}
            </tbody>
        </table>
        `;

        root.querySelectorAll(".btnDelete").forEach(btn => {
            btn.addEventListener("click", ()=>{
                const id= btn.dataset.id;
                const ok=confirm("Seguro que deseas eliminar este producto?")
                if (!ok) return
                const removed = deleteProduct(id)
                if (removed) {
                    setMessage("Producto eliminado 👌")
                    draw(select.value)
                } else {
                    setMessage("No se pudo eliminar (ID no encontrado)", true)
                    
                }
            })
        });
        
         //AGREGAR
        btnAdd.addEventListener("click", ()=>{
        const name = pName.value.trim()
        const category = pCategory.value.trim()
        const price = Number(pPrice.value)
        const stock = Number(pStock.value)
        //validaciones minimas
        if(!name) return setMessage("Nombre requerido", true)
        if(!category) return setMessage("Categoria requerido", true)
        if(Number.isNaN(price)|| price <0) return setMessage("Categoria requerido", true)
        if(Number.isNaN(stock)|| stock <0) return setMessage("Stock requerido", true)

        //evitar duplicados por nombre
        if (isDuplicateName(name)) {
            return setMessage("Ya existe un producto con ese nombre", true)
        }    

        const newProduct = {
            id: generateProductId(),
            name,
            category,
            price,
            stock,
            sold:0,
            active: true,
            createdAt : new Date().toISOString().slice(0,10)
        }
        addProduct(newProduct)
        setMessage("Producto agrgado 👌")    
        clearForm()
        draw(select.value)
       }) 
       //filter
       select.addEventListener("change",(e)=>{
            draw(e.target.value)
       }) 
       draw("Todos")

    }
    draw("Todos")
    select.addEventListener("change", (e)=> draw(e.target.value))
}