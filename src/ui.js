// UI Controls
import { createEditors, getEditorContents, setEditorContents } from './editors.js';
import { templates } from './templates.js';

// UI elements
const languageSelect = document.getElementById('language-select');
const themeSelect = document.getElementById('theme-select');
const fontSizeInput = document.getElementById('font-size');
const templateSelect = document.getElementById('template-select');
const createButton = document.getElementById('create');
const cancelButton = document.getElementById('cancel');

// Library elements
const saveToLibraryButton = document.getElementById('save-to-library');
const loadFromLibraryButton = document.getElementById('load-from-library');
const libraryModal = document.getElementById('library-modal');
const saveModal = document.getElementById('save-modal');
const snippetNameInput = document.getElementById('snippet-name');
const snippetDescriptionInput = document.getElementById('snippet-description');
const confirmSaveButton = document.getElementById('confirm-save');
const cancelSaveButton = document.getElementById('cancel-save');
const snippetsList = document.getElementById('snippets-list');
const emptyLibrary = document.getElementById('empty-library');

// Tab controls
const tabs = document.querySelectorAll('.tab');
const tabPanes = document.querySelectorAll('.tab-pane');

// Add save button to the UI
const saveButton = document.createElement('button');
saveButton.textContent = 'Save to Figma';
saveButton.className = 'button button--primary';
saveButton.style.marginRight = '8px';
document.querySelector('.buttons').prepend(saveButton);

// Add export button to the UI
const exportButton = document.createElement('button');
exportButton.textContent = 'Export';
exportButton.className = 'button button--secondary';
exportButton.style.marginRight = '8px';
document.querySelector('.buttons').prepend(exportButton);

// Add load button to the UI
const loadButton = document.createElement('button');
loadButton.textContent = 'Load from Selection';
loadButton.className = 'button button--secondary';
loadButton.style.marginRight = '8px';
document.querySelector('.buttons').prepend(loadButton);

// Initialize UI state
let isEditMode = false;
let debounceTimer;
let selectedSnippetId = null;

// Snippet Library functions
const STORAGE_KEY = 'live-snippet-embedder-library';

// Function to get snippets from localStorage
function getSnippets() {
  const snippetsJson = localStorage.getItem(STORAGE_KEY);
  return snippetsJson ? JSON.parse(snippetsJson) : [];
}

// Function to save snippets to localStorage
function saveSnippets(snippets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
}

// Function to add a new snippet to the library
function addSnippet(snippet) {
  const snippets = getSnippets();
  
  // Create a new snippet object with metadata
  const newSnippet = {
    id: Date.now().toString(), // Simple unique ID based on timestamp
    name: snippet.name,
    description: snippet.description || '',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    // Snippet content
    html: snippet.html || '',
    css: snippet.css || '',
    js: snippet.js || '',
    language: snippet.language || 'html',
    theme: snippet.theme || 'dracula',
    fontSize: snippet.fontSize || 14
  };
  
  snippets.push(newSnippet);
  saveSnippets(snippets);
  showNotification(`Snippet "${newSnippet.name}" saved to library!`, 'success');
  return newSnippet;
}

// Function to update an existing snippet in the library
function updateSnippet(id, updatedData) {
  const snippets = getSnippets();
  const index = snippets.findIndex(s => s.id === id);
  
  if (index !== -1) {
    // Update the snippet with new data while preserving the ID and creation date
    snippets[index] = {
      ...snippets[index],
      ...updatedData,
      modified: new Date().toISOString()
    };
    
    saveSnippets(snippets);
    showNotification(`Snippet "${snippets[index].name}" updated!`, 'success');
    return snippets[index];
  }
  
  return null;
}

// Function to delete a snippet from the library
function deleteSnippet(id) {
  const snippets = getSnippets();
  const index = snippets.findIndex(s => s.id === id);
  
  if (index !== -1) {
    const deletedSnippet = snippets[index];
    snippets.splice(index, 1);
    saveSnippets(snippets);
    showNotification(`Snippet "${deletedSnippet.name}" deleted`, 'info');
    return true;
  }
  
  return false;
}

