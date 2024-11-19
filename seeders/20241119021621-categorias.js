'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('categoria', [
            { id: 1, nombre: 'Televisores', protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 2, nombre: "Celulares y tecnología", protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 3, nombre: "Laptops", protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 4, nombre: "Electrodomésticos", protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 5, nombre: "Hogar y muebles", protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 6, nombre: "Moda", protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 7, nombre: "Deportes", protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 8, nombre: "Construcción", protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 9, nombre: "Oficina", protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 10, nombre: "Juguetes", protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 11, nombre: "Bebés", protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 12, nombre: "Salud", protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 13, nombre: "Belleza", protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 14, nombre: "Videojuegos", protegida: true, createdAt: new Date(), updatedAt: new Date() },
            { id: 15, nombre: "Supermercado", protegida: true, createdAt: new Date(), updatedAt: new Date() }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('categoria', null, {});
    }
};