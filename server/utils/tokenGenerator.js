
import Token from '../models/Token.js';

/**
 * Generate token number in format TYYMMDDIT001
 * T = Token prefix
 * YYMMDD = Date
 * IT = Department code
 * 001 = Sequential number
 */
export const generateTokenNumber = async (departmentCode = 'IT') => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  const datePrefix = `T${year}${month}${day}${departmentCode}`;
  
  // Find the latest token with this prefix
  const latestToken = await Token.findOne({
    tokenNumber: new RegExp(`^${datePrefix}`)
  }).sort({ tokenNumber: -1 });
  
  let sequenceNumber = 1;
  
  if (latestToken && latestToken.tokenNumber) {
    // Extract the last 3 digits and increment
    const lastSequence = parseInt(latestToken.tokenNumber.slice(-3));
    sequenceNumber = lastSequence + 1;
  }
  
  const sequenceStr = String(sequenceNumber).padStart(3, '0');
  return `${datePrefix}${sequenceStr}`;
};
