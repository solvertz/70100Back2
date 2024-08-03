import passport from "passport";
import local from "passport-local";
import  { createPassword, comparePassword } from "../utils/hashFunctions.js";
import jwt from 'jsonwebtoken'
import jwtStrategy from "passport-jwt";



import { UserModel } from "../daos/models/user.model.js";

// importtar el modelo de usuario del service 

// instanciamos la estrategia 

const LocalStrategy = local.Strategy;

const JWTStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

//creamos una función 
const initializePassport = () =>{
    passport.use("login", new LocalStrategy ({ usernameField: "email",
        passReqToCallback: true}, async (req, email, password, done )=>{
           
            try {
            const user = await UserModel.findOne({ email });
 
            if (!user) {
                return done(null, false, { message: "User not found" });
            }

            if(!(await comparePassword(password, user.password))){
                return done(null, false, {menssage: "Incorrect password"})
            }
            return done(null, user);  
              //para poder enviar usamos serialize
            

            }catch (error){
                done(error); 
            }
        })
    );


    // Register strategy
    passport.use("register", new LocalStrategy({ usernameField: "email",
        passReqToCallback: true }, async (req, username, password, done) => {

            const { first_name, last_name, age } = req.body;  
            //validamos si falta información 

            if (!first_name || !last_name || !age) {
            return res.status(400).json({ error: "Falta información" });
            }
            try {
            const user = await UserModel.findOne({ email: username });

            if (user) {
                return done(null, false, { message: "El usuario ya existe" });
                
            }

            const hashPassword = createHash(password);

            // Se  guarda en la colección de usuarios
            const newUser = await UserModel.create({
                first_name,
                last_name,
                email: username,
                age,
                password: hashPassword,
            });

            return done(null, newUser);
            } catch (error) {
            done(error);
            }
        }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    passport.use("jwt", new JWTStrategy({ jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), 
        secretOrKey: "s3cr3t"}, async(payload, done)=>{
        try{
            return done(null, payload); 
        }catch(error){
            return done(error); 
        }
    }
    ) )

}    

//funcion para facilitarle el el acceso al token a passport 

function cookieExtractor (req){ 
    let token = null;
    if(req && req.cookies){
        token = req.cookies["token"]; //si no paso el token devuelve no autorizado
    }
    return token 
}






export { initializePassport}; 


