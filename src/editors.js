// CodeMirror 6 implementation
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { syntaxHighlighting } from '@codemirror/language';
import { oneDark } from '@codemirror/theme-one-dark';

// Editor instances
let htmlEditor, cssEditor, jsEditor;

// Custom themes based on the theme selector options
const themes = {
  dracula: createDraculaTheme(),
  github: createGithubTheme(),
  monokai: createMonokaiTheme(),
  'solarized-light': createSolarizedLightTheme()
};

// Theme creation functions
function createDraculaTheme() {
  return EditorView.theme({
    '&': {
      backgroundColor: '#282a36',
      color: '#f8f8f2'
    },
    '.cm-content': {
      caretColor: '#f8f8f2'
    },
    '.cm-cursor': {
      borderLeftColor: '#f8f8f2'
    },
    '.cm-activeLine': {
      backgroundColor: '#44475a'
    },
    '.cm-selectionMatch': {
      backgroundColor: '#44475a'
    },
    '.cm-matchingBracket': {
      color: '#50fa7b',
      fontWeight: 'bold'
    },
    '.cm-gutters': {
      backgroundColor: '#282a36',
      color: '#6272a4',
      border: 'none'
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#44475a'
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 5px'
    },
    '.cm-scroller': {
      fontFamily: 'monospace'
    }
  }, { dark: true });
}

function createGithubTheme() {
  return EditorView.theme({
    '&': {
      backgroundColor: '#ffffff',
      color: '#24292e'
    },
    '.cm-content': {
      caretColor: '#24292e'
    },
    '.cm-cursor': {
      borderLeftColor: '#24292e'
    },
    '.cm-activeLine': {
      backgroundColor: '#f6f8fa'
    },
    '.cm-selectionMatch': {
      backgroundColor: '#c8e1ff'
    },
    '.cm-matchingBracket': {
      color: '#24292e',
      backgroundColor: '#c8e1ff',
      fontWeight: 'bold'
    },
    '.cm-gutters': {
      backgroundColor: '#ffffff',
      color: '#6e7781',
      border: 'none'
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#f6f8fa'
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 5px'
    },
    '.cm-scroller': {
      fontFamily: 'monospace'
    }
  });
}

function createMonokaiTheme() {
  return EditorView.theme({
    '&': {
      backgroundColor: '#272822',
      color: '#f8f8f2'
    },
    '.cm-content': {
      caretColor: '#f8f8f2'
    },
    '.cm-cursor': {
      borderLeftColor: '#f8f8f2'
    },
    '.cm-activeLine': {
      backgroundColor: '#3e3d32'
    },
    '.cm-selectionMatch': {
      backgroundColor: '#3e3d32'
    },
    '.cm-matchingBracket': {
      color: '#a6e22e',
      fontWeight: 'bold'
    },
    '.cm-gutters': {
      backgroundColor: '#272822',
      color: '#75715e',
      border: 'none'
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#3e3d32'
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 5px'
    },
    '.cm-scroller': {
      fontFamily: 'monospace'
    }
  }, { dark: true });
}

function createSolarizedLightTheme() {
  return EditorView.theme({
    '&': {
      backgroundColor: '#fdf6e3',
      color: '#657b83'
    },
    '.cm-content': {
      caretColor: '#657b83'
    },
    '.cm-cursor': {
      borderLeftColor: '#657b83'
    },
    '.cm-activeLine': {
      backgroundColor: '#eee8d5'
    },
    '.cm-selectionMatch': {
      backgroundColor: '#eee8d5'
    },
    '.cm-matchingBracket': {
      color: '#859900',
      fontWeight: 'bold'
    },
    '.cm-gutters': {
      backgroundColor: '#fdf6e3',
      color: '#93a1a1',
      border: 'none'
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#eee8d5'
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 5px'
    },
    '.cm-scroller': {
      fontFamily: 'monospace'
    }
  });
}

