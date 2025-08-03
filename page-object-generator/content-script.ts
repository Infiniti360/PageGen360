// === Page Object Generator - Content Script ===
// Injected into every page to scan DOM
console.log('Content script loaded on:', window.location.href);

// Enhanced element detection for sophisticated components
function detectElementType(element: Element): { 
  elementType: string; 
  isTable: boolean; 
  isDropdown: boolean; 
  isMultiSelect: boolean; 
  hasActions: boolean; 
  rowSelector?: string; 
  actionSelectors?: string[] 
} {
  const tag = element.tagName.toLowerCase();
  const className = element.getAttribute('class') || '';
  const role = element.getAttribute('role') || '';
  const type = element.getAttribute('type') || '';
  const id = element.getAttribute('id') || '';
  const name = element.getAttribute('name') || '';
  const placeholder = element.getAttribute('placeholder') || '';
  
  // Table detection
  const isTable = tag === 'table' || 
                  className.includes('table') || 
                  className.includes('grid') || 
                  className.includes('datatable') ||
                  role === 'grid' ||
                  role === 'table';
  
  // Dropdown detection
  const isDropdown = tag === 'select' || 
                     className.includes('dropdown') || 
                     className.includes('select') ||
                     className.includes('combobox') ||
                     role === 'combobox' ||
                     role === 'listbox';
  
  // Multi-select detection
  const isMultiSelect = isDropdown && element.hasAttribute('multiple');
  
  // Action buttons detection (for tables)
  const hasActions = className.includes('action') || 
                     className.includes('button') ||
                     tag === 'button' ||
                     tag === 'a';
  
  // Row selector for tables
  const rowSelector = isTable ? 'tr' : undefined;
  
  // Action selectors for table rows
  const actionSelectors = isTable ? [
    'button[data-action]',
    'a[data-action]',
    '.action-button',
    '.row-action',
    'input[type="checkbox"]'
  ] : undefined;
  
  // Enhanced element type detection for modern web applications
  let elementType = tag;
  
  // Check for authentication elements
  if (id?.includes('login') || id?.includes('auth') || className.includes('login') || className.includes('auth')) {
    elementType = 'auth';
  }
  // Check for session/cookie elements
  else if (id?.includes('session') || id?.includes('cookie') || className.includes('session') || className.includes('cookie')) {
    elementType = 'session';
  }
  // Check for e-commerce elements
  else if (id?.includes('cart') || id?.includes('shop') || id?.includes('product') || className.includes('cart') || className.includes('shop') || className.includes('product')) {
    elementType = 'ecommerce';
  }
  // Check for payment elements
  else if (id?.includes('payment') || id?.includes('card') || id?.includes('pay') || className.includes('payment') || className.includes('card') || className.includes('pay')) {
    elementType = 'payment';
  }
  // Check for file upload/download elements
  else if (id?.includes('upload') || id?.includes('download') || className.includes('upload') || className.includes('download')) {
    elementType = 'fileUpload';
  }
  // Check for export/import elements
  else if (id?.includes('export') || id?.includes('import') || className.includes('export') || className.includes('import')) {
    elementType = 'export';
  }
  // Check for cross-browser/OS elements
  else if (id?.includes('browser') || id?.includes('os') || className.includes('browser') || className.includes('os')) {
    elementType = 'crossBrowser';
  }
  // Check for password elements
  else if (type === 'password' || id?.includes('password') || className.includes('password')) {
    elementType = 'password';
  }
  // Check for file input elements
  else if (type === 'file') {
    elementType = 'file';
  }
  // Check for form elements
  else if (tag === 'form') {
    elementType = 'form';
  }
  // Check for shopping cart elements
  else if (id?.includes('cart') || className.includes('cart')) {
    elementType = 'cart';
  }
  // Check for product elements
  else if (id?.includes('product') || className.includes('product')) {
    elementType = 'product';
  }
  // Check for date and calendar elements
  else if (type === 'date' || type === 'datetime-local' || id?.includes('date') || className.includes('date') || className.includes('calendar')) {
    elementType = 'date';
  }
  else if (tag === 'input' && (type === 'date' || type === 'datetime-local' || type === 'time')) {
    elementType = 'date';
  }
  else if (className.includes('calendar') || role === 'grid' || role === 'table') {
    elementType = 'calendar';
  }
  
  // Check for video and audio elements
  else if (tag === 'video' || className.includes('video') || id?.includes('video')) {
    elementType = 'video';
  }
  else if (tag === 'audio' || className.includes('audio') || id?.includes('audio')) {
    elementType = 'audio';
  }
  
  // Check for iframe elements
  else if (tag === 'iframe' || className.includes('iframe') || id?.includes('iframe')) {
    elementType = 'iframe';
  }
  
  // Check for tab elements
  else if (className.includes('tab') || role === 'tab' || id?.includes('tab')) {
    elementType = 'tab';
  }
  
  // Check for popup and modal elements
  else if (className.includes('popup') || className.includes('modal') || role === 'dialog' || id?.includes('popup') || id?.includes('modal')) {
    elementType = 'popup';
  }
  else if (role === 'dialog' || className.includes('modal')) {
    elementType = 'modal';
  }
  
  // Check for phone number elements
  else if (type === 'tel' || id?.includes('phone') || className.includes('phone') || placeholder?.includes('phone')) {
    elementType = 'phone';
  }
  
  // Check for country selection elements
  else if (id?.includes('country') || className.includes('country') || name?.includes('country')) {
    elementType = 'country';
  }
  
  // Check for locale settings
  else if (id?.includes('locale') || className.includes('locale') || name?.includes('locale')) {
    elementType = 'locale';
  }
  
  // Check for date format elements
  else if (id?.includes('dateFormat') || className.includes('dateFormat') || name?.includes('dateFormat')) {
    elementType = 'dateFormat';
  }
  
  // Check for gender/sex selection
  else if (id?.includes('gender') || id?.includes('sex') || className.includes('gender') || className.includes('sex') || name?.includes('gender') || name?.includes('sex')) {
    elementType = 'gender';
  }
  
  // Check for enhanced radio buttons
  else if (type === 'radio' || role === 'radio' || className.includes('radio')) {
    elementType = 'radio';
  }
  
  // Check for enhanced checkboxes
  else if (type === 'checkbox' || role === 'checkbox' || className.includes('checkbox')) {
    elementType = 'checkbox';
  }
  
  // Check for dynamic search elements
  else if (id?.includes('search') || className.includes('search') || role === 'search' || type === 'search') {
    elementType = 'dynamicSearch';
  }
  
  // Check for autocomplete elements
  else if (id?.includes('autocomplete') || className.includes('autocomplete') || role === 'combobox') {
    elementType = 'autocomplete';
  }
  
  // Check for map elements
  else if (id?.includes('map') || className.includes('map') || tag === 'map') {
    elementType = 'map';
  }
  
  // Check for slider elements
  else if (type === 'range' || className.includes('slider') || role === 'slider') {
    elementType = 'slider';
  }
  
  // Check for rating elements
  else if (className.includes('rating') || role === 'slider' || id?.includes('rating')) {
    elementType = 'rating';
  }
  
  // Check for progress elements
  else if (tag === 'progress' || className.includes('progress') || role === 'progressbar') {
    elementType = 'progress';
  }
  
  // Check for spinner elements
  else if (className.includes('spinner') || id?.includes('spinner')) {
    elementType = 'spinner';
  }
  
  // Check for accordion elements
  else if (className.includes('accordion') || role === 'region') {
    elementType = 'accordion';
  }
  
  // Check for carousel elements
  else if (className.includes('carousel') || className.includes('slider') || role === 'region') {
    elementType = 'carousel';
  }
  
  // Check for tabs elements
  else if (className.includes('tabs') || role === 'tablist') {
    elementType = 'tabs';
  }
  
  // Check for tooltip elements
  else if (className.includes('tooltip') || role === 'tooltip') {
    elementType = 'tooltip';
  }
  
  // Check for notification elements
  else if (className.includes('notification') || role === 'alert') {
    elementType = 'notification';
  }
  
  // Check for breadcrumb elements
  else if (className.includes('breadcrumb') || role === 'navigation') {
    elementType = 'breadcrumb';
  }
  
  // Check for pagination elements
  else if (className.includes('pagination') || role === 'navigation') {
    elementType = 'pagination';
  }
  
  // Check for stepper elements
  else if (className.includes('stepper') || role === 'region') {
    elementType = 'stepper';
  }
  
  // Check for wizard elements
  else if (className.includes('wizard') || role === 'region') {
    elementType = 'wizard';
  }
  
  // Check for modern web elements
  else if (tag === 'div' || tag === 'span') {
    elementType = 'modern';
  }
  
  return {
    elementType,
    isTable,
    isDropdown,
    isMultiSelect,
    hasActions,
    rowSelector,
    actionSelectors
  };
}

