import { getCategories, filterByCategory, getAllProducts, deleteProduct, isDuplicateName, generateProductId, addProduct, getProductById, updateProduct } from "../services/products.service.js"

export function renderProductsPage(root) {
    const categories = getCategories()
    console.log(categories)
    root.innerHTML = `
   <h2>Productos</h2>
    <!-- FORM: AGREGAR -->
     <div style="border:1px solid #ddd; padding: 12px; border-radius: 10px;margin-bottom: 14px;">
        <h3 id="formTitle" style="margin: 0 0 10px 0;">Agregar Producto</h3>
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
            <button id="btnPrimary" style="padding: 10px 12px; cursor: pointer;" >Agregar</button>
            <button id="btnCancel" style="padding: 10px 12px; cursor: pointer;" display:none >Cancelar</button>
            <small id="msg" style="opacity:.8;"></small>

        </div>
     </div>
     <!-- FILTRO -->
      <div style="margin-bottom: 10px;">
        <label for="">Filtrar por categoria:</label>
        <select id="cat">
           ${categories.map((c) => `<option value="${c}">${c}</option>`).join("")}
        </select>
        <span id="debug" style="margin-left: 10px; font-size: 12px; opacity: .7;"></span>
      </div>
    <!-- LIST -->
     <div id="list"></div>
    `;

    //refs
    const formTitle = root.querySelector("#formTitle")
    const msg = root.querySelector("#msg")
    const debug = root.querySelector("#debug")
    const list = root.querySelector("#list")
    const select = root.querySelector("#cat")

    const pName = root.querySelector("#pName")
    const pCategory = root.querySelector("#pCategory")
    const pPrice = root.querySelector("#pPrice")
    const pStock = root.querySelector("#pStock")
    const btnPrimary = root.querySelector("#btnPrimary")
    const btnCancel = root.querySelector("#btnCancel")
    //estado de edicion
    let editingId = null // si es null => modo agregar

    function setMessage(text, isError = false) {
        msg.textContent = text;
        msg.style.color = isError ? "crimson" : "green"
    }

    function clearMessage(params) {
        msg.textContent=""
    }

    function setFormModeAdd() {
        editingId= null
        formTitle.textContent = "Agregar producto";
        btnPrimary.textContent = "Agregar";
        btnCancel.style.display = "none";
        clearForm()        
    }
    function setFormModeEdit(product) {
        editingId= product.id
        formTitle.textContent = "Editar producto";
        btnPrimary.textContent = "Guardar cambios";
        btnCancel.style.display = "inline-block"

        pName.value = product.name ?? "";
        pCategory.value = product.category ?? "";
        pPrice.value = String(product.price ?? 0)
        pStock.value = String(product.stock ?? 0)
        pName.focus()
    }

    function clearForm(params) {
        pName.value = "";
        pCategory.value = "";
        pPrice.value = "";
        pStock.value = "";
        pName.focus()
    }

    function validateInputs() {
        const name = pName.value.trim();
        const category = pCategory.value.trim();
        const price = Number(pPrice.value)
        const stock = Number(pStock.value)

        if(!name) return {ok: false, message: "Nombre requerido"}
        if(!category) return {ok: false, message: "Categoria requerida"}
        if(Number.isNaN(price) || price <0) return {ok: false, message: "Precio inválido"}
        if(Number.isNaN(stock) || stock <0) return {ok: false, message: "Stock inválido"}
    
        return {ok:true,name,category,price,stock}
    }

    function draw(category) {
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
                            <button class="btnEdit" data-id="${p.id}" style="cursor: pointer;">Editar</button>
                                <button class="btnDelete" data-id="${p.id}" style="cursor: pointer;">Eliminar</button>

                            </td>
                        </tr>
                        `
                    ).join("")}
                </tbody>
            </table>
        `;
        // Editar
        root.querySelectorAll(".btnEdit").forEach((btn)=>{
            btn.addEventListener("click", ()=>{
            clearMessage();
            const id = btn.dataset.id;
            const product = getProductById(id)
            if (!product) {
                setMessage("Producto no encontrado", true);
                return;
            }
            setFormModeEdit(product)
            }) 
        })

        //Eliminar 
        root.querySelectorAll(".btnDelete").forEach(btn => {
            btn.addEventListener("click", ()=>{
                clearMessage()
                const id = btn.dataset.id;
                const ok = confirm("Seguro que deseas eliminar este producto?")
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
    }

    //Boton principal: Agregar o Guardar cambios
    btnPrimary.addEventListener("click", ()=>{
        clearMessage()
        const v = validateInputs()
        if(!v.ok) return setMessage(v.message, true)

        //MODO AGREGAR
        if(!editingId){
            if(isDuplicateName(v.name)){
                return setMessage("Ya existe un producto con ese nombre", true)
            }
            const newProduct = {
                id: generateProductId(),
                name: v.name,
                category: v.category,
                price : v.price,
                stock: v.stock,
                sold:0,
                active: true,
                createdAt : new Date().toISOString().slice(0,10)
            }
            addProduct(newProduct)
            setMessage("Producto agrgado 👌")    
            clearForm()
            draw(select.value)
            return
        }

        //MODO EDITAR
        const current = getProductById(editingId)
        if(!current) return setMessage("No se pudo editar (producto no existe)", true)
        const normalizedNew = v.name.trim().toLowerCase();
        const normalizedCurrent = (current.name ?? "").trim().toLowerCase();

        if (normalizedNew !== normalizedCurrent && isDuplicateName(v.name)) {
            return setMessage("Ya existe otro producto con ese nombre", true)
        }
        const updated = updateProduct(editingId,{
            name: v.name,
            category: v.category,
            price: v.price,
            stock: v.stock
        });
        if(!updated) return setMessage("No se pudo guardar cambios",true)
        setMessage("Cambios guardados")
        setFormModeAdd()    
        draw(select.value)
    }) 

    //cancel edition
    btnCancel.addEventListener("change",()=>{
        clearMessage()
        setFormModeAdd()
    })
    //filtro
    select.addEventListener("change",(e)=>{
        draw(e.target.value)
    }) 
    setFormModeAdd()
    draw("Todos")
}