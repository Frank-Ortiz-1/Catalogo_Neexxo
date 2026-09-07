/* ============================================
   NEEXXO — CATÁLOGO (orquestador UI)
   Conecta el ProductService con el DOM:
     - renderiza pestañas de colección
     - renderiza el grid de tarjetas
     - maneja búsqueda y contador de resultados
   ============================================ */
(function (global) {
  'use strict';

  const CONFIG = global.NEEXXO_CONFIG;
  const ProductService = global.NEEXXO.ProductService;

  class Catalog {
    constructor(root) {
      this.root = root || document;

      this.catalogEl = this.root.getElementById('catalog');
      this.tabsEl = this.root.getElementById('tabs');
      this.searchEl = this.root.getElementById('search');
      this.countEl = this.root.getElementById('resultCount');

      this.service = ProductService.instance;
      this.activeCollection = CONFIG.labels.all;
      this.query = '';

      if (!this.catalogEl) {
        throw new Error('Catalog: falta el contenedor #catalog');
      }
    }

    /** Arranca el catálogo de forma asíncrona. */
    async init() {
      await this.service.init();
      this._bindEvents();
      this.renderTabs();
      this.render();
      return this;
    }

    // ---- DOM helpers ----

    _bindEvents() {
      this.searchEl.addEventListener('input', (e) => {
        this.query = e.target.value;
        this.render();
      });
    }

    // ---- Render de pestañas ----

    renderTabs() {
      const collections = this.service.getCollections();
      this.tabsEl.innerHTML = '';

      collections.forEach((col) => {
        const btn = document.createElement('button');
        btn.className = 'tab';
        btn.type = 'button';
        btn.textContent = col;
        btn.setAttribute('aria-pressed', col === this.activeCollection ? 'true' : 'false');

        btn.addEventListener('click', () => {
          this.activeCollection = col;
          this.renderTabs();
          this.render();
        });

        this.tabsEl.appendChild(btn);
      });
    }

    // ---- Render de productos ----

    render() {
      const products = this.service.filter({
        collection: this.activeCollection,
        query: this.query
      });

      this._renderCount(products.length);
      this._clearCatalog();

      if (products.length === 0) {
        this._renderEmpty();
        return;
      }

      products.forEach((product) => {
        this.catalogEl.appendChild(this._buildCard(product));
      });
    }

    _renderCount(n) {
      if (!this.countEl) return;
      const labels = CONFIG.labels;
      this.countEl.textContent = n === 1
        ? labels.countSingle
        : labels.countPlural.replace('${n}', n);
    }

    _clearCatalog() {
      this.catalogEl.innerHTML = '';
    }

    _renderEmpty() {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = CONFIG.labels.empty;
      this.catalogEl.appendChild(empty);
    }

    _buildCard(product) {
      const card = document.createElement('article');
      card.className = 'card';

      const image = document.createElement('div');
      image.className = 'card-image';
      image.innerHTML = `
        <img src="${product.imageUrl}"
             alt="${product.imageAlt}"
             loading="lazy">
        <span class="gender-tag">${product.genero}</span>
      `;

      const body = document.createElement('div');
      body.className = 'card-body';

      const brand = document.createElement('p');
      brand.className = 'card-brand';
      brand.textContent = product.marca ? product.marca : '';

      const name = document.createElement('h2');
      name.className = 'card-name';
      name.textContent = product.nombre;

      const meta = document.createElement('p');
      meta.className = 'card-meta';
      const tipo = document.createElement('span');
      tipo.textContent = product.tipo;
      const divider = document.createElement('span');
      divider.className = 'divider';
      divider.textContent = product.presentacion;
      meta.append(tipo, divider);

      const desc = document.createElement('p');
      desc.className = 'card-desc';
      desc.textContent = product.descripcion;

      body.append(brand,name, meta, desc);
      card.append(image, body);

      return card;
    }
  }

  global.NEEXXO = global.NEEXXO || {};
  global.NEEXXO.Catalog = Catalog;
})(window);