// Function to render the snippets list in the library modal
function renderSnippetsList() {
  const snippets = getSnippets();
  
  // Show/hide empty state message
  if (snippets.length === 0) {
    snippetsList.style.display = 'none';
    emptyLibrary.style.display = 'block';
    return;
  }
  
  snippetsList.style.display = 'flex';
  emptyLibrary.style.display = 'none';
  
  // Clear existing list
  snippetsList.innerHTML = '';
  
  // Add snippet items
  snippets.forEach(snippet => {
    const snippetItem = document.createElement('div');
    snippetItem.className = 'snippet-item';
    snippetItem.dataset.id = snippet.id;
    
    // Format dates for display
    const created = new Date(snippet.created);
    const modified = new Date(snippet.modified);
    const createdDate = created.toLocaleDateString();
    const modifiedDate = modified.toLocaleDateString();
    
    snippetItem.innerHTML = `
      <div class="snippet-item-header">
        <div class="snippet-name">${snippet.name}</div>
        <div class="snippet-actions">
          <span class="snippet-action snippet-rename" title="Rename">✏️</span>
          <span class="snippet-action snippet-delete" title="Delete">🗑️</span>
        </div>
      </div>
      ${snippet.description ? `<div class="snippet-description">${snippet.description}</div>` : ''}
      <div class="snippet-meta">
        <div class="snippet-language">Language: ${snippet.language}</div>
        <div class="snippet-date">Modified: ${modifiedDate}</div>
      </div>
    `;
    
    // Click event to load the snippet
    snippetItem.addEventListener('click', (e) => {
      // Don't trigger if clicking on action buttons
      if (!e.target.closest('.snippet-action')) {
        loadSnippetFromLibrary(snippet.id);
        closeLibraryModal();
      }
    });
    
    // Add event listeners for the action buttons
    snippetItem.querySelector('.snippet-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Are you sure you want to delete "${snippet.name}"?`)) {
        deleteSnippet(snippet.id);
        renderSnippetsList();
      }
    });
    
    snippetItem.querySelector('.snippet-rename').addEventListener('click', (e) => {
      e.stopPropagation();
      const newName = prompt('Enter a new name:', snippet.name);
      
      if (newName && newName.trim() !== '') {
        const newDescription = prompt('Enter a new description (optional):', snippet.description);
        updateSnippet(snippet.id, {
          name: newName,
          description: newDescription || ''
        });
        renderSnippetsList();
      }
    });
    
    snippetsList.appendChild(snippetItem);
  });
}

// Function to load a snippet from the library
function loadSnippetFromLibrary(id) {
  const snippets = getSnippets();
  const snippet = snippets.find(s => s.id === id);
  
  if (snippet) {
    // Set the snippet content in the editors
    setEditorContents(
      snippet.html || '',
      snippet.css || '',
      snippet.js || ''
    );
    
    // Set the UI elements
    languageSelect.value = snippet.language;
    themeSelect.value = snippet.theme;
    fontSizeInput.value = snippet.fontSize;
    
    // Update preview
    const { html, css, js } = getEditorContents();
    updatePreview(html, css, js);
    
    // Show notification
    showNotification(`Loaded snippet: ${snippet.name}`, 'success');
    
    // Set the active tab based on the snippet's language
    const tabToActivate = Array.from(tabs).find(tab => tab.getAttribute('data-tab') === snippet.language);
    if (tabToActivate) {
      tabToActivate.click();
    }
  }
}

// Event handlers for the library modals
function openLibraryModal() {
  renderSnippetsList();
  libraryModal.style.display = 'flex';
}

function closeLibraryModal() {
  libraryModal.style.display = 'none';
}

function openSaveModal() {
  saveModal.style.display = 'flex';
  snippetNameInput.value = '';
  snippetDescriptionInput.value = '';
  snippetNameInput.focus();
}

function closeSaveModal() {
  saveModal.style.display = 'none';
}

// Event listeners for library buttons
saveToLibraryButton.addEventListener('click', () => {
  const { html, css, js } = getEditorContents();
  
  // Check if there's any content to save
  if (!html.trim() && !css.trim() && !js.trim()) {
    showNotification('Nothing to save. Please enter some code first.', 'error');
    return;
  }
  
  openSaveModal();
});

loadFromLibraryButton.addEventListener('click', openLibraryModal);

// Close modals when clicking on close button
document.querySelectorAll('.modal-close').forEach(button => {
  button.addEventListener('click', () => {
    closeLibraryModal();
    closeSaveModal();
  });
});

// Close modals when clicking outside the modal content
window.addEventListener('click', (e) => {
  if (e.target === libraryModal) {
    closeLibraryModal();
  }
  if (e.target === saveModal) {
    closeSaveModal();
  }
});

// Save snippet button in the save modal
confirmSaveButton.addEventListener('click', () => {
  const name = snippetNameInput.value.trim();
  
  if (!name) {
    showNotification('Please enter a name for your snippet', 'error');
    return;
  }
  
  const { html, css, js } = getEditorContents();
  const activeTab = document.querySelector('.tab.active').getAttribute('data-tab');
  
  addSnippet({
    name: name,
    description: snippetDescriptionInput.value.trim(),
    html: html,
    css: css,
    js: js,
    language: activeTab,
    theme: themeSelect.value,
    fontSize: parseInt(fontSizeInput.value) || 14
  });
  
  closeSaveModal();
});

