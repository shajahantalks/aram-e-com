import { Order } from '../types';
import { formatCurrency } from '../services/storageService';

export function openPrintableInvoice(order: Order) {
  const invoiceHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Tax Invoice - ${order.orderNumber} - Aram Brand</title>
    <meta charset="utf-8" />
    <style>
      body {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        color: #261611;
        margin: 0;
        padding: 30px;
        background: #fff;
      }
      .invoice-box {
        max-width: 800px;
        margin: auto;
        border: 2px solid #800020;
        padding: 30px;
        border-radius: 8px;
        position: relative;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #D97706;
        padding-bottom: 20px;
        margin-bottom: 24px;
      }
      .brand-title {
        font-size: 28px;
        font-weight: 800;
        color: #800020;
        letter-spacing: 1px;
      }
      .brand-tamil {
        font-size: 16px;
        color: #B45309;
        font-weight: 600;
      }
      .invoice-title {
        text-align: right;
      }
      .invoice-title h2 {
        margin: 0;
        color: #800020;
        font-size: 22px;
      }
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 25px;
      }
      .info-block h4 {
        margin: 0 0 6px 0;
        color: #800020;
        font-size: 14px;
        text-transform: uppercase;
      }
      .info-block p {
        margin: 2px 0;
        font-size: 13px;
        line-height: 1.4;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      th {
        background-color: #FDF4E7;
        color: #800020;
        font-weight: 700;
        padding: 10px;
        text-align: left;
        border-bottom: 2px solid #D97706;
        font-size: 13px;
      }
      td {
        padding: 10px;
        border-bottom: 1px solid #E5E7EB;
        font-size: 13px;
      }
      .totals {
        margin-left: auto;
        width: 320px;
        margin-top: 15px;
      }
      .totals table td {
        padding: 6px 10px;
      }
      .grand-total {
        font-weight: 800;
        font-size: 16px;
        color: #800020;
        border-top: 2px solid #D97706;
      }
      .seal {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }
      .stamp-box {
        border: 2px dashed #B45309;
        padding: 10px 16px;
        border-radius: 6px;
        text-align: center;
        color: #800020;
        font-size: 12px;
        display: inline-block;
      }
      .kural-quote {
        margin-top: 30px;
        padding-top: 15px;
        border-top: 1px dashed #D97706;
        text-align: center;
        font-size: 12px;
        color: #78350F;
        font-style: italic;
      }
      @media print {
        body { padding: 0; }
        .no-print { display: none; }
      }
    </style>
  </head>
  <body>
    <div class="no-print" style="text-align: center; margin-bottom: 20px;">
      <button onclick="window.print()" style="background: #800020; color: white; border: none; padding: 10px 24px; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer;">
        🖨️ Print / Save as PDF
      </button>
    </div>
    <div class="invoice-box">
      <div class="header">
        <div>
          <div class="brand-title">ARAM BRAND</div>
          <div class="brand-tamil">அறம் பிராண்ட் • Pure Tamil Heritage & Temple Crafts</div>
          <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">
            Heritage Center, 108 Raja Veedhi, Near East Gopuram, Madurai - 625001, TN<br/>
            GSTIN: 33AAACA1234F1Z8 | FSSAI: 12423008000122 | Phone: +91 98400 12345
          </p>
        </div>
        <div class="invoice-title">
          <h2>TAX INVOICE</h2>
          <p style="margin: 4px 0; font-size: 13px;"><b>Invoice No:</b> INV-${order.orderNumber.replace('ARAM-', '')}</p>
          <p style="margin: 2px 0; font-size: 13px;"><b>Date:</b> ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          <p style="margin: 2px 0; font-size: 13px;"><b>Payment:</b> ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})</p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-block">
          <h4>Billed & Shipped To:</h4>
          <p><b>${order.shippingAddress.fullName}</b></p>
          <p>${order.shippingAddress.street}</p>
          ${order.shippingAddress.landmark ? `<p>Landmark: ${order.shippingAddress.landmark}</p>` : ''}
          <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
          <p>Phone: ${order.shippingAddress.phone}</p>
          <p>Email: ${order.shippingAddress.email}</p>
        </div>
        <div class="info-block">
          <h4>Order Logistics Details:</h4>
          <p><b>Order ID:</b> ${order.orderNumber}</p>
          <p><b>Courier:</b> ${order.courierName || 'DTDC Temple Express'}</p>
          <p><b>AWB Tracking:</b> ${order.trackingNumber || 'Assigned post packing'}</p>
          <p><b>Status:</b> ${order.orderStatus.replace('_', ' ').toUpperCase()}</p>
          ${order.razorpayPaymentId ? `<p><b>Razorpay Txn ID:</b> ${order.razorpayPaymentId}</p>` : ''}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Item Description</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>
                <b>${item.productName}</b><br/>
                <span style="font-size: 11px; color: #888;">${item.productNameTa || ''}</span>
              </td>
              <td style="text-align: center;">${item.quantity}</td>
              <td style="text-align: right;">${formatCurrency(item.price)}</td>
              <td style="text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr>
            <td>Subtotal:</td>
            <td style="text-align: right;">${formatCurrency(order.subtotal)}</td>
          </tr>
          ${
            order.discount > 0
              ? `
          <tr>
            <td style="color: #059669;">Promo Discount:</td>
            <td style="text-align: right; color: #059669;">- ${formatCurrency(order.discount)}</td>
          </tr>
          `
              : ''
          }
          <tr>
            <td>Sacred Delivery Fee:</td>
            <td style="text-align: right;">${order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}</td>
          </tr>
          <tr>
            <td>GST (CGST 2.5% + SGST 2.5%):</td>
            <td style="text-align: right;">Included</td>
          </tr>
          <tr class="grand-total">
            <td>Grand Total:</td>
            <td style="text-align: right;">${formatCurrency(order.totalAmount)}</td>
          </tr>
        </table>
      </div>

      <div class="seal">
        <div class="stamp-box">
          <b>ARAM BRAND</b><br/>
          ★ CERTIFIED AUTHENTIC ★<br/>
          TEMPLE ARTS & HERITAGE
        </div>
        <div style="text-align: right; font-size: 12px;">
          <p>For Aram Brand Enterprises</p>
          <div style="height: 40px;"></div>
          <p><b>Authorized Signatory</b></p>
        </div>
      </div>

      <div class="kural-quote">
        "அறத்தான் வருவதே இன்பம்மற் றெல்லாம் புறத்த புகழும் இல."<br/>
        Thank you for supporting traditional Tamil artisans, temple sculptors, and heritage weavers!
      </div>
    </div>
  </body>
  </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  }
}
