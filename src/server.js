import 'dotenv/config';
import express from 'express';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import userRouter from './routes/user.route.js'; 
import viewsRouter from './routes/views.router.js';
import authRouter from './routes/auth.router.js';
import morgan from "morgan"; 
import passport from 'passport';
import { initializePassport } from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import session from 'express-session'; 
import handlebars from 'express-handlebars';
import MongoStore from "connect-mongo";
import { initMongoDB } from './db/database.js';  //conexion a la base Datos 
import { Server } from 'socket.io';
import { middError } from './middlewares/midd.error.js';
import { __dirname } from './path.js';
import { generateToken, verifyToken } from './utils/jwt.js' // ver esta ruta 
import { createPassword } from './utils/hashFunctions.js';


import ProductsManager from './daos/productFSManager.js';



initMongoDB();

const productManager = new ProductsManager("./src/data/products.json");

const secret = process.env.SECRET;
const mongoUrl = process.env.MONGO_URL_DB;

const app = express();

//express config 
app.use(express.json()); // para recibir datos json
app.use(express.urlencoded({extended: true})); //midd para datos q se envian x params 
app.use(morgan("dev")); 
app.use(cookieParser()); 


app.use(
    session({
      secret: secret,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        mongoUrl: mongoUrl ,
        ttl: 10,
      }),
    })
  );

app.use(express.static(`${__dirname}/public`)); //para archivos públicos 

//configuración de handlebars 
app.engine('handlebars', handlebars.engine()); //funcionalidad de handlebars 
app.set('views', `${__dirname}/views`); //ubicación de la carpeta para las vistas 
app.set('view engine', 'handlebars'); //seteamos el motor de plantilla a utilizar 
app.use('/', viewsRouter); //enrutador de vistas 



//passport config 
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


//prefijo /products, ingresa al arouter de products => en el rauter alcanza con poner /, si no se duplica 
app.use("/api/products", productsRouter); //routers 
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/auth/register", authRouter);





//funciona 
app.post("/api/register", async(req, res) => {
    const { first_name, last_name, age, email, password } = req.body;
    console.log(req.body);
    
    if(!first_name || !last_name || !email || !age || !password ){
        return res.status(400).json({ error: "All fields are required" });
    }
    const hashPassword = await createPassword(password);
    
    const user = { first_name, last_name, email, age, password: hashPassword };
    
    const accessToken = generateToken(user);
    
    res.json({ user, accessToken });
});




app.use(middError); //siempre despues del enrutador 

//ruta que apunta a la plantilla de webSocket 
app.get("/realTimeProducts", (req, res)=>{
    res.render("realTimeProducts")
})



const PORT = 8080;

const httpServer = app.listen(PORT, ()=> console.log(`servidor ok en ${PORT}` ));

// instanciamos la clase server 
const socketServer = new Server (httpServer); 

socketServer.on('connection', async(socket)=>{
    console.log(`Nuevo cliente conectado ${socket.id}`);
    socketServer.emit('products', await productManager.getAll());

    socket.on('disconnect', ()=>{
     console.log(`Cliente desconectado`);
    })
    

    socket.on('newProduct', async(product)=>{
        try {
            await productManager.create(product)
            socketServer.emit('products', await productManager.getAll());
            
        } catch (error) {
            console.error(`error creating the product ${error.message}`)
        }
       
 
    }) 

    socket.on('deleteProduct',async(id)=>{
        try {
            await productManager.delete(id);
            socketServer.emit('products', await productManager.getAll());
        } catch (error) {
            console.error(`error deleting the product ${error.message}`)
        }
       
    })



})



