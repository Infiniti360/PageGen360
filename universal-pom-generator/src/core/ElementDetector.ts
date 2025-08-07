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
      return Array.from(document.querySelectorAll('*')).map(element => {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        
        return {
          tagName: element.tagName.toLowerCase(),
          id: element.id || null,
          className: element.className || null,
          text: element.textContent?.trim() || null,
          href: element.href || null,
          src: element.src || null,
          type: element.type || null,
          value: element.value || null,
          placeholder: element.placeholder || null,
          title: element.title || null,
          alt: element.alt || null,
          isVisible: rect.width > 0 && rect.height > 0 && computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden',
          position: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
          },
          attributes: Array.from(element.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          }, {}),
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
  private async enhanceElements(elements: any[], browser: any): Promise<Element[]> {
    const enhancedElements: Element[] = [];

    for (const element of elements) {
      const enhancedElement: Element = {
        id: this.generateElementId(element),
        tagName: element.tagName,
        className: element.className,
        elementId: element.id,
        text: element.text,
        href: element.href,
        src: element.src,
        type: element.type,
        value: element.value,
        placeholder: element.placeholder,
        title: element.title,
        alt: element.alt,
        xpath: await this.generateXPath(element, browser),
        cssSelector: await this.generateCSSSelector(element, browser),
        isInteractive: this.isInteractive(element),
        isVisible: element.isVisible,
        children: [],
        attributes: element.attributes,
        position: element.position,
      };

      enhancedElements.push(enhancedElement);
    }

    return enhancedElements;
  }

  /**
   * Generate unique selectors for elements
   */
  private async generateSelectors(elements: Element[]): Promise<Element[]> {
    for (const element of elements) {
      // Generate CSS selector
      if (!element.cssSelector) {
        element.cssSelector = this.generateUniqueCSSSelector(element);
      }

      // Generate XPath
      if (!element.xpath) {
        element.xpath = this.generateUniqueXPath(element);
      }
    }

    return elements;
  }

  /**
   * Generate unique CSS selector for element
   */
  private generateUniqueCSSSelector(element: Element): string {
    let selector = element.tagName;

    // Add ID if available
    if (element.id) {
      return `#${element.id}`;
    }

    // Add class if available
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }

    // Add attributes for uniqueness
    if (element.type) {
      selector += `[type="${element.type}"]`;
    }

    if (element.placeholder) {
      selector += `[placeholder="${element.placeholder}"]`;
    }

    if (element.title) {
      selector += `[title="${element.title}"]`;
    }

    return selector;
  }

  /**
   * Generate unique XPath for element
   */
  private generateUniqueXPath(element: Element): string {
    let xpath = `//${element.tagName}`;

    // Add ID if available
    if (element.id) {
      return `//${element.tagName}[@id="${element.id}"]`;
    }

    // Add class if available
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        xpath += `[contains(@class, "${classes[0]}")]`;
      }
    }

    // Add attributes for uniqueness
    if (element.type) {
      xpath += `[@type="${element.type}"]`;
    }

    if (element.placeholder) {
      xpath += `[@placeholder="${element.placeholder}"]`;
    }

    if (element.title) {
      xpath += `[@title="${element.title}"]`;
    }

    return xpath;
  }

  /**
   * Generate XPath for element using browser
   */
  private async generateXPath(element: any, browser: any): Promise<string> {
    try {
      const xpath = await browser.executeScript(`
        function getXPath(element) {
          if (element.id !== '') {
            return '//' + element.tagName.toLowerCase() + '[@id="' + element.id + '"]';
          }
          if (element === document.body) {
            return element.tagName.toLowerCase();
          }
          let ix = 0;
          let siblings = element.parentNode.childNodes;
          for (let i = 0; i < siblings.length; i++) {
            let sibling = siblings[i];
            if (sibling === element) {
              return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
            }
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
              ix++;
            }
          }
        }
        return getXPath(arguments[0]);
      `, element);

      return xpath;
    } catch (error) {
      this.logger.warn(`Failed to generate XPath: ${error}`);
      return '';
    }
  }

  /**
   * Generate CSS selector for element using browser
   */
  private async generateCSSSelector(element: any, browser: any): Promise<string> {
    try {
      const cssSelector = await browser.executeScript(`
        function getCSSSelector(element) {
          if (element.id) {
            return '#' + element.id;
          }
          if (element.className) {
            return '.' + element.className.split(' ').join('.');
          }
          return element.tagName.toLowerCase();
        }
        return getCSSSelector(arguments[0]);
      `, element);

      return cssSelector;
    } catch (error) {
      this.logger.warn(`Failed to generate CSS selector: ${error}`);
      return '';
    }
  }

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
      parts.push(element.className.split(' ')[0]);
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