// Sample product data
const products = [
  {id: 1, name: "Laptop", price: 799},
  {id: 2, name: "Smartphone", price: 499},
  {id: 3, name: "Headphones", price: 99},
  {id: 4, name: "Smartwatch", price: 149}
];

let cart = [];

const productsDiv = document.getElementById("products");
const cartItems = document.getElementById("cartItems");
const total = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");
const itemCount = document.getElementById("itemCount");

// Display products
products.forEach(product => {
  const div = document.createElement("div");
  div.className = "product";
  div.innerHTML = `
    <h3>${product.name}</h3>
    <p>Price: $${product.price}</p>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;
  productsDiv.appendChild(div);
});

// Add to cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  updateCart();
}

// Update cart display
function updateCart() {
  cartItems.innerHTML = "";
  let totalPrice = 0;
  cart.forEach((item, index) => {
    totalPrice += item.price;
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => removeFromCart(index);
    li.appendChild(removeBtn);
    cartItems.appendChild(li);
  });
  total.textContent = totalPrice;
  itemCount.textContent = `(${cart.length} items)`;
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Checkout
checkoutBtn.addEventListener("click", () => {
  if(cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert(`Thank you for your purchase! Total: $${total.textContent}`);
  cart = [];
  updateCart();
});
