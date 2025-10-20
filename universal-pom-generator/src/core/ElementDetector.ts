import { Element } from '../types';
import { Logger } from '../utils/Logger';

export class ElementDetector {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Detect all meaningful elements on the page
   */
  async detectElements(browser: any): Promise<Element[]> {
    this.logger.debug('Starting comprehensive element detection');

    try {
      // Get all elements from the page
      const elements = await this.getAllElements(browser);
      
      // Filter meaningful elements (interactive + important content)
      const meaningfulElements = await this.filterMeaningfulElements(elements, browser);
      
      // Enhance elements with additional information
      const enhancedElements = await this.enhanceElements(meaningfulElements, browser);
      
      // Generate unique selectors for each element
      const elementsWithSelectors = await this.generateSelectors(enhancedElements);
      
      this.logger.debug(`Detected ${elementsWithSelectors.length} meaningful elements`);
      
      return elementsWithSelectors;
    } catch (error) {
      this.logger.error(`Element detection failed: ${error}`);
      throw error;
    }
  }

  /**
   * Get all elements from the page
   */
  private async getAllElements(browser: any): Promise<any[]> {
    const elements = await browser.executeScript(`
      function nearestHeadingText(el) {
        let node = el;
        while (node && node !== document) {
          const heading = node.querySelector && node.querySelector('h1,h2,h3,h4,h5,h6');
          if (heading && heading.textContent) return heading.textContent.trim();
          if (node.getAttribute && node.getAttribute('aria-label')) return node.getAttribute('aria-label');
          node = node.parentNode;
        }
        return '';
      }
      function findNearestStrongContainer(el) {
        let node = el && el.parentElement;
        while (node && node !== document) {
          const dtid = node.getAttribute && (node.getAttribute('data-test-id') || node.getAttribute('data-testid'));
          if (node.id) {
            return { id: node.id, testid: '', selector: '#' + node.id };
          }
          if (dtid) {
            return { id: '', testid: dtid, selector: '[data-test-id="' + dtid + '"]' };
          }
          node = node.parentElement;
        }
        return { id: '', testid: '', selector: '' };
      }
      function findNearestIframeSelector(el) {
        let node = el && el.parentElement;
        while (node && node !== document) {
          if (node.tagName && node.tagName.toLowerCase() === 'iframe') {
            const id = node.id || '';
            const name = node.getAttribute('name') || '';
            const dtid = node.getAttribute('data-test-id') || node.getAttribute('data-testid') || '';
            if (id) return 'iframe#' + id;
            if (dtid) return 'iframe[data-test-id="' + dtid + '"]';
            if (name) return 'iframe[name="' + name + '"]';
            const iframes = Array.from(node.parentElement?.querySelectorAll('iframe') || []);
            const idx = iframes.indexOf(node);
            if (idx >= 0) return 'iframe:nth-of-type(' + (idx + 1) + ')';
            return 'iframe';
          }
          node = node.parentElement;
        }
        return '';
      }
      function labelTextFor(el) {
        if (el.id) {
          const lbl = document.querySelector('label[for="' + el.id + '"]');
          if (lbl && lbl.textContent) return lbl.textContent.trim();
        }
        const p = el.closest && el.closest('label');
        if (p && p.textContent) return p.textContent.trim();
        const aria = el.getAttribute && el.getAttribute('aria-labelledby');
        if (aria) {
          const ref = document.getElementById(aria);
          if (ref && ref.textContent) return ref.textContent.trim();
        }
        return '';
      }
      return Array.from(document.querySelectorAll('*')).map(element => {
        const rawClass = (typeof element.className === 'string') ? element.className : (element.getAttribute && element.getAttribute('class')) || '';
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        const attrs = Array.from(element.attributes).reduce((acc, attr) => { acc[attr.name] = attr.value; return acc; }, {});
        const role = element.getAttribute('role') || '';
        const ariaLabel = element.getAttribute('aria-label') || '';
        const dataTestId = element.getAttribute('data-test-id') || element.getAttribute('data-testid') || '';
        const lblText = labelTextFor(element);
        const sectionText = nearestHeadingText(element);
        const container = findNearestStrongContainer(element);
        const iframeSel = findNearestIframeSelector(element);
        return {
          tagName: element.tagName.toLowerCase(),
          id: element.id || null,
          className: rawClass || null,
          text: element.textContent?.trim() || null,
          href: element.href || null,
          src: element.src || null,
          type: element.type || null,
          value: element.value || null,
          placeholder: element.placeholder || null,
          title: element.title || null,
          alt: element.alt || null,
          isVisible: rect.width > 0 && rect.height > 0 && computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden',
          position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          attributes: Object.assign({}, attrs, {
            'role': role,
            'aria-label': ariaLabel,
            'data-test-id': dataTestId,
            'label-text': lblText,
            'section-text': sectionText,
            'nearest-container-id': container.id,
            'nearest-container-testid': container.testid,
            'nearest-container-selector': container.selector,
            'nearest-iframe-selector': iframeSel
          }),
          children: []
        };
      });
    `);

    return elements;
  }

