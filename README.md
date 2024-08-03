http://localhost:8085/realTimeProducts
http://localhost:8085/products



✔️ ORDENAMIENTO ASCENDENTE Y DESCENDENTE     
localhost:8085/api/products?sort=asc
localhost:8085/api/products?sort=desc

✔️ BUSQUEDA POR CATEGORIA 
❗localhost:8085/api/products?category=Limpieza  
localhost:8085/api/products?category=Almacen 
localhost:8085/api/products?category=mascotas 

✔️ LIMIT 
localhost:8085/api/products?page=2category=Almacen&limit=1


CARTS
CREACIÓN DEL CARRITO 
✔️ POST : http://localhost:8085/api/carts

POST: 
AGREGAR UN PRODUCTO AL CARRITO:  router.post("/:idCart/products/:idProd", controllers.saveProductToCart);
✔️   http://localhost:8085/api/carts/667857c75b4e3131ada682f6/products/66773f6c2c997f443c70b75e

GET: 
TRAER TODOS LOS CARRITOS:  router.get ("/", controllers.getAll);
✔️   http://localhost:8085/api/carts
 
BUSCAR CARRITO POR ID:   router.get ("/:id", controllers.getById );
✔️   http://localhost:8085/api/carts/6671f2f8efbf6f5137ad8032
    
PUT: 
router.put("/:id", controllers.update);
✔️  http://localhost:8085/api/carts/667857c75b4e3131ada682f6  
    {
     "products": [
     {
      "quantity": 10,
      "product": "66773f6c2c997f443c70b75e"
     }]
    } 

AGREGAR QUANTITY POR BODY: router.put("/:idCart/products/:idProd", controllers.updateProdQuantityToCart);
✔️  http://localhost:8085/api/carts/667857c75b4e3131ada682f6/products/66773f6c2c997f443c70b75e

DELETE:
BORRAR UN CARRITO : router.delete("/:id", controllers.remove);
✔️  http://localhost:8085/api/carts/6671e62e0231f5841b94a13e  

✔️  BORRAR UN PROD DEL CARRITO:  router.delete("/:idCart/products/:idProd", controllers.removeProdToCart); ❓ BORRA TODOS LOS PRODUCTOS 
http://localhost:8085/api/carts/667857c75b4e3131ada682f6/products/66773f6c2c997f443c70b75e


✔️  LIMPIAR EL CARRITO:   router.delete("/clear/:idCart", controllers.clearCart); //no func
http://localhost:8085/api/carts/clear/667857c75b4e3131ada682f6



*BACKEND II *

# **<u>Registrar Usuario Actual:</u>**
Ruta: /api/auth/register
Método HTTP: POST
Descripción: Esta ruta se usa para registrar un nuevo usuario en la aplicación.

 
# **<u>Loguear Usuario:</u>**
Ruta: /api/auth/login
Método HTTP: POST
Descripción: Esta ruta se usa para autenticar a un usuario y devolver un token JWT en una cookie.


# **<u>Desloguear Usuario:</u>**
Ruta: /api/auth/logout
Método HTTP: POST
Descripción: Esta ruta se usa para desloguear al usuario, eliminando la cookie de autenticación.

# **<u>Obtener Datos Usuario:</u>**

Ruta: /api/auth/current
Método HTTP: GET
Descripción: Esta ruta se usa para obtener información sobre el usuario actualmente autenticado, basada en el token JWT.