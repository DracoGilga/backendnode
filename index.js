const express = require('express')
const cors = require("cors")
const dotenv = require('dotenv')
const app = express()

//primero carga la configuracion de las variables de entorno
dotenv.config()

//se requiere para entender los datos recibidos en json
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//se requiere si se acceded desde un navegador
var corsOptions = {
    origin: ["http://localhost:8080", "http://localhost:8080"],
    methods: "GET,PUT,POST,DELETE"
}

app.use(cors(corsOptions))

//swwager
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

//bitacora
app.use(require("./middlewares/bitacora.middleware"))

//rutas
app.use("/api/categorias", require('./routes/categorias.routes'))
app.use("/api/productos", require('./routes/productos.routes'))
app.use("/api/usuarios", require('./routes/usuarios.routes'))
app.use("/api/roles", require('./routes/roles.routes'))
app.use("/api/auth", require('./routes/auth.routes'))
app.use("/api/archivos", require('./routes/archivos.routes'))
app.use("/api/bitacora", require('./routes/bitacora.routes'))
app.use("/api/carritos", require('./routes/carritos.routes'))
app.use("/api/compras", require('./routes/compras.routes'))

app.get("*", (req, res) => { res.status(404).send("Recurso no encontrado") })

//manejo de errores
const errorhandler = require("./middlewares/errorhandler.middleware")
app.use(errorhandler)

//inicia el servidor en el puerto SERVER_PORT
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.SERVER_PORT}`);
})