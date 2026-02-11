// Create context menu items
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "replaceImage",
    title: "Replace Image",
    contexts: ["image"],
  });

  chrome.contextMenus.create({
    id: "changeBgColor",
    title: "Change Background Color",
    contexts: ["page", "selection", "link", "image"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) {
    return;
  }

  if (info.menuItemId === "replaceImage") {
    sendMessageToTab(tab.id, {
      action: "replaceImage",
      srcUrl: info.srcUrl,
    });
  } else if (info.menuItemId === "changeBgColor") {
    sendMessageToTab(tab.id, {
      action: "changeBgColor",
      x: info.x,
      y: info.y,
    });
  }
});

function sendMessageToTab(tabId, message) {
  chrome.tabs.sendMessage(tabId, message, () => {
    const lastError = chrome.runtime.lastError;
    if (!lastError) {
      return;
    }

    // Ignore expected pages where content scripts are unavailable.
    if (
      lastError.message?.includes("Could not establish connection") ||
      lastError.message?.includes("Receiving end does not exist")
    ) {
      return;
    }

    console.error("Creative Blocks message error:", lastError.message);
  });
}
