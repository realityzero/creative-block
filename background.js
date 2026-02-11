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
  if (info.menuItemId === "replaceImage") {
    chrome.tabs.sendMessage(tab.id, {
      action: "replaceImage",
      srcUrl: info.srcUrl,
    });
  } else if (info.menuItemId === "changeBgColor") {
    chrome.tabs.sendMessage(tab.id, {
      action: "changeBgColor",
      x: info.x,
      y: info.y,
    });
  }
});