// Cancel button in the save modal
cancelSaveButton.addEventListener('click', closeSaveModal);

// Function to update the preview with debounce
function debounceUpdate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const { html, css, js } = getEditorContents();
    updatePreview(html, css, js);
  }, 300);
}

// Function to update the preview iframe
function updatePreview(html, css, js) {
  try {
    const iframe = document.getElementById("preview");
    const fullCode = `
    <html>
      <head>
        <style>${css}</style>
        <script>
          // Error handling for JS execution
          window.onerror = function(message, source, lineno, colno, error) {
            window.parent.postMessage({
              type: 'preview-error',
              error: { message, source, lineno, colno }
            }, '*');
            return true; // Prevents the default browser error handling
          };
        </script>
      </head>
      <body>${html}<script>${js}<\/script></body>
    </html>`;
    
    iframe.srcdoc = fullCode;
    
    // Add load event to detect successful preview
    iframe.onload = () => {
      console.log('Preview loaded successfully');
    };
    
    // Add error event to detect iframe loading issues
    iframe.onerror = (error) => {
      console.error('Preview failed to load:', error);
      showNotification('Preview failed to load. Check your code for errors.', 'error');
    };
  } catch (error) {
    console.error('Preview error:', error);
    showNotification('Failed to update preview: ' + error.message, 'error');
  }
}

// Tab switching
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs and panes
    tabs.forEach(t => t.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding pane
    tab.classList.add('active');
    const tabId = tab.getAttribute('data-tab');
    document.getElementById(`${tabId}-pane`).classList.add('active');
    
    // Update the snippet language in the language selector
    languageSelect.value = tabId;
  });
});

// Template selection handling
templateSelect.addEventListener('change', () => {
  const templateId = templateSelect.value;
  
  if (templateId && templates[templateId]) {
    const template = templates[templateId];
    
    // Fill the editors with the template content
    setEditorContents(
      template.html || '',
      template.css || '',
      template.js || ''
    );
    
    // Update preview with template content
    updatePreview(template.html || '', template.css || '', template.js || '');
    
    // Show notification about the loaded template
    showNotification(`Loaded template: ${template.name}`, 'success');
    
    // Optionally, set the first tab as active to show HTML content first
    tabs[0].click();
  }
});

// Save to Figma button click handler
saveButton.addEventListener('click', () => {
  // Gather the current content from CodeMirror editors
  const { html, css, js } = getEditorContents();
  
  const snippetData = {
    html: html,
    css: css,
    js: js,
    code: html, // Use HTML as the default visible code
    language: 'html',
    theme: themeSelect.value,
    fontSize: parseInt(fontSizeInput.value) || 14
  };
  
  // Send message to plugin code
  parent.postMessage({
    pluginMessage: {
      type: isEditMode ? 'edit-snippet' : 'save-combined-snippet',
      snippet: snippetData
    }
  }, '*');
});

// Load from Selection button click handler
loadButton.addEventListener('click', () => {
  // Request saved snippet data from the plugin
  parent.postMessage({
    pluginMessage: {
      type: 'get-saved-snippet'
    }
  }, '*');
});

