/* ============================================
   NEEXXO — CONFIGURACIÓN GLOBAL
   Centraliza URLs, flags y comportamiento del
   catálogo. Reutilizable en cualquier módulo.
   ============================================ */
(function (global) {
  'use strict';

  global.NEEXXO_CONFIG = global.NEEXXO_CONFIG || {
    // Fuente de los datos:
    //  - "static" : lee de js/data/products.js
    //  - "api"    : (futuro) hace fetch a CAOS_API_BASE
    source: 'static',

    // Base URL de la API (futuro backend / CMS)
    apiBase: global.NEEXXO_API_BASE || '/api/catalog',

    // Configuración de imágenes
    placeholder: {
      enabled: true,
      base: 'https://placehold.co/400x500/f6f4f0/9c7a3f',
      font: 'raleway'
    },

    // Textos de interfaz
    labels: {
      all: 'Todos',
      empty: 'No encontramos referencias con ese nombre.',
      countSingle: '1 referencia',
      countPlural: '${n} referencias'
    },

    // Comportamiento
    searchMinChars: 0,
    groupBy: 'coleccion'
  };
})(window);
