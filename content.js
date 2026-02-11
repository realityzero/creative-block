let currentElement = null;
let rightClickedElement = null;

// Track right-clicked element
document.addEventListener("contextmenu", (e) => {
  rightClickedElement = e.target;
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "replaceImage") {
    handleImageReplacement(rightClickedElement);
  } else if (request.action === "changeBgColor") {
    showColorPicker(rightClickedElement);
  }
});

// Handle image replacement
function handleImageReplacement(imgElement) {
  if (!imgElement || imgElement.tagName !== "IMG") {
    alert("Please right-click on an image");
    return;
  }

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const originalWidth = imgElement.width;
        const originalHeight = imgElement.height;

        imgElement.src = event.target.result;

        // Maintain aspect ratio
        if (originalWidth && originalHeight) {
          imgElement.width = originalWidth;
          imgElement.height = originalHeight;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  input.click();
}

// Show color picker
function showColorPicker(element) {
  currentElement = element;

  // Remove existing picker if any
  const existing = document.getElementById("custom-color-picker-overlay");
  if (existing) existing.remove();

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "custom-color-picker-overlay";
  overlay.className = "color-picker-overlay";

  const picker = document.createElement("div");
  picker.className = "color-picker-container";

  picker.innerHTML = `
    <div class="color-picker-header">Change Background Color</div>
    <div class="color-picker-body">
      <input type="color" id="color-input" class="color-circle" value="#ffffff">
      <div class="hex-input-container">
        <label for="hex-input">Hex:</label>
        <input type="text" id="hex-input" class="hex-input" value="#ffffff" maxlength="7">
      </div>
      <div class="button-container">
        <button id="apply-color" class="apply-btn">Apply</button>
        <button id="cancel-color" class="cancel-btn">Cancel</button>
      </div>
    </div>
  `;

  overlay.appendChild(picker);
  document.body.appendChild(overlay);

  const colorInput = document.getElementById("color-input");
  const hexInput = document.getElementById("hex-input");
  const applyBtn = document.getElementById("apply-color");
  const cancelBtn = document.getElementById("cancel-color");

  // Sync color and hex inputs
  colorInput.addEventListener("input", (e) => {
    hexInput.value = e.target.value;
  });

  hexInput.addEventListener("input", (e) => {
    let hex = e.target.value;
    if (!hex.startsWith("#")) hex = "#" + hex;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      colorInput.value = hex;
    }
  });

  // Apply color
  applyBtn.addEventListener("click", () => {
    const color = colorInput.value;
    currentElement.style.backgroundColor = color;
    overlay.remove();
  });

  // Cancel
  cancelBtn.addEventListener("click", () => {
    overlay.remove();
  });

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}
