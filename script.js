// script.js
const form = document.getElementById("expense-form");
const title = document.getElementById("title");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const category = document.getElementById("category");
const list = document.getElementById("expense-list");
const total = document.getElementById("total");
const filter = document.getElementById("filter-category");
const sortOrder = document.getElementById("sort-order");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function renderExpenses() {
  let filtered = [...expenses];

  if (filter.value !== "All") {
    filtered = filtered.filter((e) => e.category === filter.value);
  }

  if (sortOrder.value === "latest") {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  list.innerHTML = "";
  let totalAmount = 0;

  filtered.forEach((e, index) => {
    totalAmount += e.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="expense-info">
        <strong>${e.title}</strong>
        <span>₹${e.amount.toFixed(2)} • ${e.category}</span>
        <span>${e.date}</span>
      </div>
      <button class="delete" onclick="deleteExpense(${index})">Delete</button>
    `;
    list.appendChild(li);
  });

  total.textContent = totalAmount.toFixed(2);
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
}

amount.addEventListener("keypress", function (e) {
  if (["-", "e", "E", "+"].includes(e.key)) {
    e.preventDefault();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newExpense = {
    title: title.value.trim(),
    amount: parseFloat(amount.value),
    date: date.value,
    category: category.value,
  };

  if (
    !newExpense.title ||
    isNaN(newExpense.amount) ||
    newExpense.amount <= 0 ||
    !newExpense.date
  ) {
    alert("Please enter a valid expense with positive amount.");
    return;
  }

  expenses.push(newExpense);
  saveExpenses();
  renderExpenses();
  form.reset();
});

filter.addEventListener("change", renderExpenses);
sortOrder.addEventListener("change", renderExpenses);

themeToggle.addEventListener("click", () => {
  const current = body.getAttribute("data-theme");
  const newTheme = current === "light" ? "dark" : "light";
  body.setAttribute("data-theme", newTheme);
  themeToggle.innerHTML = `<i class="ri-${
    newTheme === "dark" ? "moon" : "sun"
  }-line"></i>`;
});

renderExpenses();
