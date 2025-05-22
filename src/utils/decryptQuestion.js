function caesarCipherDecrypt(text, shift) {
  if (typeof text !== "string") {
    throw new Error("Input must be a string.");
  }

  return text
    .split("")
    .map((char) => {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const base = char === char.toLowerCase() ? 97 : 65;

        const newCode = ((code - base - shift + 26) % 26) + base;
        return String.fromCharCode(newCode);
      }

      return char;
    })
    .join("");
}

export default caesarCipherDecrypt;
