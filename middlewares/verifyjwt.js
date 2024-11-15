const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const User = require('../schema/signupschema');
require('dotenv').config();


const key = process.env.JWT_SECRET;

async function verifyjwt(req, res, next) {
    const head = req.headers['authorization'];
    if (!head) {
        return res.status(400).json({ msg: "Token not found" });
    }

    const jwt_token = head.split(' ')[1];
    try {
        const users = jwt.verify(jwt_token, key);
        req.user = users;

        // Fetch user data from MongoDB
        const userData = await User.findOne({ Email: users.Email });
        if (!userData) {
            return res.status(404).json({ msg: 'User not found' });
        }

        console.log('User Data:', userData);

        // Generate the PDF with QR code
        await generateStyledTicketPDF(userData);
        
        // Send the email with the generated PDF
        await sendEmailWithPdf('test.pdf', userData.Email);

        next();
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: "Internal server error" });
    }
}

// Helper function to generate PDF with QR Code
async function generateStyledTicketPDF(userData) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 500]);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const clubHeading = 'Coding Club';
    const title = 'InnoFusion Event';
    const eventDetails = '24 February 2024 at 10:00 am – 25 February 2024 at 6:00 pm';
    const venue = 'Seminar Hall, C Wing, 2nd Floor';
    const ticketType = 'Individual Entry';
    const ticketPrice = 'INR 50';
    const orderedBy = userData.Name || 'Unknown';
    const orderNo = '2VRG-FNPK-42R';
    const orderDate = '17-Feb-2024';
    const ticketNo = '2VRG-FNPK-42R1P';
    const note = 'This is your event ticket. Ticket holders must present their tickets on entry.\nYou can either print your ticket or present this digital version.\nIf you have any questions or issues, contact the event host.\nNo refunds will be initiated once tickets are booked.\nLooking forward to seeing you there!';

    page.drawText(clubHeading, { x: 200, y: 460, size: 28, font: boldFont, color: rgb(0.2, 0.4, 0.8) });
    page.drawText(title, { x: 195, y: 430, size: 22, font: boldFont, color: rgb(0.5, 0.2, 0.2) });

    const rectangleYStart = 295;
    const rectangleHeight = 120;
    page.drawRectangle({
        x: 50,
        y: rectangleYStart,
        width: 500,
        height: rectangleHeight,
        color: rgb(0.95, 0.95, 0.95),
    });

    const rowHeight = 25;
    const leftColumnX = 90;
    const rightColumnX = 180;
    const startY = rectangleYStart + rectangleHeight - 40;
    
    page.drawText('Event Date:', { x: leftColumnX, y: startY, size: 12, font: boldFont, color: rgb(0, 0, 0) });
    page.drawText(eventDetails, { x: rightColumnX, y: startY, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });

    page.drawText('Venue:', { x: leftColumnX, y: startY - rowHeight, size: 12, font: boldFont, color: rgb(0, 0, 0) });
    page.drawText(venue, { x: rightColumnX, y: startY - rowHeight, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });

    page.drawText('Ticket Type:', { x: leftColumnX, y: startY - rowHeight * 2, size: 12, font: boldFont, color: rgb(0, 0, 0) });
    page.drawText(`${ticketType} – ${ticketPrice}`, { x: rightColumnX, y: startY - rowHeight * 2, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });

    page.drawText(`Ordered by: ${orderedBy}`, { x: 50, y: 250, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
    page.drawText(`Order No: ${orderNo}`, { x: 50, y: 230, size: 12, font: boldFont, color: rgb(0, 0, 0) });
    page.drawText(`Order Date: ${orderDate}`, { x: 50, y: 210, size: 12, font: timesRomanFont, color: rgb(0, 0, 0) });
    page.drawText(`Ticket No: ${ticketNo}`, { x: 50, y: 190, size: 12, font: boldFont, color: rgb(0, 0, 0) });

    page.drawText(note, { x: 50, y: 120, size: 10, font: timesRomanFont, color: rgb(0.1, 0.1, 0.1), lineHeight: 15 });

    const qrCodeData = JSON.stringify({
        email: userData.Email,
        sapid: userData.SAP,
    });
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);
    const qrCodeImage = await pdfDoc.embedPng(qrCodeDataURL);
    const qrCodeDimensions = qrCodeImage.scale(0.8);

    page.drawImage(qrCodeImage, {
        x: 450,
        y: 50,
        width: qrCodeDimensions.width,
        height: qrCodeDimensions.height,
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('test.pdf', pdfBytes);
}

async function sendEmailWithPdf(pdfFilePath, recipientEmail) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jayupmaster8@gmail.com',
            pass: 'sqxu iesk tgtv nscz', 
        },
    });

    const mailOptions = {
        from: 'jayupmaster8@gmail.com',
        to: recipientEmail,
        subject: 'Event Details and QR Code',
        text: 'Please find the event details and QR code attached as a PDF.',
        attachments: [
            {
                filename: 'event_details.pdf',
                path: pdfFilePath,
                contentType: 'application/pdf',
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = verifyjwt;
