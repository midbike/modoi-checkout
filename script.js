const productPlan = document.getElementById("productPlan");
const quantity = document.getElementById("quantity");
const totalPrice = document.getElementById("totalPrice");
const checkoutForm = document.getElementById("checkoutForm");

function updateTotal() {
  const selectedOption = productPlan.options[productPlan.selectedIndex];
  const price = Number(selectedOption.dataset.price);
  const qty = Number(quantity.value || 1);
  const total = price * qty;

  totalPrice.textContent = `NT$${total.toLocaleString("zh-TW")}`;
}

productPlan.addEventListener("change", updateTotal);
quantity.addEventListener("input", updateTotal);

checkoutForm.addEventListener("submit", function (event) {
  event.preventDefault();

  alert("下一步會串接藍新 MPG API，目前先確認表單畫面。");
});

updateTotal();
