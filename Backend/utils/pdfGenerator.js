const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const createPDF = async (transcription, summary) => {
    return new Promise((resolve, reject) => {
        try {
            // Create a PDF document
            const doc = new PDFDocument();
            
            // Generate a unique filename
            const filename = `transcription-${Date.now()}.pdf`;
            const filepath = path.join(__dirname, '../uploads/transcriptions', filename);
            
            // Create the uploads directory if it doesn't exist
            const uploadsDir = path.join(__dirname, '../uploads/transcriptions');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            
            // Pipe the PDF to a file
            doc.pipe(fs.createWriteStream(filepath));
            
            // Add content to the PDF
            doc.fontSize(20).text('Video Transcription and Summary', { align: 'center' });
            doc.moveDown();
            
            // Add transcription
            doc.fontSize(16).text('Transcription');
            doc.moveDown();
            doc.fontSize(12).text(transcription);
            doc.moveDown();
            
            // Add summary
            doc.fontSize(16).text('Summary');
            doc.moveDown();
            doc.fontSize(12).text(summary);
            
            // Finalize the PDF
            doc.end();
            
            // Return the relative path to the PDF
            resolve(`/uploads/transcriptions/${filename}`);
        } catch (error) {
            console.error('Create PDF error:', error);
            reject(new Error('Failed to create PDF'));
        }
    });
};

module.exports = {
    createPDF
};