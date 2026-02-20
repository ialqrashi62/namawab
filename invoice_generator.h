#pragma once
// ============================================================
// Invoice Generator – ZATCA-compliant invoice with QR code
// Uses QPainter to render a professional Arabic/English invoice
// and QPrintPreviewDialog for print/PDF export.
// ============================================================

#include "qrcode.h"
#include <QApplication>
#include <QByteArray>
#include <QDate>
#include <QDateTime>
#include <QFont>
#include <QPainter>
#include <QSqlQuery>
#include <QString>
#include <QWidget>
#include <QtPrintSupport/QPrintPreviewDialog>
#include <QtPrintSupport/QPrinter>


struct InvoiceLineItem {
  int lineNo;
  QString descriptionAr;
  QString descriptionEn;
  QString barcode;
  double qty;
  double unitPrice;
  double taxableAmount;
  double vatAmount;
  double lineTotal;
};

struct InvoiceData {
  // Company info (seller)
  QString companyNameAr;
  QString companyNameEn;
  QString companyAddress;
  QString companyPhone;
  QString companyTaxNumber;
  QString companyCR;

  // Customer info
  QString customerName;
  QString customerAddress;
  QString customerVatNumber;

  // Invoice meta
  QString invoiceNumber;
  QDate invoiceDate;
  QString invoiceTitle;   // e.g. "فاتورة" or "عرض سعر"
  QString invoiceTitleEn; // e.g. "Invoice" or "Quote"

  // Line items
  QList<InvoiceLineItem> items;

  // Totals
  double subtotal;
  double totalVat;
  double grandTotal;
};

class InvoiceGenerator {
public:
  // Load company settings from DB
  static void loadCompanySettings(InvoiceData &inv) {
    auto getSetting = [](const QString &key) -> QString {
      QSqlQuery q;
      q.prepare(
          "SELECT setting_value FROM company_settings WHERE setting_key=?");
      q.addBindValue(key);
      q.exec();
      if (q.next())
        return q.value(0).toString();
      return "";
    };
    inv.companyNameAr = getSetting("company_name_ar");
    inv.companyNameEn = getSetting("company_name_en");
    inv.companyAddress = getSetting("address");
    inv.companyPhone = getSetting("phone");
    inv.companyTaxNumber = getSetting("tax_number");

    // Defaults if empty
    if (inv.companyNameAr.isEmpty())
      inv.companyNameAr = QString::fromUtf8(
          "\xd9\x85\xd8\xa4\xd8\xb3\xd8\xb3\xd8\xa9 "
          "\xd9\x86\xd9\x88\xd8\xb1\xd9\x87 "
          "\xd8\xa7\xd9\x84\xd9\x8a\xd8\xa7\xd9\x85\xd9\x8a "
          "\xd9\x84\xd9\x84\xd8\xaa\xd8\xac\xd8\xa7\xd8\xb1\xd8\xa9");
    if (inv.companyNameEn.isEmpty())
      inv.companyNameEn = "Noura AlYami Trading Establishment";
    if (inv.companyTaxNumber.isEmpty())
      inv.companyTaxNumber = "310705840600003";
    if (inv.companyAddress.isEmpty())
      inv.companyAddress = QString::fromUtf8(
          "8042, \xd8\xad\xd8\xb3\xd8\xa7\xd9\x86 \xd8\xa8\xd9\x86 "
          "\xd8\xab\xd8\xa7\xd8\xa8\xd8\xaa\xd8\x8c "
          "\xd8\xa7\xd9\x84\xd8\xb1\xd9\x8a\xd8\xa7\xd8\xb6");
    if (inv.companyCR.isEmpty())
      inv.companyCR = "7049411239";
  }

  // Build ZATCA TLV QR code data (5 mandatory fields)
  static QByteArray buildZatcaTlv(const InvoiceData &inv) {
    QByteArray tlv;
    auto addTag = [&tlv](uint8_t tag, const QByteArray &val) {
      tlv.append((char)tag);
      tlv.append((char)(uint8_t)val.size());
      tlv.append(val);
    };

    // Tag 1: Seller Name
    addTag(1, inv.companyNameAr.toUtf8());
    // Tag 2: VAT Registration Number
    addTag(2, inv.companyTaxNumber.toUtf8());
    // Tag 3: Timestamp
    QString ts = inv.invoiceDate.toString("yyyy-MM-dd") + "T" +
                 QDateTime::currentDateTime().toString("HH:mm:ss") + "Z";
    addTag(3, ts.toUtf8());
    // Tag 4: Invoice Total (with VAT)
    addTag(4, QString::number(inv.grandTotal, 'f', 2).toUtf8());
    // Tag 5: VAT Amount
    addTag(5, QString::number(inv.totalVat, 'f', 2).toUtf8());

    return tlv.toBase64();
  }

