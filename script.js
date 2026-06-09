const productPlan = document.getElementById("productPlan");
const quantity = document.getElementById("quantity");
const totalPrice = document.getElementById("totalPrice");
const checkoutForm = document.getElementById("checkoutForm");

function getCurrentTotal() {
  const selectedOption = productPlan.options[productPlan.selectedIndex];
  const price = Number(selectedOption.dataset.price);
  const qty = Number(quantity.value || 1);
  return price * qty;
}

function updateTotal() {
  const total = getCurrentTotal();
  totalPrice.textContent = `NT$${total.toLocaleString("zh-TW")}`;
}

productPlan.addEventListener("change", updateTotal);
quantity.addEventListener("input", updateTotal);

checkoutForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(checkoutForm);

  const payload = {
    productPlan: formData.get("productPlan"),
    quantity: Number(formData.get("quantity")),
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    lineId: formData.get("lineId"),
    address: formData.get("address"),
    invoice: formData.get("invoice"),
    note: formData.get("note"),
    amount: getCurrentTotal()
  };

  try {
    const response = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!result.success) {
      alert(result.message || "建立訂單失敗");
      return;
    }

    alert(`訂單建立成功：${result.order.orderNo}`);
    console.log(result.order);

  } catch (error) {
    console.error(error);
    alert("系統錯誤，請稍後再試");
  }
});

updateTotal();
