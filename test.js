const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const QRCode = require('qrcode');
const fs = require('fs');

async function generateStyledTicketPDF() {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage([600, 500]);

  // Load fonts
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Define content and positions
  const clubHeading = 'Coding Club';
  const title = 'InnoFusion Event';
  const eventDetails = '24 February 2024 at 10:00 am – 25 February 2024 at 6:00 pm';
  const venue = 'Seminar Hall, C Wing, 2nd Floor';
  const ticketType = 'Individual Entry';
  const ticketPrice = 'INR 50';
  const orderedBy = 'Krish Prajapati';
  const orderNo = '2VRG-FNPK-42R';
  const orderDate = '17-Feb-2024';
  const ticketNo = '2VRG-FNPK-42R1P';
  const note = 'This is your event ticket. Ticket holders must present their tickets on entry.\nYou can either print your ticket or present this digital version.\nIf you have any questions or issues, contact the event host.\nNo refunds will be initiated once tickets are booked.\nLooking forward to seeing you there!';

  // Add Club Heading (Centered)
  page.drawText(clubHeading, { x: 200, y: 460, size: 28, font: boldFont, color: rgb(0.2, 0.4, 0.8) }); // Blue color

  // Add Event Title (Centered)
  page.drawText(title, { x: 195, y: 430, size: 22, font: boldFont, color: rgb(0.5, 0.2, 0.2) }); // Dark red color
  
  // Create a larger rectangle for the table format for event details
  const rectangleYStart = 295;  // Lowered the rectangle position
  const rectangleHeight = 120;  // Increased height of rectangle for more space
  
  // Draw a larger rectangle
  page.drawRectangle({
    x: 50,
    y: rectangleYStart,
    width: 500,
    height: rectangleHeight,
    color: rgb(0.95, 0.95, 0.95), // Light grey background
  });

  // Center-align the text inside the rectangle
  const rowHeight = 25; // Adjusted row height for better spacing
  const leftColumnX = 90; // Shifted left column for better centering
  const rightColumnX = 180; // Shifted right column for better centering
  const startY = rectangleYStart + rectangleHeight - 40; // Adjusted Y-start for better alignment

  // Row 1 - Event Date (Centered in the rectangle)
  page.drawText('Event Date:', { x: leftColumnX, y: startY, size: 12, font: boldFont, color: rgb(0, 0, 0) });
  page.drawText(eventDetails, { x: rightColumnX, y: startY, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });

  // Row 2 - Venue (Centered in the rectangle)
  page.drawText('Venue:', { x: leftColumnX, y: startY - rowHeight, size: 12, font: boldFont, color: rgb(0, 0, 0) });
  page.drawText(venue, { x: rightColumnX, y: startY - rowHeight, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });

  // Row 3 - Ticket Type & Price (Centered in the rectangle)
  page.drawText('Ticket Type:', { x: leftColumnX, y: startY - rowHeight * 2, size: 12, font: boldFont, color: rgb(0, 0, 0) });
  page.drawText(`${ticketType} – ${ticketPrice}`, { x: rightColumnX, y: startY - rowHeight * 2, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });

  // Add the order and ticket details below the rectangle
  page.drawText(`Ordered by: ${orderedBy}`, { x: 50, y: 250, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
  page.drawText(`Order No: ${orderNo}`, { x: 50, y: 230, size: 12, font: boldFont, color: rgb(0, 0, 0) });
  page.drawText(`Order Date: ${orderDate}`, { x: 50, y: 210, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
  page.drawText(`Ticket No: ${ticketNo}`, { x: 50, y: 190, size: 12, font: boldFont, color: rgb(0, 0, 0) });

  // Add the note section below the order details
  page.drawText(note, { x: 50, y: 120, size: 10, font: timesRomanFont, color: rgb(0.1, 0.1, 0.1), lineHeight: 15 });

  // Generate QR Code
  const qrCodeDataURL = await QRCode.toDataURL('https://example.com/validate-ticket/2VRG-FNPK-42R1P');
  
  // Embed the QR code image into the PDF
  const qrCodeImage = await pdfDoc.embedPng(qrCodeDataURL);

  // Draw the QR code image on the page (Bottom-right corner)
  const qrCodeDimensions = qrCodeImage.scale(0.8);
  page.drawImage(qrCodeImage, {
    x: 450,
    y: 50,
    width: qrCodeDimensions.width,
    height: qrCodeDimensions.height,
  });

  // Save the document as a PDF
  const pdfBytes = await pdfDoc.save();

  // Write the PDF to a file
  fs.writeFileSync('StyledTicketWithQRCode.pdf', pdfBytes);
}

generateStyledTicketPDF();