  // Generate next invoice number
  static QString nextInvoiceNumber() {
    QSqlQuery q;
    q.exec("SELECT COUNT(*) FROM invoices");
    int count = 0;
    if (q.next())
      count = q.value(0).toInt();
    return QString("INV-%1").arg(count + 1, 6, 10, QChar('0'));
  }

  // Show print preview dialog with the invoice
  static void showPrintPreview(const InvoiceData &inv,
                               QWidget *parent = nullptr) {
    QPrinter printer(QPrinter::HighResolution);
    printer.setPageSize(QPageSize(QPageSize::A4));
    printer.setPageOrientation(QPageLayout::Portrait);

    QPrintPreviewDialog preview(&printer, parent);
    preview.setWindowTitle(inv.invoiceTitleEn + " - " + inv.invoiceNumber);
    preview.resize(900, 700);

    QObject::connect(&preview, &QPrintPreviewDialog::paintRequested,
                     [&inv](QPrinter *p) { renderInvoice(p, inv); });

    preview.exec();
  }

  // Main rendering function
  static void renderInvoice(QPrinter *printer, const InvoiceData &inv) {
    QPainter p(printer);
    if (!p.isActive())
      return;

    QRect pageRect = printer->pageRect(QPrinter::DevicePixel).toRect();
    int W = pageRect.width();
    int H = pageRect.height();
    int margin = W / 20;
    int contentW = W - 2 * margin;

    // Scale factor for fonts (high-res printing)
    double sf = W / 2480.0; // normalize to ~A4 at 300dpi

    // Colors
    QColor headerBg(55, 65, 81); // dark gray
    QColor tableBorderColor(200, 200, 200);
    QColor tableHeaderBg(245, 245, 245);
    QColor accentColor(180, 150, 90); // gold accent

    // Fonts
    QFont fontTitleAr("Arial", (int)(24 * sf));
    fontTitleAr.setBold(true);
    QFont fontTitleEn("Arial", (int)(20 * sf));
    fontTitleEn.setBold(true);
    QFont fontHeader("Arial", (int)(10 * sf));
    fontHeader.setBold(true);
    QFont fontNormal("Arial", (int)(9 * sf));
    QFont fontSmall("Arial", (int)(7 * sf));
    QFont fontBold("Arial", (int)(9 * sf));
    fontBold.setBold(true);
    QFont fontBigTitle("Arial", (int)(18 * sf));
    fontBigTitle.setBold(true);

    int y = margin;

    // ========================
    // HEADER SECTION
    // ========================
    int headerH = (int)(120 * sf);

    // Company name (Arabic - right aligned)
    p.setFont(fontTitleAr);
    p.setPen(Qt::black);
    QRect arNameRect(margin + contentW / 2, y, contentW / 2, (int)(35 * sf));
    p.drawText(arNameRect, Qt::AlignRight | Qt::AlignVCenter,
               inv.companyNameAr);

    // Company name (English - left aligned)
    p.setFont(fontTitleEn);
    QRect enNameRect(margin, y, contentW / 2, (int)(35 * sf));
    p.drawText(enNameRect, Qt::AlignLeft | Qt::AlignVCenter, inv.companyNameEn);
    y += (int)(38 * sf);

    // Company details (Arabic right, English left)
    p.setFont(fontSmall);
    int lineH = (int)(14 * sf);

    // Address
    p.drawText(QRect(margin, y, contentW / 2, lineH), Qt::AlignLeft,
               inv.companyAddress);
    p.drawText(QRect(margin + contentW / 2, y, contentW / 2, lineH),
               Qt::AlignRight, inv.companyAddress);
    y += lineH;

    // Tax number
    p.drawText(QRect(margin, y, contentW / 2, lineH), Qt::AlignLeft,
               "VAT number " + inv.companyTaxNumber);
    p.drawText(
        QRect(margin + contentW / 2, y, contentW / 2, lineH), Qt::AlignRight,
        QString::fromUtf8(
            "\xd8\xb1\xd9\x82\xd9\x85 "
            "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb3\xd8\xac\xd9\x8a\xd9\x84 "
            "\xd8\xa7\xd9\x84\xd8\xb6\xd8\xb1\xd9\x8a\xd8\xa8\xd9\x8a ") +
            inv.companyTaxNumber);
    y += lineH;

    // CR number
    p.drawText(QRect(margin, y, contentW / 2, lineH), Qt::AlignLeft,
               "CR Number " + inv.companyCR);
    p.drawText(
        QRect(margin + contentW / 2, y, contentW / 2, lineH), Qt::AlignRight,
        QString::fromUtf8(
            "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd8\xb3\xd8\xac\xd9\x84 "
            "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xac\xd8\xa7\xd8\xb1\xd9\x8a ") +
            inv.companyCR);
    y += (int)(25 * sf);

    // Separator line
    p.setPen(QPen(accentColor, 2 * sf));
    p.drawLine(margin, y, margin + contentW, y);
    y += (int)(25 * sf);

    // ========================
    // INVOICE TITLE
    // ========================
    p.setFont(fontBigTitle);
    p.setPen(accentColor);
    QString fullTitle = inv.invoiceTitle + " " + inv.invoiceTitleEn;
    p.drawText(QRect(margin, y, contentW, (int)(35 * sf)), Qt::AlignCenter,
               fullTitle);
    y += (int)(45 * sf);

    // ========================
    // CUSTOMER INFO TABLE
    // ========================
    p.setPen(QPen(tableBorderColor, 1));
    int custH = (int)(22 * sf);
    int labelW = (int)(120 * sf);
    int valW = contentW / 2 - labelW;

    auto drawInfoRow = [&](const QString &labelEn, const QString &labelAr,
                           const QString &value, int rowY) {
      // Left: English label + value
      p.setPen(QPen(tableBorderColor, 1));
      p.drawRect(margin, rowY, labelW, custH);
      p.drawRect(margin + labelW, rowY, valW, custH);
      // Right: Arabic label
      p.drawRect(margin + contentW / 2, rowY, valW, custH);
      p.drawRect(margin + contentW / 2 + valW, rowY, labelW, custH);

      p.setPen(Qt::black);
      p.setFont(fontBold);
      p.drawText(QRect(margin + 4, rowY, labelW - 8, custH),
                 Qt::AlignLeft | Qt::AlignVCenter, labelEn);
      p.drawText(
          QRect(margin + contentW / 2 + valW + 4, rowY, labelW - 8, custH),
          Qt::AlignRight | Qt::AlignVCenter, labelAr);
      p.setFont(fontNormal);
      p.drawText(QRect(margin + labelW + 4, rowY, valW - 8, custH),
                 Qt::AlignLeft | Qt::AlignVCenter, value);
      p.drawText(QRect(margin + contentW / 2 + 4, rowY, valW - 8, custH),
                 Qt::AlignRight | Qt::AlignVCenter, value);
    };

    drawInfoRow(
        "Customer",
        QString::fromUtf8("\xd8\xa7\xd9\x84\xd8\xb9\xd9\x85\xd9\x8a\xd9\x84"),
        inv.customerName, y);
    y += custH;
    drawInfoRow("Address",
                QString::fromUtf8(
                    "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x86\xd9\x88\xd8\xa7\xd9\x86"),
                inv.customerAddress, y);
    y += custH;
    drawInfoRow("VAT number",
                QString::fromUtf8(
                    "\xd8\xb1\xd9\x82\xd9\x85 "
                    "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb3\xd8\xac\xd9\x8a\xd9\x84 "
                    "\xd8\xa7\xd9\x84\xd8\xb6\xd8\xb1\xd9\x8a\xd8\xa8\xd9\x8a"),
                inv.customerVatNumber, y);
    y += custH;

    // Number and Date row
    p.setPen(QPen(tableBorderColor, 1));
    p.drawRect(margin, y, labelW, custH);
    p.drawRect(margin + labelW, y, valW - labelW, custH);
    p.drawRect(margin + valW, y, labelW, custH);
    p.drawRect(margin + valW + labelW, y, contentW - valW - labelW, custH);

    p.setPen(Qt::black);
    p.setFont(fontBold);
    p.drawText(QRect(margin + 4, y, labelW - 8, custH),
               Qt::AlignLeft | Qt::AlignVCenter, "Number");
    p.setFont(fontNormal);
    p.drawText(QRect(margin + labelW + 4, y, valW - labelW - 8, custH),
               Qt::AlignLeft | Qt::AlignVCenter, inv.invoiceNumber);
    p.setFont(fontBold);
    p.drawText(QRect(margin + valW + 4, y, labelW - 8, custH),
               Qt::AlignLeft | Qt::AlignVCenter, "Date");
    p.setFont(fontNormal);
    p.drawText(QRect(margin + valW + labelW + 4, y,
                     contentW - valW - labelW - 8, custH),
               Qt::AlignLeft | Qt::AlignVCenter,
               inv.invoiceDate.toString("yyyy-MM-dd"));

    // Arabic labels on right side for number/date row
    p.setFont(fontBold);
    int rightStart = margin + contentW / 2 + valW;
    p.drawText(QRect(rightStart + 4, y, labelW - 8, custH),
               Qt::AlignRight | Qt::AlignVCenter,
               QString::fromUtf8(
                   "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae"));

    y += custH + (int)(20 * sf);

    // ========================
    // LINE ITEMS TABLE
    // ========================
    int colWidths[7];
    colWidths[0] = (int)(25 * sf); // #
    colWidths[6] = (int)(80 * sf); // Line amount
    colWidths[5] = (int)(70 * sf); // VAT amount
    colWidths[4] = (int)(85 * sf); // Taxable amount
    colWidths[3] = (int)(55 * sf); // Price
    colWidths[2] = (int)(40 * sf); // Qty
    colWidths[1] = contentW - colWidths[0] - colWidths[2] - colWidths[3] -
                   colWidths[4] - colWidths[5] - colWidths[6]; // Description

    int rowH = (int)(28 * sf);

    // Table header
    p.setBrush(tableHeaderBg);
    p.setPen(QPen(tableBorderColor, 1));
    int cx = margin;
    for (int c = 0; c < 7; c++) {
      p.drawRect(cx, y, colWidths[c], rowH);
      cx += colWidths[c];
    }

    // Header labels
    QString headerLabels[] = {
        "#",
        QString::fromUtf8(
            "\xd8\xa7\xd9\x84\xd9\x88\xd8\xb5\xd9\x81\nDescription"),
        QString::fromUtf8(
            "\xd8\xa7\xd9\x84\xd9\x83\xd9\x85\xd9\x8a\xd8\xa9\nQty"),
        QString::fromUtf8("\xd8\xa7\xd9\x84\xd8\xb3\xd8\xb9\xd8\xb1\nPrice"),
        QString::fromUtf8(
            "\xd8\xa7\xd9\x84\xd9\x85\xd8\xa8\xd9\x84\xd8\xba "
            "\xd8\xa7\xd9\x84\xd8\xae\xd8\xa7\xd8\xb6\xd8\xb9\nTaxable amount"),
        QString::fromUtf8("\xd8\xa7\xd9\x84\xd9\x82\xd9\x8a\xd9\x85\xd8\xa9 "
                          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb6\xd8\xa7\xd9\x81\xd8"
                          "\xa9\nVAT amount"),
        QString::fromUtf8("\xd8\xa7\xd9\x84\xd9\x85\xd8\xac\xd9\x85\xd9\x88\xd8"
                          "\xb9\nLine amount")};

    p.setFont(fontSmall);
    p.setPen(Qt::black);
    cx = margin;
    for (int c = 0; c < 7; c++) {
      p.drawText(QRect(cx + 2, y + 1, colWidths[c] - 4, rowH - 2),
                 int(Qt::AlignCenter) | int(Qt::TextWordWrap), headerLabels[c]);
      cx += colWidths[c];
    }
    y += rowH;
    p.setBrush(Qt::NoBrush);

    // Data rows
    for (const auto &item : inv.items) {
      int dataRowH = (int)(35 * sf);
      cx = margin;
      p.setPen(QPen(tableBorderColor, 1));
      for (int c = 0; c < 7; c++) {
        p.drawRect(cx, y, colWidths[c], dataRowH);
        cx += colWidths[c];
      }

      p.setPen(Qt::black);
      p.setFont(fontNormal);
      cx = margin;

      // #
      p.drawText(QRect(cx, y, colWidths[0], dataRowH), Qt::AlignCenter,
                 QString::number(item.lineNo));
      cx += colWidths[0];

      // Description
      QString desc = item.descriptionAr;
      if (!item.descriptionEn.isEmpty())
        desc += " " + item.descriptionEn;
      if (!item.barcode.isEmpty())
        desc += "\n" +
                QString::fromUtf8("\xd8\xb1\xd9\x82\xd9\x85 "
                                  "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xb1\xd9"
                                  "\x83\xd9\x88\xd8\xaf ") +
                item.barcode;
      p.drawText(QRect(cx + 4, y, colWidths[1] - 8, dataRowH),
                 int(Qt::AlignRight | Qt::AlignVCenter) | int(Qt::TextWordWrap),
                 desc);
      cx += colWidths[1];

      // Qty
      p.drawText(QRect(cx, y, colWidths[2], dataRowH), Qt::AlignCenter,
                 QString::number(item.qty, 'f', 0));
      cx += colWidths[2];

      // Price
      p.drawText(QRect(cx, y, colWidths[3], dataRowH), Qt::AlignCenter,
                 QString::number(item.unitPrice, 'f', 2));
      cx += colWidths[3];

      // Taxable amount
      p.drawText(QRect(cx, y, colWidths[4], dataRowH), Qt::AlignCenter,
                 QString::number(item.taxableAmount, 'f', 2));
      cx += colWidths[4];

      // VAT amount
      p.drawText(QRect(cx, y, colWidths[5], dataRowH), Qt::AlignCenter,
                 QString::number(item.vatAmount, 'f', 2));
      cx += colWidths[5];

      // Line amount
      p.drawText(QRect(cx, y, colWidths[6], dataRowH), Qt::AlignCenter,
                 QString::number(item.lineTotal, 'f', 2));

      y += dataRowH;
    }

    // ========================
    // TOTALS SECTION
    // ========================
    y += (int)(10 * sf);
    int totLabelW = (int)(200 * sf);
    int totValW = (int)(100 * sf);
    int totX = margin;
    int totRowH = (int)(24 * sf);

    auto drawTotalRow = [&](const QString &labelEn, const QString &labelAr,
                            double val, bool bold) {
      p.setFont(bold ? fontBold : fontNormal);
      p.setPen(Qt::black);
      // Currency symbol
      QString valStr = QString::number(val, 'f', 2);

      // SAR label
      p.drawText(QRect(totX, y, (int)(30 * sf), totRowH), Qt::AlignCenter,
                 QString::fromUtf8("\xd8\xb1.\xd8\xb3"));

      // Value
      p.drawText(QRect(totX + (int)(30 * sf), y, totValW, totRowH),
                 Qt::AlignRight | Qt::AlignVCenter, valStr);

      // Arabic label
      p.drawText(QRect(totX + (int)(30 * sf) + totValW + (int)(10 * sf), y,
                       totLabelW, totRowH),
                 Qt::AlignLeft | Qt::AlignVCenter, labelAr + " " + labelEn);

      y += totRowH;
    };

    drawTotalRow("Subtotal",
                 QString::fromUtf8(
                     "\xd8\xa7\xd9\x84\xd9\x85\xd8\xac\xd9\x85\xd9\x88\xd8\xb9 "
                     "\xd8\xa7\xd9\x84\xd9\x81\xd8\xb1\xd8\xb9\xd9\x8a"),
                 inv.subtotal, false);
    drawTotalRow(
        "Total VAT",
        QString::fromUtf8(
            "\xd8\xa5\xd8\xac\xd9\x85\xd8\xa7\xd9\x84\xd9\x8a "
            "\xd8\xb6\xd8\xb1\xd9\x8a\xd8\xa8\xd8\xa9 "
            "\xd8\xa7\xd9\x84\xd9\x82\xd9\x8a\xd9\x85\xd8\xa9 "
            "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9"),
        inv.totalVat, false);
    drawTotalRow(
        "Total",
        QString::fromUtf8(
            "\xd8\xa7\xd9\x84\xd9\x85\xd8\xac\xd9\x85\xd9\x88\xd8\xb9 "
            "\xd8\xb4\xd8\xa7\xd9\x85\xd9\x84 "
            "\xd8\xa7\xd9\x84\xd9\x82\xd9\x8a\xd9\x85\xd8\xa9 "
            "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9"),
        inv.grandTotal, true);

    // ========================
    // QR CODE (ZATCA)
    // ========================
    y += (int)(20 * sf);
    QByteArray qrData = buildZatcaTlv(inv);
    QImage qrImg = QrCode::encode(qrData, 4);

    int qrSize = (int)(140 * sf);
    // Draw QR on the right side
    int qrX = margin + contentW - qrSize;
    p.drawImage(QRect(qrX, y, qrSize, qrSize), qrImg);

    // Label under QR
    p.setFont(fontSmall);
    p.setPen(Qt::black);
    p.drawText(QRect(qrX, y + qrSize + 2, qrSize, (int)(12 * sf)),
               Qt::AlignCenter, QString::fromUtf8("ZATCA QR Code"));

    // ========================
    // FOOTER
    // ========================
    int footerY = H - margin - (int)(30 * sf);
    p.setPen(QPen(tableBorderColor, 1));
    p.drawLine(margin, footerY, margin + contentW, footerY);
    footerY += (int)(5 * sf);

    p.setFont(fontSmall);
    p.setPen(Qt::black);
    p.drawText(QRect(margin, footerY, contentW / 2, (int)(14 * sf)),
               Qt::AlignLeft, inv.companyNameEn);
    p.drawText(
        QRect(margin + contentW / 2, footerY, contentW / 4, (int)(14 * sf)),
        Qt::AlignCenter, "Page 1 of 1");
    p.drawText(
        QRect(margin + contentW * 3 / 4, footerY, contentW / 4, (int)(14 * sf)),
        Qt::AlignRight, inv.invoiceNumber);
    footerY += (int)(14 * sf);
    p.drawText(QRect(margin, footerY, contentW, (int)(12 * sf)), Qt::AlignLeft,
               inv.companyNameAr);

    p.end();
  }

