// This plugin creates a code snippet embedded in a frame with syntax highlighting

interface CodeSnippet {
  html?: string;
  css?: string;
  js?: string;
  code: string;
  language: string;
  theme: string;
  fontSize: number;
}

figma.showUI(__html__, { width: 550, height: 700 });

// Check if there's already a selection when the plugin starts
// This allows users to immediately load a snippet from a selected layer
const checkInitialSelection = () => {
  if (figma.currentPage.selection.length > 0) {
    const node = figma.currentPage.selection[0];
    if (node && node.type === 'FRAME' && node.name.startsWith('Code Snippet:')) {
      const frame = node as FrameNode;
      // Try to get combined snippet data first
      const snippetData = {
        html: frame.getPluginData('html') || '',
        css: frame.getPluginData('css') || '',
        js: frame.getPluginData('js') || '',
        code: frame.getPluginData('code') || '',
        language: frame.getPluginData('language') || 'javascript',
        theme: frame.getPluginData('theme') || 'dracula',
        fontSize: parseInt(frame.getPluginData('fontSize') || '14')
      };
      
      // Also try to check if there's a condensed "snippet" data field
      try {
        const saved = frame.getPluginData("snippet");
        if (saved) {
          const parsedData = JSON.parse(saved);
          figma.ui.postMessage({ 
            type: "load-snippet",
            snippet: parsedData
          });
          return;
        }
      } catch (e) {
        console.error("Error parsing snippet data:", e);
        figma.notify("Error loading snippet: Invalid data format", {error: true});
      }
      
      // If no condensed snippet data found, use the individual fields
      figma.ui.postMessage({ type: 'load-snippet', snippet: snippetData });
    }
  }
};

// Run the check immediately when plugin starts
checkInitialSelection();

// Handle messages from the UI
figma.ui.onmessage = msg => {
  try {
    if (msg.type === 'create-snippet') {
      createCodeSnippet(msg.snippet);
    } else if (msg.type === 'edit-snippet') {
      updateSelectedSnippet(msg.snippet);
    } else if (msg.type === 'save-combined-snippet') {
      saveCombinedSnippet(msg.snippet);
    } else if (msg.type === 'get-saved-snippet') {
      sendSavedSnippetData();
    } else if (msg.type === 'cancel') {
      figma.closePlugin();
    } else if (msg.type === 'preview-error') {
      // Handle preview errors from the UI
      console.error('Preview error:', msg.error);
      figma.notify('Error in code preview: ' + msg.error.message, {error: true});
    }
  } catch (error) {
    console.error('Error handling message:', error);
    figma.notify('An error occurred: ' + error.message, {error: true});
  }
};

// When the plugin is initialized, check if a code snippet is selected
figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection;
  if (selection.length === 1 && selection[0].type === 'FRAME' && selection[0].name.startsWith('Code Snippet:')) {
    const frame = selection[0] as FrameNode;
    // Extract code snippet data from the pluginData
    const snippetData = {
      html: frame.getPluginData('html') || '',
      css: frame.getPluginData('css') || '',
      js: frame.getPluginData('js') || '',
      code: frame.getPluginData('code') || '',
      language: frame.getPluginData('language') || 'javascript',
      theme: frame.getPluginData('theme') || 'dracula',
      fontSize: parseInt(frame.getPluginData('fontSize') || '14')
    };
    figma.ui.postMessage({ type: 'edit-mode', snippet: snippetData });
  }
});

// Send the saved snippet data to the UI
function sendSavedSnippetData() {
  const selection = figma.currentPage.selection;
  if (selection.length === 1 && selection[0].type === 'FRAME' && selection[0].name.startsWith('Code Snippet:')) {
    const frame = selection[0] as FrameNode;
    // Extract code snippet data from the pluginData
    const snippetData = {
      html: frame.getPluginData('html') || '',
      css: frame.getPluginData('css') || '',
      js: frame.getPluginData('js') || '',
      code: frame.getPluginData('code') || '',
      language: frame.getPluginData('language') || 'javascript',
      theme: frame.getPluginData('theme') || 'dracula',
      fontSize: parseInt(frame.getPluginData('fontSize') || '14')
    };
    figma.ui.postMessage({ type: 'saved-snippet-data', snippet: snippetData });
  } else {
    figma.ui.postMessage({ type: 'no-selection' });
  }
}

// Save a combined snippet with HTML, CSS, and JS
async function saveCombinedSnippet(snippetData: CodeSnippet) {
  // Load fonts
  await figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
  
  // Create a frame for the snippet
  const frame = figma.createFrame();
  frame.name = `Code Snippet: Combined`;
  frame.resize(500, 300);
  
  // Store snippet data in plugin data
  frame.setPluginData('html', snippetData.html || '');
  frame.setPluginData('css', snippetData.css || '');
  frame.setPluginData('js', snippetData.js || '');
  frame.setPluginData('code', snippetData.code);
  frame.setPluginData('language', snippetData.language);
  frame.setPluginData('theme', snippetData.theme);
  frame.setPluginData('fontSize', snippetData.fontSize.toString());
  
  // Create text node for the code preview (which will be HTML content)
  const text = figma.createText();
  text.fontName = { family: "Roboto Mono", style: "Regular" };
  text.fontSize = snippetData.fontSize;
  text.characters = snippetData.html || snippetData.code;
  
  // Apply styling based on the theme
  applyTheme(frame, text, snippetData.theme);
  
  // Add text to frame
  frame.appendChild(text);
  
  // Position frame in the center of the viewport
  const centerX = figma.viewport.center.x;
  const centerY = figma.viewport.center.y;
  frame.x = centerX - frame.width / 2;
  frame.y = centerY - frame.height / 2;
  
  // Select the frame
  figma.currentPage.selection = [frame];
  
  // Let UI know snippet was saved successfully
  figma.ui.postMessage({ type: 'snippet-saved' });
}

