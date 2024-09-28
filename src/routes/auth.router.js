import { Router } from "express";
import { UserModel } from "../daos/models/user.model.js";
//import { session } from "passport";
import passport from "passport";

import pkg from 'passport';
const { session } = pkg; 
import { generateToken } from "../utils/jwt.js";
import { createPassword } from "../utils/hashFunctions.js";

const router = Router();

router.post("/register", async(req, res)=>{
    const { first_name, last_name, email, age, role, password } = req.body;

    if(!first_name || !last_name || !email || !age || !password ){
        return res.status(400).json({ error: "All fields are required" });
    }
 
    try {
        //hasheamos la contraseña 
        const hashPassword = await createPassword(password);

        //creamos el usuario 
        const user = await UserModel.create({
            first_name,
            last_name,
            email,
            age,
            role,
            password: hashPassword,
        })
        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({ error: "Error creating user", detail: error.message });
        
    }
})
//implementación de la estrategia de login 
//failureRedirect:  si pasa algo redireccionamos, RUTA ABSOLUTA!!
/* router.post("/login", passport.authenticate("login", { session: false,
    failureRedirect:"/api/auth/failLogin?error=true"}), async (req, res)=>{
        const payload = {
            first_name: req.user.first_name,
            email : req.user.email,
            role : req.user.role,
        }
        console.log(payload); 
        //si todo va bien, le damos la cookie con el token
        const token = generateToken(payload);

        res.cookie("token", token, { httpOnly: true, expiresIn: "1d" });  //1d = 1 day

        res.status(200).json({ message: "Login successful", token});
    }
); */

router.post("/login", (req, res, next) => {
    passport.authenticate("login", { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/api/auth/failLogin?error=true");
        }
        const payload = {
            first_name: user.first_name,
            email: user.email,
            role: user.role,
        };
        const token = generateToken(payload);

        res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 día

        res.status(200).json({ message: "Login successful", token });
    })(req, res, next);
});

//por si quiero registrar un user inexistente 

//no entiendo por que no funciona con get
router.get("/failLogin", (req, res)=>{
    console.log(req.query);
    console.log("no auth"); 
    res.status(401).json({error: "unauthorized"});
});

router.post("/failLogin", (req, res)=>{
    console.log(req.query);
    console.log("no auth"); 
    res.status(401).json({error: "unauthorized"});
});


router.get("/current", passport.authenticate("jwt", { session: false }), (req, res)=>{
    console.log( `ueseer: ${req.user}`);
    res.status(200).json({ message: "Bienvenido", user: req.user}); 
})

//eliminar las cookies 
router.get("/logout", (req, res) => {
    res.clearCookie("token"); // Borra la cookie 'token'
    res.status(200).json({ message: "Logout successful" });
});


export default router

