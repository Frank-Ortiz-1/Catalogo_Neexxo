/* ============================================
   NEEXXO — PRODUCT SERVICE (capa de acceso a datos)
   Encapsula de dónde salen los productos y las
   operaciones de filtrado. La UI NO sabe si los
   datos vienen de un arreglo estático o de una API.

   Para conectar un backend/CMS en el futuro:
     1. Configura CONFIG.source = "api" y apiBase.
     2. Implementa fetchFromAPI() aquí.
     3. La interfaz (getAll, getCollections, search)
        queda igual: la UI no cambia.
   ============================================ */
(function (global) {
  'use strict';

  const CONFIG = global.NEEXXO_CONFIG;
  const Product = global.NEEXXO.Product;

  class ProductService {
    constructor() {
      this._products = [];
      this._ready = false;
    }

    /** Instancia única (patrón singleton). */
    static get instance() {
      if (!ProductService._instance) {
        ProductService._instance = new ProductService();
      }
      return ProductService._instance;
    }

    /** Inicializa cargando desde la fuente configurada. */
    async init() {
      if (this._ready) return this._products;
      this._products = await this._load();
      this._ready = true;
      return this._products;
    }

    /** Devuelve todos los productos (ya como instancias de Product). */
    getAll() {
      return this._products.slice();
    }

    /** Lista de colecciones disponibles para las pestañas. */
    getCollections() {
      const set = new Set(this._products.map(p => p.coleccion).filter(Boolean));
      return [CONFIG.labels.all, ...set];
    }

    /** Filtra por colección y búsqueda. */
    filter({ collection = CONFIG.labels.all, query = '' } = {}) {
      return this._products.filter(p =>
        p.matchesCollection(collection) && p.matchesQuery(query)
      );
    }

    /** Número de resultados tras aplicar filtros (para aria-live). */
    count({ collection = CONFIG.labels.all, query = '' } = {}) {
      return this.filter({ collection, query }).length;
    }

    // ---- Fuente de datos (privado) ----

    async _load() {
      return CONFIG.source === 'api'
        ? await this._fetchFromAPI()
        : this._fromStatic();
    }

    _fromStatic() {
      const raw = global.NEEXXO_PRODUCTS || [];
      return raw.map((data, i) =>
        new Product({ ...data, id: data.id ?? i + 1 })
      );
    }

    /** Futuro: consumir endpoint REST / CMS. */
    async _fetchFromAPI() {
      // Implementa aquí la llamada cuando exista backend.
      // Ejemplo con fetch:
      //   const res = await fetch(`${CONFIG.apiBase}/products`);
      //   const raw = await res.json();
      //   this._products = raw.map(data => new Product(data));
      throw new Error('Fuente "api" no configurada aún.');
    }
  }

  global.NEEXXO = global.NEEXXO || {};
  global.NEEXXO.ProductService = ProductService;
})(window);
