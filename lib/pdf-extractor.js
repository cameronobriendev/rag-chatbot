import pdfParse from 'pdf-parse';

/**
 * PDF Text Extraction Utility
 *
 * Extracts text from PDF files using pdf-parse
 */

/**
 * Extract text from PDF buffer
 *
 * @param {Buffer} pdfBuffer - PDF file as buffer
 * @returns {Promise<{text: string, pages: number, info: object}>}
 */
export async function extractTextFromPDF(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);

    return {
      text: data.text,
      pages: data.numpages,
      info: data.info || {}
    };
  } catch (error) {
    console.error('[PDF Extractor] Error extracting text:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extract text from PDF file (from Blob/File)
 *
 * @param {File|Blob} file - PDF file
 * @returns {Promise<{text: string, pages: number, info: object}>}
 */
export async function extractTextFromPDFFile(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return await extractTextFromPDF(buffer);
  } catch (error) {
    console.error('[PDF Extractor] Error reading PDF file:', error);
    throw new Error('Failed to read PDF file');
  }
}

/**
 * Validate PDF file
 *
 * @param {File|Blob} file - File to validate
 * @returns {{valid: boolean, error: string|null}}
 */
export function validatePDF(file) {
  // Check file type
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'File must be a PDF' };
  }

  // Check file size (max 10MB for demo, adjust as needed)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'PDF file too large (max 10MB)' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'PDF file is empty' };
  }

  return { valid: true, error: null };
}
