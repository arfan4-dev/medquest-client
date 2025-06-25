export function removeOptionPrefix(htmlString) {
  // Create a temporary element to extract plain text
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  const text = tempDiv.textContent || tempDiv.innerText || "";

  // Check if the text starts with "A. ", "B. ", ..., "E. "
  const regex = /^[A-E]\.\s*/;
  const cleanedText = text.replace(regex, "");

  // Return it as HTML again (in case you need to preserve tags)
  return cleanedText;
}
