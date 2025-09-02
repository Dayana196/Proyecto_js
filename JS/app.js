const productsContainer = document.getElementById("products");
const cartContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const cartPanel = document.getElementById("cart");
const cartBadge = document.querySelector(".cart-badge");
const cartIcon = document.getElementById("cart-icon");
const closeCartBtn = document.querySelector(".close-cart");

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Cargar productos desde FakeStore API
async function loadProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    products = await res.json();
    displayProducts(products);
    renderCart();
  } catch (error) {
    productsContainer.innerHTML = "<p>Error al cargar productos 😢</p>";
  }
}

// Mostrar productos
function displayProducts(items) {
  productsContainer.innerHTML = "";

  items.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <div class="product-info">
        <h3>${p.title}</h3>
        <p>$${p.price}</p>
        <button class="add-cart-btn" data-id="${p.id}">Agregar al carrito</button>
      </div>
    `;

    productsContainer.appendChild(card);
  });

  // evento agregar al carrito
  document.querySelectorAll(".add-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

// Agregar al carrito
function addToCart(id) {
  const product = products.find(p => p.id == id);
  const item = cart.find(p => p.id == id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCart();
}

// Renderizar carrito
function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p>$${item.price} x ${item.qty}</p>
        <p><strong>Total: $${(item.price * item.qty).toFixed(2)}</strong></p>
      </div>
      <button onclick="removeFromCart(${item.id})">❌</button>
    `;

    cartContainer.appendChild(li);
  });

  cartTotal.textContent = total.toFixed(2);
  cartBadge.textContent = cart.length;
  localStorage.setItem("cart", JSON.stringify(cart));
}


// Eliminar producto del carrito
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// Vaciar carrito
clearCartBtn.addEventListener("click", () => {
  cart = [];
  updateCart();
});

// Actualizar carrito
function updateCart() {
  renderCart();
}

// ----------------- Abrir / Cerrar Carrito ----------------- //
cartIcon.addEventListener("click", e => {
  e.preventDefault();
  cartPanel.classList.add("open"); // abrir
});

closeCartBtn.addEventListener("click", () => {
  cartPanel.classList.remove("open"); // cerrar
});

// Inicializar
loadProducts();