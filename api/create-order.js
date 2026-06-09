export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  const {
    productPlan,
    quantity,
    customerName,
    phone,
    email,
    lineId,
    address,
    invoice,
    note,
    amount
  } = req.body;

  if (!productPlan || !quantity || !customerName || !phone || !email || !address || !amount) {
    return res.status(400).json({
      success: false,
      message: "缺少必要欄位"
    });
  }

  const now = new Date();

  const orderNo =
    "MODOI" +
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const order = {
    orderNo,
    productPlan,
    quantity,
    amount,
    customerName,
    phone,
    email,
    lineId,
    address,
    invoice,
    note,
    status: "pending",
    createdAt: now.toISOString()
  };

  return res.status(200).json({
    success: true,
    order
  });
}
