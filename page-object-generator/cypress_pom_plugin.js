// === content-script.ts ===
// Injected into every page to scan DOM
export function scanDOM() {
  const elements = document.querySelectorAll('*');
  const selectors: Record<string, string> = {};

  elements.forEach((el, index) => {
    const tag = el.tagName.toLowerCase();
    const id = el.getAttribute('id');
    const dataTestId = el.getAttribute('data-test-id') || el.getAttribute('data-testid');
    const dataRole = el.getAttribute('data-role');
    const ariaLabel = el.getAttribute('aria-label');

    let selector = '';
    if (id) selector = `#${id}`;
    else if (dataTestId) selector = `[data-test-id="${dataTestId}"]`;
    else if (dataRole) selector = `[data-role="${dataRole}"]`;
    else if (ariaLabel) selector = `[aria-label="${ariaLabel}"]`;
    else selector = `${tag}:nth-of-type(${index + 1})`;

    const name = (dataTestId || id || tag + index).replace(/[^a-zA-Z0-9]/g, '_');
    selectors[name] = selector;
  });

  return selectors;
}

// === background.ts ===
// Handles requests from popup or browser connection
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'SCAN_PAGE') {
    chrome.scripting.executeScript(
      {
        target: { tabId: sender.tab.id },
        func: scanDOM,
      },
      (result) => {
        sendResponse(result?.[0]?.result);
      }
    );
    return true; // async
  }
});

// === generator.ts ===
// Generates POM in TypeScript
export function generatePageObject(selectors: Record<string, string>, pageName: string): string {
  const className = `${pageName[0].toUpperCase() + pageName.slice(1)}Page`;
  const methods = Object.entries(selectors).map(([name, selector]) => {
    return `  ${name}() {
    return cy.get('${selector}');
  }`;
  });

  return `// ${pageName}.ts
export class ${className} {
  visit() {
    cy.visit('/${pageName.toLowerCase()}');
  }

${methods.join('\n\n')}
}`;
}
