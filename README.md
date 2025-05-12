# Live Snippet Embedder

A Figma plugin that allows you to embed live code snippets into your designs with syntax highlighting.

## Features

- Insert code snippets directly into your Figma designs
- Syntax highlighting for multiple programming languages
- Different themes (Dracula, GitHub, Monokai, Solarized Light)
- Customizable font size
- Edit existing code snippets

## Supported Languages

- JavaScript
- TypeScript
- HTML
- CSS
- Python
- Ruby
- Java
- Swift
- Go
- Rust
- C++
- C#
- PHP
- JSON
- XML
- Markdown
- SQL
- Bash

## How to Use

1. Install the plugin from the Figma Plugin store
2. Run the plugin by right-clicking and selecting Plugins > Live Snippet Embedder > Insert Code Snippet
3. Paste your code into the text area
4. Select the language, theme, and font size
5. Click "Create Snippet"

To edit an existing snippet:
1. Select the code snippet frame in your design
2. Right-click and select Plugins > Live Snippet Embedder > Edit Snippet
3. Make your changes and click "Update Snippet"

## Development

### Prerequisites

- Node.js and npm

### Setup

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to compile TypeScript
4. In Figma, go to Plugins > Development > Import plugin from manifest...
5. Select the manifest.json file from this repository

### Development Commands

- `npm run build`: Compile TypeScript files
- `npm run watch`: Watch for changes and compile TypeScript files

## License

MIT
