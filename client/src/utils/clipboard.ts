export const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let successful = false;

  try {
    successful = document.execCommand('copy');
  } catch (err) {
    console.error('Fallback: Copy failed', err);
  }

  document.body.removeChild(textArea);
  return successful;
};