// Industry-standard selector strategy (priority order)
function getBestSelector(element: Element): { selector: string; type: string; name: string } {
  const tag = element.tagName.toLowerCase();
  const id = element.getAttribute('id');
  const dataTestId = element.getAttribute('data-test-id') || element.getAttribute('data-testid');
  const ariaLabel = element.getAttribute('aria-label');
  const name = element.getAttribute('name');
  const className = element.getAttribute('class');
  const textContent = element.textContent?.trim();
  const type = element.getAttribute('type');
  const placeholder = element.getAttribute('placeholder');
  const title = element.getAttribute('title');
  const role = element.getAttribute('role');
  const alt = element.getAttribute('alt');
  const src = element.getAttribute('src');
  const href = element.getAttribute('href');

  // Priority 1: data-test-id (most reliable)
  if (dataTestId) {
    return {
      selector: `[data-test-id="${dataTestId}"]`,
      type: 'data-test-id',
      name: dataTestId
    };
  }

  // Priority 2: aria-label
  if (ariaLabel) {
    return {
      selector: `[aria-label="${ariaLabel}"]`,
      type: 'aria-label',
      name: ariaLabel.replace(/[^a-zA-Z0-9]/g, '_')
    };
  }

  // Priority 3: id
  if (id) {
    return {
      selector: `#${id}`,
      type: 'id',
      name: id
    };
  }

  // Priority 4: name attribute
  if (name) {
    return {
      selector: `[name="${name}"]`,
      type: 'name',
      name: name
    };
  }

  // Priority 5: placeholder (for inputs)
  if (placeholder && tag === 'input') {
    return {
      selector: `[placeholder="${placeholder}"]`,
      type: 'placeholder',
      name: placeholder.replace(/[^a-zA-Z0-9]/g, '_')
    };
  }

  // Priority 6: title attribute
  if (title) {
    return {
      selector: `[title="${title}"]`,
      type: 'title',
      name: title.replace(/[^a-zA-Z0-9]/g, '_')
    };
  }

  // Priority 7: alt attribute (for images)
  if (alt && tag === 'img') {
    return {
      selector: `img[alt="${alt}"]`,
      type: 'alt',
      name: alt.replace(/[^a-zA-Z0-9]/g, '_')
    };
  }

  // Priority 8: role attribute
  if (role) {
    return {
      selector: `[role="${role}"]`,
      type: 'role',
      name: role
    };
  }

  // Priority 9: text content for buttons and links
  if (textContent && (tag === 'button' || tag === 'a') && textContent.length < 50) {
    return {
      selector: `${tag}:contains("${textContent}")`,
      type: 'text',
      name: textContent.replace(/[^a-zA-Z0-9]/g, '_')
    };
  }

  // Priority 10: class-based selector
  if (className) {
    const classes = className.split(' ').filter(c => c.length > 0);
    if (classes.length > 0) {
      return {
        selector: `.${classes[0]}`,
        type: 'class',
        name: classes[0]
      };
    }
  }

  // Priority 11: href for links
  if (href && tag === 'a') {
    return {
      selector: `a[href="${href}"]`,
      type: 'href',
      name: href.replace(/[^a-zA-Z0-9]/g, '_')
    };
  }

  // Priority 12: src for images
  if (src && tag === 'img') {
    return {
      selector: `img[src="${src}"]`,
      type: 'src',
      name: src.replace(/[^a-zA-Z0-9]/g, '_')
    };
  }

  // Fallback: nth-child
  const parent = element.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children).filter(child => child.tagName === tag);
    const index = siblings.indexOf(element) + 1;
    return {
      selector: `${tag}:nth-child(${index})`,
      type: 'nth-child',
      name: `${tag}_${index}`
    };
  }

  return {
    selector: tag,
    type: 'tag',
    name: tag
  };
}

