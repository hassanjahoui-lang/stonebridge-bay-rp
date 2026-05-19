// ====== PRODOTTI SHOP ======
const products = [
  {id:1,name:"VIP Bronze",desc:"Accesso prioritario + bonus RP",price:5, img:"img/vipb.png", tag:"VIP"},
  {id:2,name:"VIP Gold",desc:"Veicolo + casa + bonus",price:15, img:"img/vipg.webp", tag:"VIP"},
  {id:3,name:"Veicolo bit",desc:"Auto unica",price:8, img:"img/autobit.webp", tag:"Vehicle"},
  {id:4,name:"Casa Lusso",desc:"Villa vista mare",price:20, img:"img/villa.webp", tag:"VIP,Property"},
  {id:5,name:"Gang custom",desc:"Gang personalizata a 360 gradi",price:20, img:"img/gang.png", tag:"Vehicle"},
  {id:6,name:"Whitelist",desc:"Accesso immediato al server",price:49, img:"img/whitelist.png", tag:"Access"}
];

let cart = [];

// ====== ELEMENTI DOM ======
const productGrid = document.getElementById("productGrid");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const rpIdInput = document.getElementById("rpId");

// ====== RENDER PRODOTTI ======
function renderProducts() {
  productGrid.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="product-meta">
        <span class="product-price">€ ${p.price.toFixed(2)}</span>
        <span class="product-tag">${p.tag}</span>
      </div>
      <button class="btn-primary" onclick="addToCart(${p.id})">Aggiungi</button>
    `;
    productGrid.appendChild(card);
  });
}

// ====== CARRELLO ======
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="color:#9ca3af;font-size:0.85rem;">Il carrello è vuoto.</p>`;
  } else {
    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          <small>Qt: ${item.qty}</small>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
      `;
      cartItemsContainer.appendChild(row);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = count;

  localStorage.setItem("cartData", JSON.stringify(cart));
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });

  renderCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  renderCart();
}

// ====== APERTURA/CHIUSURA CARRELLO ======
function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("open");
}

function closeCartSidebar() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("open");
}

cartToggle.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartSidebar);
cartOverlay.addEventListener("click", closeCartSidebar);

// ====== BOTTONE CHECKOUT ======
document.getElementById("goCheckout").addEventListener("click", () => {
  window.location.href = "checkout.html";
});

// ====== INIT ======
const savedCart = JSON.parse(localStorage.getItem("cartData") || "[]");
cart = savedCart;
renderProducts();
renderCart();
