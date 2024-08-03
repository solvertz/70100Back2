//renderizamos las plantillas 
import express from 'express';  
import { __dirname } from '../path.js';
import { Router } from 'express'; 
const router = Router();

import ProductsManager from '../daos/productFSManager.js';
import { isSession } from '../middlewares/isSession.js';
const managers = new ProductsManager(`${__dirname}/data/products.json`);

router.get("/products", async(req, res)=>{
    const products = await managers.getAll();
    res.render('home', { products })  //nombre de la plantilla 

}); 

router.get("/realTimeProducts", (req, res)=>{
    res.render('realTimeProducts')
})

router.get("/register", isSession, async(req, res)=>{
   /*  const isSession =  req.session.user ? false : true; 
    if(! isSession){
        return res.redirect("/")
    } */
    res.render("register", {
        title: "Register"

    });
});

router.get("/login", isSession, async(req, res)=>{
    res.render("login", {
        title: "Login"
    })
});

router.get("/profile", isSession, async(req,res)=>{
    res.render("profile", {
        title: "Register",
        user: req.session.user,
    })
})


export default router