  /**
   * Filter meaningful elements (interactive + important content)
   */
  private async filterMeaningfulElements(elements: any[], _browser: any): Promise<any[]> {
    const meaningfulElements = elements.filter(element => {
      // Interactive elements
      const isInteractiveByTag = ['button', 'input', 'select', 'textarea', 'a'].includes(element.tagName);
      const isInteractiveByAttribute = element.attributes.onclick || 
                                     element.attributes.onchange || 
                                     element.attributes.onsubmit ||
                                     element.attributes.tabindex ||
                                     element.attributes['data-testid'] ||
                                     element.attributes['data-cy'] ||
                                     element.attributes['data-selenium'];
      const isInteractiveByRole = element.attributes.role === 'button' || 
                                 element.attributes.role === 'link' || 
                                 element.attributes.role === 'menuitem';

      // Important content elements
      const hasDataTestId = element.attributes['data-testid'] || 
                           element.attributes['data-cy'] || 
                           element.attributes['data-selenium'] ||
                           element.attributes['data-test-id'];
      const hasImportantText = element.text && element.text.length > 0 && element.text.length < 100;
      const hasImportantTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label'].includes(element.tagName);
      const hasImportantClass = element.className && typeof element.className === 'string' && (
        element.className.includes('title') || 
        element.className.includes('heading') || 
        element.className.includes('text') || 
        element.className.includes('content') ||
        element.className.includes('label')
      );
      const hasImportantId = element.id && typeof element.id === 'string' && (
        element.id.includes('title') || 
        element.id.includes('heading') || 
        element.id.includes('text') || 
        element.id.includes('content') ||
        element.id.includes('label')
      );

      return isInteractiveByTag || isInteractiveByAttribute || isInteractiveByRole || 
             hasDataTestId || (hasImportantText && (hasImportantTag || hasImportantClass || hasImportantId));
    });

    return meaningfulElements;
  }

  /**
   * Enhance elements with additional information
   */
  private async enhanceElements(elements: any[], _browser: any): Promise<Element[]> {
    const enhancedElements: Element[] = [];

    for (const element of elements) {
      const rawId: string | null = element.id;
      const normalizedId: string | undefined = rawId && rawId !== 'null' && rawId !== 'undefined' ? rawId : undefined;
      const enhancedElement: Element = {
        id: this.generateElementId(element),
        tagName: element.tagName,
        className: element.className,
        text: element.text,
        href: element.href,
        src: element.src,
        type: element.type,
        value: element.value,
        placeholder: element.placeholder,
        title: element.title,
        alt: element.alt,
        xpath: '',
        cssSelector: '',
        isInteractive: this.isInteractive(element),
        isVisible: element.isVisible,
        children: [],
        attributes: element.attributes,
        position: element.position,
      };
      if (normalizedId) {
        (enhancedElement as any).elementId = normalizedId;
      }

      enhancedElements.push(enhancedElement);
    }

    return enhancedElements;
  }

  /**
   * Generate unique selectors for elements
   */
  private async generateSelectors(elements: Element[]): Promise<Element[]> {
    for (const element of elements) {
      // Generate preferred CSS selector
      element.cssSelector = this.generatePreferredCSSSelector(element);
      // Generate preferred XPath
      element.xpath = this.generatePreferredXPath(element);
    }

    return elements;
  }

  /**
   * Generate unique CSS selector for element
   */
  private generatePreferredCSSSelector(element: Element): string {
    // Prefer data-test-id
    const dtid = element.attributes?.['data-test-id'] || element.attributes?.['data-testid'];
    if (dtid) return `[data-test-id="${dtid}"]`;
    // Try stable id; avoid volatile
    const id = element.elementId;
    if (id && id !== 'null' && id !== 'undefined') {
      if (/^_?hj/i.test(id)) {
        // volatile; skip
      } else if (/\d{4,}$/.test(id)) {
        const prefix = id.replace(/\d{4,}$/, '');
        if (prefix) return `[id^="${prefix}"]`;
      } else {
        return `#${id}`;
      }
    }
    // Container + classes
    const containerSel = element.attributes?.['nearest-container-selector'];
    if (containerSel && element.className) {
      const classStr = typeof element.className === 'string' ? element.className : '';
      const classes = classStr.split(' ').filter(Boolean).map(c => `.${c}`).join('');
      if (classes) return `${containerSel} ${classes}`;
    }
    // Fallback to tag + attribute hints
    let selector = element.tagName;
    if (element.type) selector += `[type="${element.type}"]`;
    if (element.placeholder) selector += `[placeholder="${element.placeholder}"]`;
    if (element.title) selector += `[title="${element.title}"]`;
    return selector;
  }

