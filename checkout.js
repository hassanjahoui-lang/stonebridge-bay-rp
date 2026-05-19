// ====== CARICA CARRELLO ======
let cart = JSON.parse(localStorage.getItem("cartData") || "[]");

// ====== ELEMENTI DOM ======
const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const payNowBtn = document.getElementById("payNowBtn");
const payAmount = document.getElementById("payAmount");
const paypalContainer = document.getElementById("paypal-button-container");

// ====== RENDER CHECKOUT ======
function renderCheckout() {
  checkoutItems.innerHTML = "";

  if (cart.length === 0) {
    checkoutItems.innerHTML = `<p style="color:#9ca3af;">Il carrello è vuoto.</p>`;
    checkoutTotal.textContent = "0.00";
    payAmount.textContent = "0.00";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>Quantità: ${item.qty}</p>
      <p>Prezzo: € ${item.price.toFixed(2)}</p>
    `;
    checkoutItems.appendChild(div);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  checkoutTotal.textContent = total.toFixed(2);
  payAmount.textContent = total.toFixed(2);
}

renderCheckout();

// ====== MOSTRA PAYPAL QUANDO CLICCHI "PAGA ORA" ======
payNowBtn.addEventListener("click", () => {
  payNowBtn.style.display = "none";
  paypalContainer.style.display = "block";

  // Focus automatico su PayPal
  setTimeout(() => {
    const paypalFrame = document.querySelector("#paypal-button-container iframe");
    if (paypalFrame) paypalFrame.contentWindow.focus();
  }, 500);
});

// ====== PAYPAL ======
paypal.Buttons({
  createOrder: function (data, actions) {
    const total = checkoutTotal.textContent;

    return actions.order.create({
      purchase_units: [{
        amount: { value: total },
        description: "Acquisto Stonebridge Bay RP"
      }]
    });
  },

  // 🔥 DOPO IL PAGAMENTO → success.html
  onApprove: function (data, actions) {
    return actions.order.capture().then(function (details) {

      // Invia dati al server (opzionale)
      fetch("webhook.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, paypal: details })
      });

      // Pulisci carrello
      localStorage.removeItem("cartData");

      // Redirect automatico
      window.location.href = "success.html";
    });
  },

  // 🔥 SE ANNULLI → cancel.html
  onCancel: function () {
    window.location.href = "cancel.html";
  },

  onError: function (err) {
    console.error(err);
    alert("Errore durante il pagamento.");
  }
}).render("#paypal-button-container");