// Create a new code snippet
async function createCodeSnippet(snippetData: CodeSnippet) {
  // Load fonts
  await figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
  
  // Create a frame for the snippet
  const frame = figma.createFrame();
  frame.name = `Code Snippet: ${snippetData.language}`;
  frame.resize(500, 300);
  
  // Store snippet data in plugin data
  frame.setPluginData('code', snippetData.code);
  frame.setPluginData('language', snippetData.language);
  frame.setPluginData('theme', snippetData.theme);
  frame.setPluginData('fontSize', snippetData.fontSize.toString());
  
  // Create text node for the code
  const text = figma.createText();
  text.fontName = { family: "Roboto Mono", style: "Regular" };
  text.fontSize = snippetData.fontSize;
  text.characters = snippetData.code;
  
  // Apply styling based on the theme
  applyTheme(frame, text, snippetData.theme);
  
  // Add text to frame
  frame.appendChild(text);
  
  // Position frame in the center of the viewport
  const centerX = figma.viewport.center.x;
  const centerY = figma.viewport.center.y;
  frame.x = centerX - frame.width / 2;
  frame.y = centerY - frame.height / 2;
  
  // Select the frame
  figma.currentPage.selection = [frame];
  
  // Let UI know snippet was saved successfully
  figma.ui.postMessage({ type: 'snippet-saved' });
}

// Update an existing code snippet
async function updateSelectedSnippet(snippetData: CodeSnippet) {
  const selection = figma.currentPage.selection;
  if (selection.length === 1 && selection[0].type === 'FRAME' && selection[0].name.startsWith('Code Snippet:')) {
    const frame = selection[0] as FrameNode;
    
    // Load fonts
    await figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
    
    // Update plugin data
    if (snippetData.html !== undefined) frame.setPluginData('html', snippetData.html);
    if (snippetData.css !== undefined) frame.setPluginData('css', snippetData.css);
    if (snippetData.js !== undefined) frame.setPluginData('js', snippetData.js);
    frame.setPluginData('code', snippetData.code);
    frame.setPluginData('language', snippetData.language);
    frame.setPluginData('theme', snippetData.theme);
    frame.setPluginData('fontSize', snippetData.fontSize.toString());
    
    // Update frame name
    frame.name = snippetData.html ? `Code Snippet: Combined` : `Code Snippet: ${snippetData.language}`;
    
    // Update text
    const textNode = frame.findChild(node => node.type === 'TEXT') as TextNode;
    if (textNode) {
      textNode.characters = snippetData.html || snippetData.code;
      textNode.fontSize = snippetData.fontSize;
      
      // Apply theme
      applyTheme(frame, textNode, snippetData.theme);
    }
    
    // Let UI know snippet was updated successfully
    figma.ui.postMessage({ type: 'snippet-updated' });
  }
  
  // Don't close the plugin automatically after updating
  // figma.closePlugin();
}

// Apply a theme to the snippet
function applyTheme(frame: FrameNode, text: TextNode, theme: string) {
  // Apply basic frame styling
  frame.cornerRadius = 8;
  
  // Apply theme-specific styling
  switch (theme) {
    case 'dracula':
      frame.fills = [{ type: 'SOLID', color: { r: 40/255, g: 42/255, b: 54/255 } }];
      text.fills = [{ type: 'SOLID', color: { r: 248/255, g: 248/255, b: 242/255 } }];
      break;
    case 'github':
      frame.fills = [{ type: 'SOLID', color: { r: 255/255, g: 255/255, b: 255/255 } }];
      text.fills = [{ type: 'SOLID', color: { r: 36/255, g: 41/255, b: 46/255 } }];
      break;
    case 'monokai':
      frame.fills = [{ type: 'SOLID', color: { r: 39/255, g: 40/255, b: 34/255 } }];
      text.fills = [{ type: 'SOLID', color: { r: 248/255, g: 248/255, b: 242/255 } }];
      break;
    case 'solarized-light':
      frame.fills = [{ type: 'SOLID', color: { r: 253/255, g: 246/255, b: 227/255 } }];
      text.fills = [{ type: 'SOLID', color: { r: 101/255, g: 123/255, b: 131/255 } }];
      break;
    default:
      frame.fills = [{ type: 'SOLID', color: { r: 40/255, g: 42/255, b: 54/255 } }];
      text.fills = [{ type: 'SOLID', color: { r: 248/255, g: 248/255, b: 242/255 } }];
  }
  
  // Add padding
  text.x = 16;
  text.y = 16;
  frame.resize(text.width + 32, text.height + 32);
}