// Generate meaningful method names with improved logic
function generateMethodName(element: Element, selectorInfo: { selector: string; type: string; name: string }): string {
  const tag = element.tagName.toLowerCase();
  const type = element.getAttribute('type');
  const textContent = element.textContent?.trim();
  const placeholder = element.getAttribute('placeholder');
  const ariaLabel = element.getAttribute('aria-label');
  const name = element.getAttribute('name');
  const id = element.getAttribute('id');
  const alt = element.getAttribute('alt');
  const role = element.getAttribute('role');

  let baseName = '';

  // Priority 1: Use ID if available (most reliable for naming)
  if (id) {
    baseName = id;
  }
  // Priority 2: Use data-test-id
  else if (selectorInfo.type === 'data-test-id') {
    baseName = selectorInfo.name;
  }
  // Priority 3: Use aria-label
  else if (ariaLabel) {
    baseName = ariaLabel;
  }
  // Priority 4: Use placeholder
  else if (placeholder) {
    baseName = placeholder;
  }
  // Priority 5: Use name attribute
  else if (name) {
    baseName = name;
  }
  // Priority 6: Use alt attribute for images
  else if (alt && tag === 'img') {
    baseName = alt;
  }
  // Priority 7: Use role attribute
  else if (role) {
    baseName = role;
  }
  // Priority 8: Use text content (if short and meaningful)
  else if (textContent && textContent.length < 30 && textContent.length > 0) {
    baseName = textContent;
  }
  // Priority 9: Use selector name
  else {
    baseName = selectorInfo.name;
  }

  // Clean the name - remove special characters and spaces
  baseName = baseName
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
    .replace(/\s+/g, '_'); // Replace spaces with underscores

  // Ensure the name is not empty
  if (!baseName || baseName.length === 0) {
    baseName = `${tag}_element`;
  }

  // Generate action-based method name
  if (tag === 'input') {
    if (type === 'checkbox' || type === 'radio') {
      return `check${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
    } else if (type === 'submit' || type === 'button') {
      return `click${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
    } else {
      return `enter${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
    }
  } else if (tag === 'button') {
    return `click${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
  } else if (tag === 'a') {
    return `click${baseName.charAt(0).toUpperCase() + baseName.slice(1)}Link`;
  } else if (tag === 'select') {
    return `select${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
  } else if (tag === 'img') {
    return `click${baseName.charAt(0).toUpperCase() + baseName.slice(1)}Image`;
  } else if (tag === 'div' || tag === 'span' || tag === 'section' || tag === 'article') {
    return `click${baseName.charAt(0).toUpperCase() + baseName.slice(1)}Element`;
  } else {
    return `click${baseName.charAt(0).toUpperCase() + baseName.slice(1)}`;
  }
}

// Check if element is interactive or important
function isInteractiveElement(element: Element): boolean {
  const tag = element.tagName.toLowerCase();
  const type = element.getAttribute('type');
  const role = element.getAttribute('role');
  const tabIndex = element.getAttribute('tabindex');
  const onClick = element.getAttribute('onclick');
  const hasClickHandler = element.hasAttribute('onclick') || element.hasAttribute('onclick');
  
  // Standard interactive elements
  if (['input', 'button', 'a', 'select', 'textarea', 'label', 'img'].includes(tag)) {
    return true;
  }
  
  // Elements with data-test-id (important for testing)
  if (element.hasAttribute('data-test-id') || element.hasAttribute('data-testid')) {
    return true;
  }
  
  // Elements with aria-label (accessible)
  if (element.hasAttribute('aria-label')) {
    return true;
  }
  
  // Elements with role attribute
  if (role && ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio'].includes(role)) {
    return true;
  }
  
  // Elements with tabindex (keyboard accessible)
  if (tabIndex && tabIndex !== '-1') {
    return true;
  }
  
  // Elements with click handlers
  if (hasClickHandler) {
    return true;
  }
  
  // Custom elements (web components)
  if (tag.includes('-')) {
    return true;
  }
  
  // Elements with specific classes that suggest interactivity
  const className = element.getAttribute('class') || '';
  const interactiveClasses = ['btn', 'button', 'link', 'clickable', 'interactive', 'card', 'menu', 'nav', 'tab'];
  if (interactiveClasses.some(cls => className.includes(cls))) {
    return true;
  }
  
  // Images that are likely clickable (inside links or have click handlers)
  if (tag === 'img' && (element.closest('a') || hasClickHandler)) {
    return true;
  }
  
  // Divs and spans that might be interactive
  if (['div', 'span', 'section', 'article'].includes(tag)) {
    // Check if parent is interactive
    const parent = element.parentElement;
    if (parent && isInteractiveElement(parent)) {
      return true;
    }
    
    // Check if has interactive children
    const hasInteractiveChildren = element.querySelector('button, a, input, [data-test-id], [aria-label]');
    if (hasInteractiveChildren) {
      return true;
    }
  }
  
  return false;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('Content script received message:', msg);
  console.log('Sender:', sender);
  
  if (msg.type === 'SCAN_DOM') {
    console.log('Starting comprehensive DOM scan...');
    
    try {
      // Get ALL elements and filter for interactive ones
      const allElements = document.querySelectorAll('*');
      console.log('Total elements found:', allElements.length);
      
      const selectors: Record<string, any> = {};
      const elementInfo: any[] = [];
      const usedSelectors = new Set<string>();
      const usedMethodNames = new Set<string>();

      allElements.forEach((el, index) => {
        // Skip if not interactive
        if (!isInteractiveElement(el)) {
          return;
        }
        
        const selectorInfo = getBestSelector(el);
        const methodName = generateMethodName(el, selectorInfo);
        
        // Skip if we already have this exact selector
        if (usedSelectors.has(selectorInfo.selector)) {
          console.log('Skipping duplicate selector:', selectorInfo.selector);
          return;
        }
        
        // Handle duplicate method names by adding a suffix
        let finalMethodName = methodName;
        let counter = 1;
        while (usedMethodNames.has(finalMethodName)) {
          finalMethodName = `${methodName}_${counter}`;
          counter++;
        }
        
        // Create unique key
        const key = `${finalMethodName}_${index}`;
        
        const elementTypeInfo = detectElementType(el);
        
        selectors[key] = {
          selector: selectorInfo.selector,
          type: selectorInfo.type,
          methodName: finalMethodName,
          elementType: elementTypeInfo.elementType,
          attributes: {
            id: el.getAttribute('id'),
            name: el.getAttribute('name'),
            type: el.getAttribute('type'),
            'data-test-id': el.getAttribute('data-test-id'),
            'aria-label': el.getAttribute('aria-label'),
            placeholder: el.getAttribute('placeholder'),
            textContent: el.textContent?.trim(),
            role: el.getAttribute('role'),
            alt: el.getAttribute('alt'),
            src: el.getAttribute('src'),
            href: el.getAttribute('href'),
            className: el.getAttribute('class')
          },
          isTable: elementTypeInfo.isTable,
          isDropdown: elementTypeInfo.isDropdown,
          isMultiSelect: elementTypeInfo.isMultiSelect,
          hasActions: elementTypeInfo.hasActions,
          rowSelector: elementTypeInfo.rowSelector,
          actionSelectors: elementTypeInfo.actionSelectors
        };
        
        elementInfo.push({
          key,
          element: el,
          selectorInfo,
          methodName: finalMethodName
        });
        
        // Track used selectors and method names
        usedSelectors.add(selectorInfo.selector);
        usedMethodNames.add(finalMethodName);
      });

      console.log('Generated selectors:', selectors);
      console.log('Number of interactive elements found:', Object.keys(selectors).length);
      
      sendResponse({
        selectors,
        elementInfo,
        pageTitle: document.title,
        pageUrl: window.location.href,
        totalElements: allElements.length,
        interactiveElements: Object.keys(selectors).length
      });
    } catch (error: any) {
      console.error('Error scanning DOM:', error);
      sendResponse({ error: error.message });
    }
    
    return true; // async
  } else {
    console.log('Unknown message type:', msg.type);
    sendResponse({ error: 'Unknown message type' });
  }
});

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
  