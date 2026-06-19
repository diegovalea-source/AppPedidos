const providers = [
  {
    id: "delgado",
    name: "Delgado",
    type: "Agua",
    whatsappNumber: "34677425298",
    products: [
      { id: "Solan1L", name: "Solan 1L", unit: "cajas" },
      { id: "Solan1/2L", name: "Solan 0,5L", unit: "cajas" },
      { id: "SanPellegrino", name: "San Pellegrino 0,5L", unit: "cajas" },
      
    ]
  },
  {
    id: "cocacola",
    name: "Coca cola",
    type: "Bebidas",
    whatsappNumber: "34677947273",
    products: [
      { id: "Cocacola", name: "Coca cola normal", unit: "caja" },
      { id: "CocacolaZero", name: "Coca cola zero", unit: "caja" },
      { id: "CocacolaLight", name: "Coca cola light", unit: "caja" },
      { id: "CocacolaZeroZero", name: "Coca cola zero zero", unit: "caja" },
      { id: "AquariusLimon", name: "Aquarius limón", unit: "caja" },
      { id: "AquariusNaranja", name: "Aquarius Naranja", unit: "caja" },
      { id: "Sprite", name: "Sprite", unit: "caja" },
      { id: "Fuze", name: "Fuze tea", unit: "caja" },
      { id: "FantaLimon", name: "Fanta limón", unit: "caja" },
      { id: "FantaNaranja", name: "Fanta naranja", unit: "caja" },
      { id: "Bitter", name: "Bitter", unit: "caja" },
      { id: "Cocacola2l", name: "Coca cola 2L", unit: "caja" },
      { id: "FantaLimon1l", name: "Fanta limón 1L", unit: "caja" },
    ]
  },
   {
    id: "tonica",
    name: "Schweppes",
    type: "Bebidas",
    whatsappNumber: "34608628023",
    products: [
      { id: "Tonica", name: "Sch tónica premium", unit: "caja" },
      { id: "GingerAle", name: "Sch ginger ale premium", unit: "caja" },
      { id: "Limon", name: "Sch limón premium", unit: "caja" },
      { id: "Naranja", name: "Sch naranja premium", unit: "caja" },
      { id: "Soda", name: "SCh soda premium", unit: "caja" },
      { id: "Casera1/2L", name: "La casera 0,5L", unit: "caja" },
      { id: "Casera1L", name: "La casera 1L PET", unit: "caja" },
     
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
