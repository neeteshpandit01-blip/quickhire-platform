/**
 * Chat Content Filter
 * Filters sensitive information from chat messages to prevent payment bypass
 */

interface FilterResult {
  filtered: string;
  isFiltered: boolean;
  original: string;
}

export const filterSensitiveInfo = (message: string): FilterResult => {
  let filtered = message;
  let isFiltered = false;

  // Phone number patterns
  const phonePatterns = [
    /\b\d{10}\b/g, // 10 digit numbers
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, // Formatted phone numbers
    /\+\d{1,3}[-.\s]?\d{10}\b/g, // International format
    /\b\d{5}[-.\s]?\d{5}\b/g, // Indian format
  ];

  // UPI ID pattern
  const upiPattern = /\b[\w.-]+@[\w.-]+\b/g;

  // Email pattern (to prevent sharing personal emails)
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

  // Payment keywords and phrases
  const paymentKeywords = [
    'paytm',
    'phonepe',
    'gpay',
    'googlepay',
    'google pay',
    'whatsapp pay',
    'bank account',
    'account number',
    'ifsc',
    'qr code',
    'scan and pay',
    'scan code',
    'payment link',
    'pay me',
    'send money',
    'transfer money',
    'direct payment',
    'cash payment',
    'offline payment',
  ];

  // Filter phone numbers
  phonePatterns.forEach((pattern) => {
    if (pattern.test(filtered)) {
      filtered = filtered.replace(pattern, '[PHONE REDACTED]');
      isFiltered = true;
    }
  });

  // Filter UPI IDs
  if (upiPattern.test(filtered)) {
    filtered = filtered.replace(upiPattern, '[UPI ID REDACTED]');
    isFiltered = true;
  }

  // Filter emails (but allow domain-only mentions)
  const emailMatches = filtered.match(emailPattern);
  if (emailMatches) {
    emailMatches.forEach((email) => {
      // Don't filter if it's just a domain mention without username
      if (!email.startsWith('@')) {
        filtered = filtered.replace(email, '[EMAIL REDACTED]');
        isFiltered = true;
      }
    });
  }

  // Filter payment keywords
  paymentKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    if (regex.test(filtered)) {
      filtered = filtered.replace(regex, '[PAYMENT INFO REDACTED]');
      isFiltered = true;
    }
  });

  // Filter URLs that might be payment links
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urls = filtered.match(urlPattern);
  if (urls) {
    urls.forEach((url) => {
      const lowerUrl = url.toLowerCase();
      if (
        lowerUrl.includes('pay') ||
        lowerUrl.includes('payment') ||
        lowerUrl.includes('upi') ||
        lowerUrl.includes('wallet')
      ) {
        filtered = filtered.replace(url, '[PAYMENT LINK REDACTED]');
        isFiltered = true;
      }
    });
  }

  return {
    filtered,
    isFiltered,
    original: message,
  };
};

/**
 * Validate if a message should be blocked entirely
 */
export const shouldBlockMessage = (message: string): boolean => {
  const blockPatterns = [
    /pay.*outside.*platform/i,
    /direct.*payment/i,
    /bypass.*commission/i,
    /avoid.*fee/i,
    /save.*commission/i,
  ];

  return blockPatterns.some((pattern) => pattern.test(message));
};
