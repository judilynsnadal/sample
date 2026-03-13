// ========= DATA (Sample / Fake) =========
let products = [
  { id: 1, name: "Classic Milk Tea", category: "Milk Tea", price: 80, stock: 12, image: "https://via.placeholder.com/40" },
  { id: 2, name: "Wintermelon", category: "Milk Tea", price: 90, stock: 3, image: "https://via.placeholder.com/40" },
  { id: 3, name: "Mango Fruit Tea", category: "Fruit Tea", price: 100, stock: 20, image: "https://via.placeholder.com/40" },
  { id: 4, name: "Taro", category: "Milk Tea", price: 95, stock: 2, image: "https://via.placeholder.com/40" },
];

let orders = [
  { id: "ORD001", customer: "Anna", items: 2, total: 180, status: "Preparing" },
  { id: "ORD002", customer: "Ben", items: 1, total: 90, status: "Received" },
  { id: "ORD003", customer: "Claire", items: 3, total: 270, status: "Out for Delivery" },
];

let deliveries = [
  { order: "ORD003", rider: "John", progress: "50%", eta: "20 mins" }
];

// ========= NAVIGATION =========
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active-section"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.section).classList.add("active-section");
  });
});

// ========= DASHBOARD =========
function updateDashboard() {
  document.getElementById("statProductsVal").textContent = products.length;
  document.getElementById("statOrdersVal").textContent = orders.length;
  document.getElementById("statPendingVal").textContent = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;

  // Recent orders
  const tbody = document.querySelector("#recentOrdersTable tbody");
  tbody.innerHTML = "";
  orders.slice(-5).forEach(o => {
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${o.id}</td><td>${o.customer}</td><td>₱${o.total}</td><td>${o.status}</td>`;
    tbody.appendChild(tr);
  });

  // Low stock
  const lowStockList = document.getElementById("lowStockList");
  lowStockList.innerHTML = "";
  products.filter(p => p.stock < 5).forEach(p => {
    let li = document.createElement("li");
    li.textContent = `${p.name} — ${p.stock} left`;
    lowStockList.appendChild(li);
  });
}

// ========= INVENTORY =========
function renderProducts() {
  const tbody = document.querySelector("#productsTable tbody");
  tbody.innerHTML = "";
  products.forEach(p => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${p.image}" width="40"/></td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>₱${p.price}</td>
      <td>${p.stock}</td>
      <td>
        <button onclick="editProduct(${p.id})">✏️</button>
        <button onclick="deleteProduct(${p.id})">🗑️</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// ========= ORDERS =========
function renderOrders() {
  const tbody = document.querySelector("#ordersTable tbody");
  tbody.innerHTML = "";
  orders.forEach(o => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.customer}</td>
      <td>${o.items}</td>
      <td>₱${o.total}</td>
      <td>${o.status}</td>
      <td>
        <button onclick="updateOrderStatus('${o.id}')">Update</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// ========= DELIVERY =========
function renderDeliveries() {
  const tbody = document.querySelector("#deliveryTable tbody");
  tbody.innerHTML = "";
  deliveries.forEach(d => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.order}</td>
      <td>${d.rider}</td>
      <td>${d.progress}</td>
      <td>${d.eta}</td>
      <td><button onclick="showLocation('${d.order}')">View</button></td>`;
    tbody.appendChild(tr);
  });
}

// ========= REPORTS =========
function updateReports() {
  let totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  document.getElementById("totalRevenue").textContent = `₱${totalRevenue}`;

  let top = products.reduce((max, p) => p.stock < max.stock ? p : max, products[0]);
  document.getElementById("topProduct").textContent = top.name;
}

// ========= MODALS =========
function showModal(contentHTML) {
  document.getElementById("modalContent").innerHTML = contentHTML;
  document.getElementById("modalOverlay").classList.remove("hidden");
}
document.getElementById("modalClose").addEventListener("click", () => {
  document.getElementById("modalOverlay").classList.add("hidden");
});

// ========= PRODUCT ACTIONS =========
function editProduct(id) {
  const p = products.find(x => x.id === id);
  showModal(`<h2>Edit ${p.name}</h2>
    <p>Stock: ${p.stock}</p>
    <button onclick="increaseStock(${id})">+ Add Stock</button>`);
}
function increaseStock(id) {
  let p = products.find(x => x.id === id);
  p.stock += 5;
  renderProducts();
  updateDashboard();
  updateReports();
  document.getElementById("modalOverlay").classList.add("hidden");
}
function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  renderProducts();
  updateDashboard();
}

// ========= ORDER ACTIONS =========
function updateOrderStatus(orderId) {
  let o = orders.find(x => x.id === orderId);
  if (!o) return;
  const statuses = ["Received", "Preparing", "Out for Delivery", "Delivered"];
  let idx = statuses.indexOf(o.status);
  o.status = statuses[(idx + 1) % statuses.length];
  renderOrders();
  updateDashboard();
}

// ========= DELIVERY ACTIONS =========
function showLocation(orderId) {
  const delivery = deliveries.find(d => d.order === orderId);
  document.getElementById("locationInfo").textContent =
    `Order ${orderId} — Rider ${delivery.rider}, Progress: ${delivery.progress}, ETA: ${delivery.eta}`;
}

// ========= INIT =========
function init() {
  renderProducts();
  renderOrders();
  renderDeliveries();
  updateDashboard();
  updateReports();
}
init();