  // ========================
  // HELPER: Create invoice for patient file opening
  // ========================
  static InvoiceData createFileOpeningInvoice(const QString &patientNameAr,
                                              const QString &patientNameEn,
                                              const QString &department,
                                              double amount,
                                              const QString &paymentMethod) {

    InvoiceData inv;
    loadCompanySettings(inv);

    inv.customerName = patientNameAr.isEmpty() ? patientNameEn : patientNameAr;
    inv.customerAddress = "";
    inv.customerVatNumber = "";

    inv.invoiceNumber = nextInvoiceNumber();
    inv.invoiceDate = QDate::currentDate();
    inv.invoiceTitle =
        QString::fromUtf8("\xd9\x81\xd8\xa7\xd8\xaa\xd9\x88\xd8\xb1\xd8\xa9");
    inv.invoiceTitleEn = "Invoice";

    // Single line item: file opening fee
    InvoiceLineItem item;
    item.lineNo = 1;
    item.descriptionAr =
        QString::fromUtf8(
            "\xd8\xb1\xd8\xb3\xd9\x88\xd9\x85 \xd9\x81\xd8\xaa\xd8\xad "
            "\xd9\x85\xd9\x84\xd9\x81 - ") +
        department;
    item.descriptionEn = "File Opening Fee - " + department;
    item.barcode = "";
    item.qty = 1;
    item.unitPrice = amount;
    item.taxableAmount = amount;
    item.vatAmount = amount * 0.15;
    item.lineTotal = amount + item.vatAmount;
    inv.items.append(item);

    inv.subtotal = amount;
    inv.totalVat = item.vatAmount;
    inv.grandTotal = item.lineTotal;

    return inv;
  }

  // ========================
  // HELPER: Create invoice for approved order
  // ========================
  static InvoiceData createOrderInvoice(const QString &patientName,
                                        const QString &orderDesc,
                                        const QString &orderType,
                                        double baseAmount, double vat,
                                        double total) {

    InvoiceData inv;
    loadCompanySettings(inv);

    inv.customerName = patientName;
    inv.customerAddress = "";
    inv.customerVatNumber = "";

    inv.invoiceNumber = nextInvoiceNumber();
    inv.invoiceDate = QDate::currentDate();
    inv.invoiceTitle =
        QString::fromUtf8("\xd9\x81\xd8\xa7\xd8\xaa\xd9\x88\xd8\xb1\xd8\xa9");
    inv.invoiceTitleEn = "Invoice";

    InvoiceLineItem item;
    item.lineNo = 1;
    item.descriptionAr = orderDesc;
    item.descriptionEn = orderType;
    item.barcode = "";
    item.qty = 1;
    item.unitPrice = baseAmount;
    item.taxableAmount = baseAmount;
    item.vatAmount = vat;
    item.lineTotal = total;
    inv.items.append(item);

    inv.subtotal = baseAmount;
    inv.totalVat = vat;
    inv.grandTotal = total;

    return inv;
  }
};
