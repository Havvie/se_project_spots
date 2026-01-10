export function setButtonText(
  button,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (!button) return;

  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
  } else {
    button.textContent = button.dataset.originalText || defaultText;
  }
}
