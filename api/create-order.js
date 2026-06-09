export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
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
    } = req.body || {};

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
      createdAt: now.toISOString(),
      orderNo,
      productPlan,
      quantity,
      amount,
      customerName,
      phone,
      email,
      lineId: lineId || "",
      address,
      invoice: invoice || "",
      note: note || "",
      status: "pending"
    };

    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!googleScriptUrl) {
      return res.status(500).json({
        success: false,
        message: "尚未設定 GOOGLE_SCRIPT_URL"
      });
    }

    const googleResponse = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(order)
    });

    const googleText = await googleResponse.text();

    if (!googleResponse.ok) {
      console.error("Google Apps Script Error:", googleText);

      return res.status(500).json({
        success: false,
        message: "Google Sheets 寫入失敗"
      });
    }

    return res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "系統錯誤，請稍後再試"
    });
  }
}