  /**
   * Generate unique XPath for element
   */
  private generatePreferredXPath(element: Element): string {
    const tag = element.tagName;
    const dtid = element.attributes?.['data-test-id'] || element.attributes?.['data-testid'];
    if (dtid) return `//${tag}[@data-test-id="${dtid}"]`;
    const id = element.elementId;
    if (id && id !== 'null' && id !== 'undefined') {
      if (/^_?hj/i.test(id)) {
        // volatile; skip exact id
      } else if (/\d{4,}$/.test(id)) {
        const prefix = id.replace(/\d{4,}$/, '');
        if (prefix) return `//${tag}[starts-with(@id, "${prefix}")]`;
      } else {
        return `//${tag}[@id="${id}"]`;
      }
    }
    // Container-aware
    const containerSel = element.attributes?.['nearest-container-selector'];
    if (containerSel) {
      // Convert simple container selectors to XPath prefix, best-effort
      if (containerSel.startsWith('#')) {
        return `//*[@id="${containerSel.slice(1)}"]//${tag}`;
      }
      const m = containerSel.match(/\[data-test-id="([^"]+)"\]/);
      if (m) {
        return `//*[@data-test-id="${m[1]}"]//${tag}`;
      }
    }
    // Fallback using class contains
    if (element.className) {
      const classStr = typeof element.className === 'string' ? element.className : '';
      const first = classStr.split(' ').filter(Boolean)[0];
      if (first) return `//${tag}[contains(@class, "${first}")]`;
    }
    return `//${tag}`;
  }

  // Deprecated legacy browser-assisted helpers removed

  /**
   * Check if element is interactive
   */
  private isInteractive(element: any): boolean {
    const interactiveTags = ['button', 'input', 'select', 'textarea', 'a'];
    const interactiveTypes = ['button', 'submit', 'reset', 'checkbox', 'radio', 'file'];
    
    return interactiveTags.includes(element.tagName) || 
           (element.tagName === 'input' && interactiveTypes.includes(element.type));
  }

  /**
   * Generate unique element ID
   */
  private generateElementId(element: any): string {
    const parts = [];
    
    if (element.id) {
      parts.push(element.id);
    }
    
    if (element.className) {
      const classStr = typeof element.className === 'string' ? element.className : '';
      parts.push(classStr.split(' ')[0]);
    }
    
    if (element.text) {
      parts.push(element.text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, ''));
    }
    
    if (element.placeholder) {
      parts.push(element.placeholder.replace(/[^a-zA-Z0-9]/g, ''));
    }
    
    if (element.type) {
      parts.push(element.type);
    }
    
    return parts.join('_').toLowerCase() || `${element.tagName}_${Date.now()}`;
  }

  /**
   * Detect changes between old and new elements
   */
  async detectChanges(oldElements: Element[], newElements: Element[]): Promise<{
    added: Element[];
    removed: Element[];
    modified: Element[];
  }> {
    const added: Element[] = [];
    const removed: Element[] = [];
    const modified: Element[] = [];

    // Find added elements
    for (const newElement of newElements) {
      const oldElement = oldElements.find(e => e.id === newElement.id);
      if (!oldElement) {
        added.push(newElement);
      } else if (this.hasChanged(oldElement, newElement)) {
        modified.push(newElement);
      }
    }

    // Find removed elements
    for (const oldElement of oldElements) {
      const newElement = newElements.find(e => e.id === oldElement.id);
      if (!newElement) {
        removed.push(oldElement);
      }
    }

    return { added, removed, modified };
  }

  /**
   * Check if element has changed
   */
  private hasChanged(oldElement: Element, newElement: Element): boolean {
    return oldElement.text !== newElement.text ||
           oldElement.value !== newElement.value ||
           oldElement.href !== newElement.href ||
           oldElement.src !== newElement.src ||
           oldElement.placeholder !== newElement.placeholder ||
           oldElement.title !== newElement.title ||
           oldElement.cssSelector !== newElement.cssSelector ||
           oldElement.xpath !== newElement.xpath;
  }
} 