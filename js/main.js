import {Router} from "./router.js";
import { initProducts } from "./services/products.service.js";

const app = document.getElementById("app");
const router = new Router(app)

initProducts()

//todo function to mark as active in the sidebar
function setActive(page) { //dashboard
    document.querySelectorAll(".menu-item").forEach((btn)=>{
        btn.classList.toggle("menu-item-active", btn.dataset.page===page)
    })
} 

//todo function to navigate when we click on the sidebar
document.querySelectorAll(".menu-item").forEach(btn=>{
        btn.addEventListener("click",()=>{
            const page = btn.dataset.page //dashboard
            router.navigate(page)
            setActive(page)
        })
})

router.navigate("dashboard")