// Create editors and replace textareas
function createEditors(updateCallback) {
  // Get current theme from select element
  const currentTheme = document.getElementById('theme-select').value;
  const fontSize = document.getElementById('font-size').value;
  
  // Create HTML editor
  const htmlPane = document.getElementById('html-pane');
  const htmlTextarea = document.getElementById('html-input');
  const htmlContent = htmlTextarea.value;
  
  // Remove textarea
  htmlTextarea.remove();
  
  // Create new editor div
  const htmlEditorDiv = document.createElement('div');
  htmlEditorDiv.id = 'html-editor';
  htmlEditorDiv.style.height = '200px';
  htmlPane.appendChild(htmlEditorDiv);
  
  // Initialize HTML editor
  htmlEditor = new EditorView({
    state: EditorState.create({
      doc: htmlContent,
      extensions: [
        lineNumbers(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        html(),
        themes[currentTheme] || oneDark,
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            updateCallback();
          }
        }),
        EditorView.theme({
          '.cm-scroller': {
            fontSize: `${fontSize}px`,
          }
        })
      ]
    }),
    parent: htmlEditorDiv
  });
  
  // Create CSS editor
  const cssPane = document.getElementById('css-pane');
  const cssTextarea = document.getElementById('css-input');
  const cssContent = cssTextarea.value;
  
  // Remove textarea
  cssTextarea.remove();
  
  // Create new editor div
  const cssEditorDiv = document.createElement('div');
  cssEditorDiv.id = 'css-editor';
  cssEditorDiv.style.height = '200px';
  cssPane.appendChild(cssEditorDiv);
  
  // Initialize CSS editor
  cssEditor = new EditorView({
    state: EditorState.create({
      doc: cssContent,
      extensions: [
        lineNumbers(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        css(),
        themes[currentTheme] || oneDark,
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            updateCallback();
          }
        }),
        EditorView.theme({
          '.cm-scroller': {
            fontSize: `${fontSize}px`,
          }
        })
      ]
    }),
    parent: cssEditorDiv
  });
  
  // Create JS editor
  const jsPane = document.getElementById('js-pane');
  const jsTextarea = document.getElementById('js-input');
  const jsContent = jsTextarea.value;
  
  // Remove textarea
  jsTextarea.remove();
  
  // Create new editor div
  const jsEditorDiv = document.createElement('div');
  jsEditorDiv.id = 'js-editor';
  jsEditorDiv.style.height = '200px';
  jsPane.appendChild(jsEditorDiv);
  
  // Initialize JS editor
  jsEditor = new EditorView({
    state: EditorState.create({
      doc: jsContent,
      extensions: [
        lineNumbers(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        javascript(),
        themes[currentTheme] || oneDark,
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            updateCallback();
          }
        }),
        EditorView.theme({
          '.cm-scroller': {
            fontSize: `${fontSize}px`,
          }
        })
      ]
    }),
    parent: jsEditorDiv
  });
  
  // Setup theme change listener
  document.getElementById('theme-select').addEventListener('change', updateTheme);
  document.getElementById('font-size').addEventListener('input', updateFontSize);
}

// Get content from editors
function getEditorContents() {
  return {
    html: htmlEditor.state.doc.toString(),
    css: cssEditor.state.doc.toString(),
    js: jsEditor.state.doc.toString()
  };
}

// Update theme for all editors
function updateTheme() {
  const theme = document.getElementById('theme-select').value;
  const selectedTheme = themes[theme] || oneDark;
  
  // Update HTML editor
  htmlEditor.dispatch({
    effects: EditorState.reconfigure.of(selectedTheme)
  });
  
  // Update CSS editor
  cssEditor.dispatch({
    effects: EditorState.reconfigure.of(selectedTheme)
  });
  
  // Update JS editor
  jsEditor.dispatch({
    effects: EditorState.reconfigure.of(selectedTheme)
  });
}

// Update font size for all editors
function updateFontSize() {
  const fontSize = document.getElementById('font-size').value;
  const fontSizeTheme = EditorView.theme({
    '.cm-scroller': {
      fontSize: `${fontSize}px`,
    }
  });
  
  // Update HTML editor
  htmlEditor.dispatch({
    effects: EditorState.reconfigure.of(fontSizeTheme)
  });
  
  // Update CSS editor
  cssEditor.dispatch({
    effects: EditorState.reconfigure.of(fontSizeTheme)
  });
  
  // Update JS editor
  jsEditor.dispatch({
    effects: EditorState.reconfigure.of(fontSizeTheme)
  });
}

// Set content to editors
function setEditorContents(html, css, js) {
  htmlEditor.dispatch({
    changes: {from: 0, to: htmlEditor.state.doc.length, insert: html || ''}
  });
  
  cssEditor.dispatch({
    changes: {from: 0, to: cssEditor.state.doc.length, insert: css || ''}
  });
  
  jsEditor.dispatch({
    changes: {from: 0, to: jsEditor.state.doc.length, insert: js || ''}
  });
}

export {
  createEditors,
  getEditorContents,
  setEditorContents
};