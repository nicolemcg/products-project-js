//crud
import { productsSeed } from "../data/products.js";
import {readJSON, writeJSON} from "./storage.js";

const KEY ="products_db_v18"

export function initProducts() {
    const existing = readJSON(KEY)
    if(!existing) writeJSON(KEY, productsSeed)
}

export function getAllProducts() {
    return readJSON(KEY, [])
}

export function getProductById(id){
    return getAllProducts().find(p => p.id === id) || null
}

export function addProduct(product){
    const products = getAllProducts()
    products.push(product)
    writeJSON(KEY, products)
    return product
}

export function deleteProduct(id) {
    const products = getAllProducts()
    const next = products.filter((p) => p.id !== id)
    writeJSON(KEY, next)
    return products.length !== next.length;
}

export function updateProduct(id, patch) {
    const products = getAllProducts()
    const idx = products.findIndex(p => p.id===id)
    if(idx === -1) return null
    products[idx] = {...products[idx],...patch}
    writeJSON(KEY, products)
    return products[idx]
}

//Extra function
export function getCategories(){
    const cats = new Set(getAllProducts().map((p)=> p.category))
    return ["Todos", ...Array.from(cats)]
}

export function filterByCategory(category){
    const products = getAllProducts()
    if (!category || category ==="Todos") return products;
    return products.filter(p=> p.category === category)
}

export function getTopSold(limit = 5){
    return [...getAllProducts()]
    .sort((a,b) => (b.sold ?? 0)-(a.sold ?? 0))
    .slice(0,limit)
}

export function generateProductId() {
    return "p-"+Date.now().toString().slice(-6)
}

export function isDuplicateName(name) {
    const products = getAllProducts()
    const normalized = name.trim().toLowerCase();
    return products.some((p)=>p.name.trim().toLowerCase() === normalized)
}