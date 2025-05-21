// Code formatting utilities using Prettier
import * as prettier from 'prettier/standalone';
import htmlParser from 'prettier/parser-html';
import cssParser from 'prettier/parser-postcss';
import babelParser from 'prettier/parser-babel';

// Format HTML code
export function formatHTML(code) {
  try {
    return prettier.format(code, {
      parser: 'html',
      plugins: [htmlParser],
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: false,
      trailingComma: 'none',
      bracketSpacing: true,
      arrowParens: 'avoid',
      htmlWhitespaceSensitivity: 'css'
    });
  } catch (error) {
    console.error('HTML formatting error:', error);
    return code; // Return original code if formatting fails
  }
}

// Format CSS code
export function formatCSS(code) {
  try {
    return prettier.format(code, {
      parser: 'css',
      plugins: [cssParser],
      printWidth: 100,
      tabWidth: 2,
      useTabs: false
    });
  } catch (error) {
    console.error('CSS formatting error:', error);
    return code; // Return original code if formatting fails
  }
}

// Format JavaScript code
export function formatJS(code) {
  try {
    return prettier.format(code, {
      parser: 'babel',
      plugins: [babelParser],
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      trailingComma: 'es5',
      bracketSpacing: true,
      arrowParens: 'avoid'
    });
  } catch (error) {
    console.error('JavaScript formatting error:', error);
    return code; // Return original code if formatting fails
  }
}