// Listen for messages from the plugin code
window.onmessage = event => {
  const message = event.data.pluginMessage;
  
  if (message.type === 'edit-mode') {
    // Switch to edit mode
    isEditMode = true;
    
    // Fill form with existing snippet data
    if (message.snippet.html) {
      setEditorContents(
        message.snippet.html,
        message.snippet.css || '',
        message.snippet.js || ''
      );
    } else if (message.snippet.language === 'html') {
      setEditorContents(message.snippet.code, '', '');
    } else if (message.snippet.language === 'css') {
      setEditorContents('', message.snippet.code, '');
    } else {
      setEditorContents('', '', message.snippet.code);
    }
    
    languageSelect.value = message.snippet.language;
    themeSelect.value = message.snippet.theme;
    fontSizeInput.value = message.snippet.fontSize;
    
    // Change button text
    createButton.textContent = 'Update Snippet';
    document.querySelector('.type--pos-large-bold').textContent = 'Edit Code Snippet';
    
    // Update preview with CodeMirror content
    const { html, css, js } = getEditorContents();
    updatePreview(html, css, js);
  } else if (message.type === 'load-snippet') {
    // Similar to edit-mode but explicitly for loading snippets at startup
    isEditMode = true;
    
    // Fill form with snippet data
    if (message.snippet.html) {
      setEditorContents(
        message.snippet.html,
        message.snippet.css || '',
        message.snippet.js || ''
      );
    } else if (message.snippet.language === 'html') {
      setEditorContents(message.snippet.code, '', '');
    } else if (message.snippet.language === 'css') {
      setEditorContents('', message.snippet.code, '');
    } else {
      setEditorContents('', '', message.snippet.code);
    }
    
    // Set appropriate theme and font size
    if (message.snippet.theme) themeSelect.value = message.snippet.theme;
    if (message.snippet.fontSize) fontSizeInput.value = message.snippet.fontSize;
    
    // Change button text
    createButton.textContent = 'Update Snippet';
    document.querySelector('.type--pos-large-bold').textContent = 'Edit Code Snippet';
    
    // Update preview with CodeMirror content
    const { html, css, js } = getEditorContents();
    updatePreview(html, css, js);
    
    // Show notification
    showNotification('Snippet loaded from selected layer', 'info');
  } else if (message.type === 'saved-snippet-data') {
    // Fill form with saved snippet data using CodeMirror editors
    let htmlContent = message.snippet.html || '';
    let cssContent = message.snippet.css || '';
    let jsContent = message.snippet.js || '';
    
    // If there's no HTML/CSS/JS specific data, try to use the regular code field
    if (!message.snippet.html && !message.snippet.css && !message.snippet.js) {
      if (message.snippet.language === 'html') {
        htmlContent = message.snippet.code;
      } else if (message.snippet.language === 'css') {
        cssContent = message.snippet.code;
      } else {
        jsContent = message.snippet.code;
      }
    }
    
    // Update CodeMirror editors
    setEditorContents(htmlContent, cssContent, jsContent);
    
    // Update theme and font size
    themeSelect.value = message.snippet.theme;
    fontSizeInput.value = message.snippet.fontSize;
    
    // Update preview
    updatePreview(htmlContent, cssContent, jsContent);
    
    // Show success message
    showNotification('Snippet loaded successfully!', 'success');
  } else if (message.type === 'no-selection') {
    showNotification('Please select a code snippet frame first', 'error');
  } else if (message.type === 'snippet-saved' || message.type === 'snippet-updated') {
    showNotification('Snippet saved to Figma!', 'success');
  }
};

// Create snippet button clicked
createButton.onclick = () => {
  try {
    const activeTab = document.querySelector('.tab.active').getAttribute('data-tab');
    const { html, css, js } = getEditorContents();
    let code;
    
    // Set the code based on the active tab
    if (activeTab === 'html') {
      code = html;
    } else if (activeTab === 'css') {
      code = css;
    } else {
      code = js;
    }
    
    const snippetData = {
      code: code,
      language: activeTab,
      theme: themeSelect.value,
      fontSize: parseInt(fontSizeInput.value) || 14,
      // Include all fields for combined snippets
      html: html,
      css: css,
      js: js
    };
    
    // Validate input - check if current tab code is empty
    if (!snippetData.code.trim()) {
      showNotification(`Please enter some ${activeTab.toUpperCase()} code`, 'error');
      return;
    }
    
    // Validate font size
    const fontSize = parseInt(fontSizeInput.value);
    if (isNaN(fontSize) || fontSize < 8 || fontSize > 36) {
      showNotification('Font size must be between 8 and 36px', 'error');
      return;
    }
    
    // Send message to plugin code
    parent.postMessage({
      pluginMessage: {
        type: isEditMode ? 'edit-snippet' : 'create-snippet',
        snippet: snippetData
      }
    }, '*');
  } catch (error) {
    console.error('Creation error:', error);
    showNotification('Failed to create snippet: ' + error.message, 'error');
  }
};

// Cancel button clicked
cancelButton.onclick = () => {
  parent.postMessage({
    pluginMessage: { type: 'cancel' }
  }, '*');
};

