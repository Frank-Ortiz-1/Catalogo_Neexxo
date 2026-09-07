/* ============================================
   NEEXXO — MODELO PRODUCT
   Encapsula los datos de un producto y su lógica
   de presentación (filtros, búsqueda, imágenes).
   ============================================ */
(function (global) {
  'use strict';

  const CONFIG = global.NEEXXO_CONFIG;

  class Product {
    /**
     * @param {Object} data - Datos crudos del producto
     */
    constructor(data = {}) {
      this.id = data.id ?? null;
      this.marca = data.marca || '';
      this.nombre = data.nombre || '';
      this.genero = data.genero || 'Unisex'; // Hombre | Dama | Unisex
      this.presentacion = data.presentacion || '';
      this.tipo = data.tipo || '';           // Caja | Cofre | Kit | Body Spray
      this.coleccion = data.coleccion || '';
      this.descripcion = data.descripcion || '';
      this.imagen = data.imagen || null;     // URL real (4:5) u null
    }

    /** URL de imagen final: real si existe, si no placeholder de marca. */
    get imageUrl() {
      if (this.imagen) return this.imagen;
      return Product.placeholderUrl(this.nombre);
    }

    /** Alt descriptivo para accesibilidad. */
    get imageAlt() {
      return `${this.nombre} — fragancia ${this.genero} Neexxo`;
    }

    /** ¿Coincide con una búsqueda textual (case-insensitive)? */
    matchesQuery(query = '') {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const haystack = `${this.nombre} ${this.marca || ''}`.toLowerCase();
      return haystack.includes(q);

    }

    /** ¿Pertenece a una colección ("Todos" incluye todo)? */
    matchesCollection(collection = 'Todos') {
      return collection === CONFIG.labels.all || this.coleccion === collection;
    }

    /** Generador de placeholder con la paleta de la marca. */
    static placeholderUrl(name) {
      if (!CONFIG.placeholder.enabled) return '';
      const text = encodeURIComponent(name);
      const base = CONFIG.placeholder.base;
      const font = CONFIG.placeholder.font;
      return `${base}?font=${font}&text=${text}`;
    }
  }

  global.NEEXXO = global.NEEXXO || {};
  global.NEEXXO.Product = Product;
})(window);
