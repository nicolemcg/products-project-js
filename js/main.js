import {Router} from "./router.js";

const app = document.getElementById("app");
const router = new Router(app)

router.navigate("dashboard");

//todo function to mark as active in the sidebar
function setActive(page) { //dashboard
    document.querySelectorAll(".menu-item").forEach((btn)=>{
        btn.classList.toggle("active", btn.dataset.page===page)
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
