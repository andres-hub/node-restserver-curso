//=====================================
//Puerto
//=====================================
process.env.PORT = process.env.PORT || 3000

//=====================================
//Entorno
//=====================================
process.env.NODE_ENV = process.env.NODE_ENV || "dev"

//=====================================
//Vencimiento del token
//=====================================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

//=====================================
//SEED 
//=====================================
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrllo"

//=====================================
//Base de datos
//=====================================
let urlDB
if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/cafe"
} else {
    urlDB = process.env.MONGO_URL
}
process.env.URLDB = urlDB

//=====================================
//Base de datos
//=====================================
// esto no sirve pues hay que crear el cliente_ID reguistrando todos los citios permitido o si no no funciona  
//process.env.CLIENT_ID = process.env.CLIENT_ID || '630080066536-uglqjsede0hcaoorlauht8ta5s6govl1.apps.googleusercontent.com'