// Show notification function
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
  .notification {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    background: #333;
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s ease;
  }
  .notification--success { background: #4caf50; }
  .notification--error { background: #f44336; }
  .notification--info { background: #2196f3; }

  .export-menu {
    position: absolute;
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 8px 0;
    z-index: 1000;
    min-width: 160px;
  }
  
  .export-option {
    padding: 8px 16px;
    cursor: pointer;
    font-size: 12px;
  }
  
  .export-option:hover {
    background: #f5f5f5;
  }
`;
document.head.appendChild(style);

// Prevent form submission on Enter key
document.querySelector('form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  return false;
});

// Set focus on the html input when the UI loads and initialize preview
window.onload = () => {
  // Initialize CodeMirror editors
  createEditors(debounceUpdate);
  
  // Update preview with initial content
  const { html, css, js } = getEditorContents();
  updatePreview(html, css, js);
};

// Export functionality
function exportSnippet() {
  try {
    // Get content from CodeMirror editors instead of textareas
    const { html, css, js } = getEditorContents();
    
    // Validate if any content exists
    if (!html.trim() && !css.trim() && !js.trim()) {
      showNotification('Nothing to export. Please enter some code first.', 'error');
      return;
    }
    
    // Create export dropdown menu
    const exportMenu = document.createElement('div');
    exportMenu.className = 'export-menu';
    exportMenu.innerHTML = `
      <div class="export-option" id="export-html">Download HTML</div>
      <div class="export-option" id="export-copy">Copy to Clipboard</div>
      <div class="export-option" id="export-library">Save to Library</div>
    `;
    
    // Position the menu below the export button
    const buttonRect = exportButton.getBoundingClientRect();
    exportMenu.style.top = `${buttonRect.bottom + 4}px`;
    exportMenu.style.left = `${buttonRect.left}px`;
    
    // Add menu to DOM
    document.body.appendChild(exportMenu);
    
    // Handle download HTML option
    document.getElementById('export-html').addEventListener('click', () => {
      const fullCode = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Code Snippet</title>
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>${js}</script>
</body>
</html>`;
      
      // Create download link
      const blob = new Blob([fullCode], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'snippet.html';
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      exportMenu.remove();
      showNotification('HTML file downloaded!', 'success');
    });
    
    // Handle copy to clipboard option
    document.getElementById('export-copy').addEventListener('click', () => {
      // Create copy menu with options
      exportMenu.remove();
      
      const copyMenu = document.createElement('div');
      copyMenu.className = 'export-menu';
      copyMenu.innerHTML = `
        <div class="export-option" id="copy-html">Copy HTML</div>
        <div class="export-option" id="copy-css">Copy CSS</div>
        <div class="export-option" id="copy-js">Copy JavaScript</div>
        <div class="export-option" id="copy-all">Copy All Combined</div>
      `;
      
      // Position the menu
      copyMenu.style.top = `${buttonRect.bottom + 4}px`;
      copyMenu.style.left = `${buttonRect.left}px`;
      document.body.appendChild(copyMenu);
      
      // Copy HTML handler
      document.getElementById('copy-html').addEventListener('click', () => {
        if (!html.trim()) {
          showNotification('No HTML to copy', 'error');
        } else {
          navigator.clipboard.writeText(html)
            .then(() => showNotification('HTML copied to clipboard!', 'success'))
            .catch(() => showNotification('Failed to copy to clipboard', 'error'));
        }
        copyMenu.remove();
      });
      
      // Copy CSS handler
      document.getElementById('copy-css').addEventListener('click', () => {
        if (!css.trim()) {
          showNotification('No CSS to copy', 'error');
        } else {
          navigator.clipboard.writeText(css)
            .then(() => showNotification('CSS copied to clipboard!', 'success'))
            .catch(() => showNotification('Failed to copy to clipboard', 'error'));
        }
        copyMenu.remove();
      });
      
      // Copy JS handler
      document.getElementById('copy-js').addEventListener('click', () => {
        if (!js.trim()) {
          showNotification('No JavaScript to copy', 'error');
        } else {
          navigator.clipboard.writeText(js)
            .then(() => showNotification('JavaScript copied to clipboard!', 'success'))
            .catch(() => showNotification('Failed to copy to clipboard', 'error'));
        }
        copyMenu.remove();
      });
      
      // Copy All handler
      document.getElementById('copy-all').addEventListener('click', () => {
        const fullCode = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Code Snippet</title>
  <style>
${css}
  </style>
</head>
<body>
  ${html}
  <script>
${js}
  </script>
</body>
</html>`;

        navigator.clipboard.writeText(fullCode)
          .then(() => showNotification('Full code copied to clipboard!', 'success'))
          .catch(() => showNotification('Failed to copy to clipboard', 'error'));
        
        copyMenu.remove();
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', function closeMenu(e) {
        if (!copyMenu.contains(e.target) && e.target !== exportButton) {
          copyMenu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    });
    
    // Handle save to library option
    document.getElementById('export-library').addEventListener('click', () => {
      exportMenu.remove();
      openSaveModal();
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
      if (!exportMenu.contains(e.target) && e.target !== exportButton) {
        exportMenu.remove();
        document.removeEventListener('click', closeMenu);
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    showNotification('Failed to export: ' + error.message, 'error');
  }
}

// Export button click handler
exportButton.addEventListener('click', exportSnippet);