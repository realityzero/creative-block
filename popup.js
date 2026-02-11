let isEditMode = false;

const btn = document.getElementById("toggleEdit");
const status = document.getElementById("status");

document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getDesignModeState,
  });

  isEditMode = Boolean(result);
  updateEditUI();
});

btn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  isEditMode = !isEditMode;

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: toggleDesignMode,
    args: [isEditMode],
  });

  updateEditUI();
  status.textContent = isEditMode
    ? "✓ Text editing enabled"
    : "✓ Text editing disabled";
  status.style.display = "block";

  setTimeout(() => {
    status.style.display = "none";
  }, 2000);
});

function toggleDesignMode(enable) {
  document.designMode = enable ? "on" : "off";
}

function getDesignModeState() {
  return document.designMode.toLowerCase() === "on";
}

function updateEditUI() {
  if (isEditMode) {
    btn.textContent = "Disable Text Editing";
    btn.style.background = "#f44336";
    return;
  }

  btn.textContent = "Enable Text Editing";
  btn.style.background = "#4CAF50";
}
