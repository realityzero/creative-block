let isEditMode = false;
let isBoundaryMode = false;

const editBtn = document.getElementById("toggleEdit");
const boundaryBtn = document.getElementById("toggleBoundaries");
const status = document.getElementById("status");

document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getDesignModeState,
  });

  isEditMode = Boolean(result);
  isBoundaryMode = await getBoundaryModeState(tab.id);
  updateEditUI();
  updateBoundaryUI();
});

editBtn.addEventListener("click", async () => {
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

boundaryBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  const nextMode = !isBoundaryMode;
  try {
    await sendMessageToTab(tab.id, {
      action: "toggleBoundaries",
      enabled: nextMode,
    });
    isBoundaryMode = nextMode;
  } catch {
    status.textContent = "This page does not support boundary overlays";
    status.style.display = "block";
    setTimeout(() => {
      status.style.display = "none";
    }, 2000);
    return;
  }

  updateBoundaryUI();
  status.textContent = isBoundaryMode
    ? "✓ Element boundaries enabled"
    : "✓ Element boundaries disabled";
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
    editBtn.textContent = "Disable Text Editing";
    editBtn.style.background = "#f44336";
    return;
  }

  editBtn.textContent = "Enable Text Editing";
  editBtn.style.background = "#4CAF50";
}

function updateBoundaryUI() {
  if (isBoundaryMode) {
    boundaryBtn.textContent = "Hide Element Boundaries";
    boundaryBtn.style.background = "#7e22ce";
    return;
  }

  boundaryBtn.textContent = "Show Element Boundaries";
  boundaryBtn.style.background = "#a855f7";
}

async function getBoundaryModeState(tabId) {
  try {
    const response = await sendMessageToTab(tabId, { action: "getBoundaryState" });
    return Boolean(response?.enabled);
  } catch {
    return false;
  }
}

function sendMessageToTab(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        reject(new Error(lastError.message));
        return;
      }
      resolve(response);
    });
  });
}
