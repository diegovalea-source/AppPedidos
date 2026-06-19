const providers = [
  {
    id: "frutas",
    name: "Frutas Hermanos Ruiz",
    type: "Fruta y verdura",
    whatsappNumber: "",
    products: [
      { id: "platano", name: "Platano", unit: "kg" },
      { id: "manzana", name: "Manzana golden", unit: "kg" },
      { id: "tomate", name: "Tomate ensalada", unit: "kg" },
      { id: "lechuga", name: "Lechuga", unit: "ud" },
      { id: "patata", name: "Patata", unit: "kg" }
    ]
  },
  {
    id: "bebidas",
    name: "Bebidas Norte",
    type: "Bebidas",
    whatsappNumber: "",
    products: [
      { id: "agua", name: "Agua 1,5 L", unit: "caja" },
      { id: "cola", name: "Refresco cola", unit: "caja" },
      { id: "limon", name: "Refresco limon", unit: "caja" },
      { id: "cerveza", name: "Cerveza", unit: "caja" },
      { id: "tonica", name: "Tonica", unit: "caja" }
    ]
  },
  {
    id: "limpieza",
    name: "Suministros Limpios",
    type: "Limpieza",
    whatsappNumber: "",
    products: [
      { id: "lavavajillas", name: "Lavavajillas", unit: "garrafa" },
      { id: "bolsas", name: "Bolsas basura", unit: "rollo" },
      { id: "papel", name: "Papel secamanos", unit: "paquete" },
      { id: "lejia", name: "Lejia", unit: "garrafa" },
      { id: "bayetas", name: "Bayetas", unit: "paquete" }
    ]
  }
];

const state = {
  selectedProviderId: providers[0].id,
  quantities: {},
  search: ""
};

const providerList = document.querySelector("#providerList");
const productList = document.querySelector("#productList");
const orderList = document.querySelector("#orderList");
const selectedProviderName = document.querySelector("#selectedProviderName");
const selectedProviderType = document.querySelector("#selectedProviderType");
const itemCount = document.querySelector("#itemCount");
const searchInput = document.querySelector("#searchInput");
const notesInput = document.querySelector("#notesInput");
const sendButton = document.querySelector("#sendButton");
const clearOrderButton = document.querySelector("#clearOrderButton");

function getSelectedProvider() {
  return providers.find((provider) => provider.id === state.selectedProviderId);
}

function getQuantity(productId) {
  return state.quantities[productId] || 0;
}

function setQuantity(productId, quantity) {
  const nextQuantity = Math.max(0, quantity);

  if (nextQuantity === 0) {
    delete state.quantities[productId];
  } else {
    state.quantities[productId] = nextQuantity;
  }

  render();
}

function getSelectedProducts() {
  const provider = getSelectedProvider();
  return provider.products
    .map((product) => ({ ...product, quantity: getQuantity(product.id) }))
    .filter((product) => product.quantity > 0);
}

function renderProviders() {
  providerList.innerHTML = "";

  providers.forEach((provider) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `provider-button${provider.id === state.selectedProviderId ? " active" : ""}`;
    button.innerHTML = `<strong>${provider.name}</strong><span>${provider.type}</span>`;
    button.addEventListener("click", () => {
      state.selectedProviderId = provider.id;
      state.quantities = {};
      state.search = "";
      searchInput.value = "";
      notesInput.value = "";
      render();
    });
    providerList.append(button);
  });
}

function renderProducts() {
  const provider = getSelectedProvider();
  const search = state.search.trim().toLowerCase();
  const products = provider.products.filter((product) => product.name.toLowerCase().includes(search));

  selectedProviderName.textContent = provider.name;
  selectedProviderType.textContent = provider.type;
  productList.innerHTML = "";

  if (products.length === 0) {
    productList.innerHTML = `<p class="empty-state">No hay productos con ese nombre.</p>`;
    return;
  }

  products.forEach((product) => {
    const quantity = getQuantity(product.id);
    const row = document.createElement("article");
    row.className = "product-row";
    row.innerHTML = `
      <div>
        <p class="product-name">${product.name}</p>
        <span class="product-meta">Unidad: ${product.unit}</span>
      </div>
      <div class="quantity-control" aria-label="Cantidad de ${product.name}">
        <button type="button" data-action="decrease" aria-label="Restar">-</button>
        <output>${quantity}</output>
        <button type="button" data-action="increase" aria-label="Sumar">+</button>
      </div>
    `;

    row.querySelector('[data-action="decrease"]').addEventListener("click", () => {
      setQuantity(product.id, quantity - 1);
    });
    row.querySelector('[data-action="increase"]').addEventListener("click", () => {
      setQuantity(product.id, quantity + 1);
    });
    productList.append(row);
  });
}

function renderOrder() {
  const selectedProducts = getSelectedProducts();
  const total = selectedProducts.reduce((sum, product) => sum + product.quantity, 0);

  itemCount.textContent = total;
  sendButton.disabled = selectedProducts.length === 0;
  orderList.innerHTML = "";

  if (selectedProducts.length === 0) {
    orderList.innerHTML = `<p class="empty-state">Añade productos para preparar el WhatsApp.</p>`;
    return;
  }

  selectedProducts.forEach((product) => {
    const row = document.createElement("article");
    row.className = "order-row";
    row.innerHTML = `
      <div>
        <p class="order-name">${product.name}</p>
        <span class="order-meta">${product.unit}</span>
      </div>
      <strong>${product.quantity}</strong>
    `;
    orderList.append(row);
  });
}

function buildMessage() {
  const provider = getSelectedProvider();
  const selectedProducts = getSelectedProducts();
  const lines = [
    `Hola, necesito hacer este pedido para ${provider.name}:`,
    "",
    ...selectedProducts.map((product) => `- ${product.quantity} ${product.unit} de ${product.name}`)
  ];
  const notes = notesInput.value.trim();

  if (notes) {
    lines.push("", `Nota: ${notes}`);
  }

  return lines.join("\n");
}

function sendByWhatsapp() {
  const provider = getSelectedProvider();
  const message = encodeURIComponent(buildMessage());
  const number = provider.whatsappNumber.replace(/\D/g, "");
  const phonePath = number ? `/${number}` : "";
  window.location.href = `https://wa.me${phonePath}?text=${message}`;
}

function render() {
  renderProviders();
  renderProducts();
  renderOrder();
}

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

sendButton.addEventListener("click", sendByWhatsapp);

clearOrderButton.addEventListener("click", () => {
  state.quantities = {};
  notesInput.value = "";
  render();
});

render();
