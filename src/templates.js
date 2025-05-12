// Predefined code templates for the Live Snippet Embedder
// These templates provide users with ready-to-use snippets

export const templates = {
  // Responsive Flexbox Layout Template
  "responsive-flexbox": {
    name: "Responsive Flexbox Layout",
    description: "A responsive flexbox layout with media queries",
    html: `<div class="flex-container">
  <div class="flex-item">Item 1</div>
  <div class="flex-item">Item 2</div>
  <div class="flex-item">Item 3</div>
  <div class="flex-item">Item 4</div>
</div>`,
    css: `.flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.flex-item {
  flex: 1 1 200px;
  margin: 10px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .flex-item {
    flex: 1 1 100%;
  }
}`,
    js: `// You can add JavaScript to dynamically adjust the layout
// For example:
document.querySelectorAll('.flex-item').forEach((item, index) => {
  item.addEventListener('click', () => {
    item.style.backgroundColor = getRandomColor();
  });
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}`
  },

  // CSS Grid Layout Template
  "responsive-grid": {
    name: "Responsive CSS Grid Layout",
    description: "A responsive grid layout using CSS Grid",
    html: `<div class="grid-container">
  <div class="grid-item header">Header</div>
  <div class="grid-item sidebar">Sidebar</div>
  <div class="grid-item main">Main Content</div>
  <div class="grid-item footer">Footer</div>
</div>`,
    css: `.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  grid-gap: 10px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.grid-item {
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.header {
  grid-column: 1 / -1;
  background-color: #e0e0ff;
}

.sidebar {
  grid-column: 1 / 2;
  grid-row: 2 / 4;
  background-color: #e0ffe0;
}

.main {
  grid-column: 2 / -1;
  grid-row: 2 / 3;
  background-color: #ffe0e0;
  min-height: 200px;
}

.footer {
  grid-column: 1 / -1;
  background-color: #ffe0ff;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar, .main, .footer {
    grid-column: 1 / -1;
    grid-row: auto;
  }
}`,
    js: `// Add interactivity to the grid layout
document.querySelectorAll('.grid-item').forEach(item => {
  item.addEventListener('click', () => {
    // Toggle a class when clicked
    item.classList.toggle('expanded');
  });
});

// Add the expanded styles via JavaScript
const style = document.createElement('style');
style.textContent = \`
  .grid-item.expanded {
    transform: scale(1.05);
    transition: transform 0.3s ease;
    z-index: 1;
  }
\`;
document.head.appendChild(style);`
  },

  // Animated Button Template
  "animated-button": {
    name: "Button with Hover Animation",
    description: "A button with smooth hover animations",
    html: `<button class="animated-button">Hover Me</button>`,
    css: `.animated-button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.animated-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.animated-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
}

.animated-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transition: left 0.6s ease;
}

.animated-button:hover::before {
  left: 100%;
}`,
    js: `// Add click effect
const button = document.querySelector('.animated-button');

button.addEventListener('click', () => {
  // Add ripple effect
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  button.appendChild(ripple);
  
  // Position the ripple
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = \`\${size}px\`;
  ripple.style.left = \`\${event.clientX - rect.left - size/2}px\`;
  ripple.style.top = \`\${event.clientY - rect.top - size/2}px\`;
  
  // Remove the ripple after animation
  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
});

// Add ripple style
const style = document.createElement('style');
style.textContent = \`
  .animated-button {
    position: relative;
  }
  
  .ripple {
    position: absolute;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple-effect 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-effect {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
\`;
document.head.appendChild(style);`
  },

  // Card Component Template
  "card-component": {
    name: "Card Component with Transitions",
    description: "A card UI component with hover effects and transitions",
    html: `<div class="card">
  <div class="card-image">
    <img src="https://via.placeholder.com/300x200" alt="Card Image">
  </div>
  <div class="card-content">
    <h3 class="card-title">Card Title</h3>
    <p class="card-description">This is a description of the card. It demonstrates a common UI pattern with hover effects.</p>
    <button class="card-button">Learn More</button>
  </div>
</div>`,
    css: `.card {
  width: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  margin: 20px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 20px;
}

.card-title {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.4em;
}

.card-description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.card-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.card-button:hover {
  background-color: #2980b9;
}`,
    js: `// Add click handler for the button
document.querySelector('.card-button').addEventListener('click', function() {
  alert('Button clicked!');
});

// Add a ripple effect to the card on click
const card = document.querySelector('.card');
card.addEventListener('click', function(e) {
  // Only apply ripple to the card itself, not its children
  if (e.target === card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.classList.add('card-ripple');
    ripple.style.left = \`\${x}px\`;
    ripple.style.top = \`\${y}px\`;
    
    card.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
});

// Add the ripple style
const style = document.createElement('style');
style.textContent = \`
  .card {
    position: relative;
    overflow: hidden;
  }
  
  .card-ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.7);
    width: 100px;
    height: 100px;
    margin-top: -50px;
    margin-left: -50px;
    animation: ripple 0.6s linear;
    transform: scale(0);
    opacity: 1;
    pointer-events: none;
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
\`;
document.head.appendChild(style);`
  },

  // Theme Toggle with CSS Variables
  "theme-toggle": {
    name: "CSS Variables & Theme Toggle",
    description: "Dark/light theme toggle using CSS variables",
    html: `<div class="theme-container">
  <header>
    <h1>Theme Toggle Example</h1>
    <button id="theme-toggle" class="theme-toggle">
      <span class="theme-toggle-icon">🌙</span>
    </button>
  </header>
  
  <main>
    <div class="card">
      <h2>CSS Variables for Theming</h2>
      <p>This example demonstrates how to use CSS Variables to create a theme switching system.</p>
      <button class="btn">Primary Button</button>
    </div>
  </main>
</div>`,
    css: `:root {
  /* Light theme (default) */
  --bg-color: #f7f7f7;
  --text-color: #333333;
  --card-bg: #ffffff;
  --card-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  --btn-bg: #3498db;
  --btn-text: white;
  --header-bg: #ffffff;
  --header-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  /* Dark theme */
  --bg-color: #1a1a1a;
  --text-color: #f7f7f7;
  --card-bg: #2d2d2d;
  --card-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
  --btn-bg: #2980b9;
  --btn-text: #f7f7f7;
  --header-bg: #2d2d2d;
  --header-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

body {
  font-family: Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

.theme-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: var(--header-bg);
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: var(--header-shadow);
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
}

.card {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: var(--card-shadow);
}

.btn {
  background-color: var(--btn-bg);
  color: var(--btn-text);
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
}

.btn:hover {
  opacity: 0.9;
}`,
    js: `// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const themeToggleIcon = document.querySelector('.theme-toggle-icon');
let currentTheme = 'light';

// Check for user's saved preference
if (localStorage.getItem('theme') === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
  themeToggleIcon.textContent = '☀️';
  currentTheme = 'dark';
}

// Toggle theme function
function toggleTheme() {
  if (currentTheme === 'light') {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeToggleIcon.textContent = '☀️';
    currentTheme = 'dark';
  } else {
    document.body.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    themeToggleIcon.textContent = '🌙';
    currentTheme = 'light';
  }
  
  // Add a subtle animation to show the theme change
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.classList.add('theme-transition');
    setTimeout(() => {
      card.classList.remove('theme-transition');
    }, 500);
  });
}

// Add click event to theme toggle button
themeToggle.addEventListener('click', toggleTheme);

// Add a style for the transition effect
const style = document.createElement('style');
style.textContent = \`
  .theme-transition {
    animation: pulse 0.5s ease;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
\`;
document.head.appendChild(style);`
  },

  // JS Tabs Implementation
  "js-tabs": {
    name: "JavaScript Tabs Interface",
    description: "A responsive tabs interface with JS interaction",
    html: `<div class="tabs-container">
  <div class="tabs">
    <button class="tab-button active" data-tab="tab1">Tab 1</button>
    <button class="tab-button" data-tab="tab2">Tab 2</button>
    <button class="tab-button" data-tab="tab3">Tab 3</button>
  </div>
  
  <div class="tab-content">
    <div id="tab1" class="tab-pane active">
      <h2>Tab Content 1</h2>
      <p>This is the content for the first tab. It demonstrates a JavaScript-powered tabs interface.</p>
    </div>
    <div id="tab2" class="tab-pane">
      <h2>Tab Content 2</h2>
      <p>This is the content for the second tab. Tabs are a common UI pattern for organizing content.</p>
    </div>
    <div id="tab3" class="tab-pane">
      <h2>Tab Content 3</h2>
      <p>This is the content for the third tab. The active tab is highlighted and its content is displayed.</p>
    </div>
  </div>
</div>`,
    css: `.tabs-container {
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
}

.tab-button {
  padding: 10px 20px;
  background: #f1f1f1;
  border: none;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  margin-right: 5px;
  transition: background-color 0.3s ease;
}

.tab-button:hover {
  background: #e0e0e0;
}

.tab-button.active {
  background: #fff;
  border: 1px solid #ddd;
  border-bottom: 1px solid #fff;
  margin-bottom: -1px;
  font-weight: bold;
}

.tab-content {
  padding: 20px;
  border: 1px solid #ddd;
  border-top: none;
  background: #fff;
}

.tab-pane {
  display: none;
}

.tab-pane.active {
  display: block;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive styles */
@media (max-width: 480px) {
  .tabs {
    flex-direction: column;
    border-bottom: none;
  }
  
  .tab-button {
    margin-right: 0;
    margin-bottom: 5px;
    border-radius: 4px;
  }
  
  .tab-button.active {
    border-bottom: 1px solid #ddd;
    margin-bottom: 5px;
  }
  
  .tab-content {
    border-top: 1px solid #ddd;
  }
}`,
    js: `// Tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

function switchTab(tabId) {
  // Hide all tab panes
  tabPanes.forEach(pane => {
    pane.classList.remove('active');
  });
  
  // Deactivate all tab buttons
  tabButtons.forEach(button => {
    button.classList.remove('active');
  });
  
  // Activate the selected tab pane
  document.getElementById(tabId).classList.add('active');
  
  // Activate the clicked tab button
  document.querySelector(\`[data-tab="\${tabId}"]\`).classList.add('active');
}

// Add click event listeners to tab buttons
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.getAttribute('data-tab');
    switchTab(tabId);
  });
});

// Optional: Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
  if (document.activeElement.classList.contains('tab-button')) {
    const currentIndex = Array.from(tabButtons).indexOf(document.activeElement);
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      const nextIndex = (currentIndex + 1) % tabButtons.length;
      tabButtons[nextIndex].focus();
      const tabId = tabButtons[nextIndex].getAttribute('data-tab');
      switchTab(tabId);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      const nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
      tabButtons[nextIndex].focus();
      const tabId = tabButtons[nextIndex].getAttribute('data-tab');
      switchTab(tabId);
    }
  }
});`
  },

  // Modal Dialog
  "modal-dialog": {
    name: "Modal Dialog",
    description: "A reusable modal dialog component with animations",
    html: `<div class="page-content">
  <h1>Modal Dialog Example</h1>
  <p>Click the button below to open a modal dialog.</p>
  <button id="open-modal" class="modal-btn">Open Modal</button>
</div>

<!-- Modal Container -->
<div id="modal-container" class="modal-container">
  <div class="modal">
    <div class="modal-header">
      <h2>Modal Title</h2>
      <button class="close-modal">&times;</button>
    </div>
    <div class="modal-body">
      <p>This is a modal dialog box with a fade-in animation. Modals are commonly used to display information or get user input without leaving the current page.</p>
    </div>
    <div class="modal-footer">
      <button id="cancel-modal" class="modal-btn cancel">Cancel</button>
      <button id="confirm-modal" class="modal-btn confirm">Confirm</button>
    </div>
  </div>
</div>`,
    css: `body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.page-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

/* Modal Styles */
.modal-container {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-container.active {
  display: flex;
  opacity: 1;
}

.modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transform: scale(0.8);
  transition: transform 0.3s ease;
}

.modal-container.active .modal {
  transform: scale(1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-modal {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #777;
}

.close-modal:hover {
  color: #000;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

/* Button Styles */
.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.modal-btn:not(.cancel):not(.confirm) {
  background-color: #4CAF50;
  color: white;
}

.modal-btn:hover:not(.cancel):not(.confirm) {
  background-color: #45a049;
}

.modal-btn.cancel {
  background-color: #f1f1f1;
  color: #333;
  margin-right: 10px;
}

.modal-btn.cancel:hover {
  background-color: #e0e0e0;
}

.modal-btn.confirm {
  background-color: #2196F3;
  color: white;
}

.modal-btn.confirm:hover {
  background-color: #0b7dda;
}`,
    js: `// Modal functionality
const openModalBtn = document.getElementById('open-modal');
const modalContainer = document.getElementById('modal-container');
const closeModalBtn = document.querySelector('.close-modal');
const cancelModalBtn = document.getElementById('cancel-modal');
const confirmModalBtn = document.getElementById('confirm-modal');

// Function to open modal
function openModal() {
  // Show modal container
  modalContainer.classList.add('active');
  
  // Prevent scrolling on the body
  document.body.style.overflow = 'hidden';
  
  // Focus the close button for accessibility
  setTimeout(() => {
    closeModalBtn.focus();
  }, 100);
}

// Function to close modal
function closeModal() {
  modalContainer.classList.remove('active');
  
  // Re-enable scrolling
  document.body.style.overflow = '';
  
  // Return focus to the opener
  openModalBtn.focus();
}

// Event listeners
openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

confirmModalBtn.addEventListener('click', () => {
  // You can add your confirmation logic here
  alert('Confirmed!');
  closeModal();
});

// Close when clicking outside the modal
modalContainer.addEventListener('click', (e) => {
  if (e.target === modalContainer) {
    closeModal();
  }
});

// Close on escape key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
    closeModal();
  }
});

// Trap focus inside modal for accessibility
modalContainer.addEventListener('keydown', (e) => {
  if (!modalContainer.classList.contains('active')) return;
  
  // Only handle tab key
  if (e.key !== 'Tab') return;
  
  // Get all focusable elements inside modal
  const focusableElements = modalContainer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // If shift+tab and on first element, move to last element
  if (e.shiftKey && document.activeElement === firstElement) {
    e.preventDefault();
    lastElement.focus();
  } 
  // If tab and on last element, move to first element
  else if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault();
    firstElement.focus();
  }
});`
  }
};