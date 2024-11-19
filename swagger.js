const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        //nombre de la aplicacion
        title: "Backend Node.js API",
        description: "Esta en una API para Mercado Libre"
    },
    host: 'localhost:3000'
}

//se genera el archivo swagger-output.json
const outputFile = './swagger-output.json'
const routes = ['./index.js']

//se genera la documentacion
swaggerAutogen(outputFile,routes,doc)