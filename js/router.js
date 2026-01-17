import { renderAboutPage } from "./pages/about.js";
import { renderDashboardPage } from "./pages/dashboard.js";
import { renderHomePage } from "./pages/home.js";

import { renderProductsPage } from "./pages/products.js";




const routes = {//map of routes
    dashboard: renderDashboardPage,
    products: renderProductsPage,
    about: renderAboutPage
}
export class Router {
    constructor(root){
        this.root = root
    }
    navigate(pageName){
        const pageFn = routes[pageName]
        if(pageFn) {
            this.root.innerHTML = "";
            pageFn(this.root)

        }else{
            this.root.innerHTML = "<p> Pagina no encontrada</p>"
        }
    }
}