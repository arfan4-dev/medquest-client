import CryptoJS from "crypto-js";

function decryptNumber(encryptedText, secretKey) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  if (decryptedData === "") {
    throw new Error("Decryption failed.");
  }
  return parseInt(decryptedData, 10);
}

export default decryptNumber;
