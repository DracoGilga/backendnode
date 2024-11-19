'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('categoriaproducto', [
            { productoid: 1, categoriaid: 1, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 2, categoriaid: 2, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 3, categoriaid: 3, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 4, categoriaid: 4, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 5, categoriaid: 5, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 6, categoriaid: 6, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 7, categoriaid: 7, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 8, categoriaid: 8, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 9, categoriaid: 9, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 10, categoriaid: 10, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 11, categoriaid: 11, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 12, categoriaid: 12, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 13, categoriaid: 13, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 14, categoriaid: 14, createdAt: new Date(), updatedAt: new Date() },
            { productoid: 15, categoriaid: 15, createdAt: new Date(), updatedAt: new Date() },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('categoriaproducto', null, {});
    }
};