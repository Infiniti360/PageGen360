import { Element, GenerationOptions, POM } from '../types';
import { Logger } from '../utils/Logger';

export interface MCPConfigInternal {
  serverUrl: string;
  credentials?: {
    apiKey?: string;
    username?: string;
    password?: string;
    token?: string;
  };
  tools: string[];
  contextManagement?: boolean;
  aiConfig?: {
    provider: 'openai' | 'claude' | 'custom';
    model?: string;
  };
}

/**
 * Minimal MCP manager that simulates MCP tool orchestration.
 * In a real environment, this would connect to an MCP server and
 * invoke tools for element detection, naming, etc.
 */
export class MCPManager {
  private logger: Logger;
  private initialized = false;
  private config: MCPConfigInternal | null = null;
  private mcpServer: any;

  constructor() {
    this.logger = new Logger('info');
  }

  // initializeMCPServer/executeTool defined later with richer behavior

  /**
   * AI-based POM generation via MCP. For now, creates a universal POM skeleton
   * from detected elements and options, with robust naming suitable for any site.
   */
  async generatePOMWithAI(elements: Element[], options: GenerationOptions, pageData: any): Promise<POM> {
    const className = this.generateUniversalClassName(pageData?.url || 'UniversalPage');

    const methods = this.generateUniversalMethods(elements, options);
    const imports: string[] = this.generateUniversalImports(options);
    const url = pageData?.url || 'https://example.com';
    const generatedCode = this.generateClassCode(options, className, methods, elements, url);

    const pom: POM = {
      id: `${Date.now()}`,
      url: pageData?.url || 'https://example.com',
      version: '1.0.0',
      framework: options.framework,
      language: options.language,
      elements,
      methods,
      imports,
      className,
      generatedCode,
      generatedAt: new Date(),
      metadata: {
        pageTitle: pageData?.title || 'Universal Page',
        loginRequired: !!options.loginConfig,
        authenticationMethod: options.loginConfig?.type,
        browser: options.browser?.name || 'chrome',
        userAgent: '',
        viewport: options.browser?.viewport || { width: 1920, height: 1080 },
        timestamp: new Date(),
        mcpEnhanced: true,
        mcpTools: this.config?.tools,
        mcpServerUrl: this.config?.serverUrl,
      } as any,
    };

    return pom;
  }

  // Removed duplicate lightweight enhancePOM to keep single implementation below

  private generateUniversalClassName(input: string): string {
    try {
      const url = new URL(input);
      const host = url.hostname.replace(/[^a-zA-Z0-9]/g, '');
      const path = url.pathname.replace(/[^a-zA-Z0-9]/g, '');
      return `${host.charAt(0).toUpperCase() + host.slice(1)}${path ? path.charAt(0).toUpperCase() + path.slice(1) : ''}Page`;
    } catch {
      const base = input.replace(/[^a-zA-Z0-9]/g, '');
      return `${base.charAt(0).toUpperCase() + base.slice(1)}Page`;
    }
  }

  // normalizeClassName kept for future use

  private generateUniversalImports(options: GenerationOptions): string[] {
    switch (options.framework) {
      case 'playwright':
        return ["import { test, expect } from '@playwright/test';", "import { Page, Locator } from '@playwright/test';"];
      case 'selenium':
        return ["import { Builder, By, WebDriver, until } from 'selenium-webdriver';"];
      case 'cypress':
        return ['/// <reference types="cypress" />'];
      case 'puppeteer':
        return ["import puppeteer, { Page } from 'puppeteer';"];
      case 'testcafe':
        return ["import { Selector, t } from 'testcafe';"];
      default:
        return [];
    }
  }

  private generateUniversalMethods(elements: Element[], options: GenerationOptions): any[] {
    const methods: any[] = [];
    const MAX = 80;
    const usedNames = new Set<string>();

    const elementsToUse: Element[] = elements
      .filter(Boolean)
      .filter(el => this.shouldIncludeInPOM(el))
      .slice(0, MAX) as Element[];

    // Group by base selector (to detect repeated generic items)
    const groupMap = new Map<string, { selector: string; items: Element[] }>();
    for (let i = 0; i < elementsToUse.length; i++) {
      const el = elementsToUse[i] as Element;
      const selector = this.buildSelector(el);
      if (!this.isSelectorUsable(selector, options)) continue;
      const frameKey = (el as any).attributes?.['nearest-iframe-selector'] || '';
      const key = `${frameKey}::${selector || `${el.tagName}`}`;
      const entry = groupMap.get(key) || { selector, items: [] };
      entry.items.push(el);
      groupMap.set(key, entry);
    }

    for (const group of groupMap.values()) {
      const selector = group.selector;
      const items = group.items as Element[];
      if (!items || items.length === 0) continue;
      const first = items[0] as Element;
      const base = this.deriveElementName(first, 0, usedNames);
      const frameSel = (first as any).attributes?.['nearest-iframe-selector'] as string | undefined;

      if (items.length > 1) {
        // Generalized plural accessors for repeated items
        methods.push({
          name: `getAll${base}`,
          returnType: 'any',
          parameters: [],
          body: frameSel ? this.bodyGetAllInFrame(selector, frameSel, options) : this.bodyGetAll(selector, options),
          description: `Get all ${base} elements`,
          elementId: first.id,
          isGetter: true,
          isSetter: false,
          isAction: false,
          isAssertion: false,
          supportsChaining: false,
          frameworkSpecific: false,
          methodType: 'getter',
        });
        methods.push({
          name: `get${base}At`,
          returnType: 'any',
          parameters: [{ name: 'index', type: 'number', required: true }],
          body: frameSel ? this.bodyGetAtInFrame(selector, frameSel, options) : this.bodyGetAt(selector, options),
          description: `Get ${base} at index`,
          elementId: first.id,
          isGetter: true,
          isSetter: false,
          isAction: false,
          isAssertion: false,
          supportsChaining: false,
          frameworkSpecific: false,
          methodType: 'getter',
        });
        methods.push({
          name: `wait${base}At`,
          returnType: 'void',
          parameters: [
            { name: 'index', type: 'number', required: true },
            { name: 'timeout', type: 'number', required: false, defaultValue: '5000' },
          ],
          body: frameSel ? this.bodyWaitAtInFrame(selector, frameSel, options) : this.bodyWaitAt(selector, options),
          description: `Wait until ${base} at index is visible`,
          elementId: first.id,
          isGetter: false,
          isSetter: false,
          isAction: false,
          isAssertion: true,
          supportsChaining: false,
          frameworkSpecific: false,
          methodType: 'validation',
        });
        // Click only if interactive
        if (first.isInteractive || ['a', 'button', 'input', 'select', 'textarea'].includes(first.tagName)) {
          methods.push({
            name: `click${base}At`,
            returnType: 'void',
            parameters: [{ name: 'index', type: 'number', required: true }],
            body: frameSel ? this.bodyClickAtInFrame(selector, frameSel, options) : this.bodyClickAt(selector, options),
            description: `Click ${base} at index`,
            elementId: first.id,
            isGetter: false,
            isSetter: false,
            isAction: true,
            isAssertion: false,
            supportsChaining: false,
            frameworkSpecific: false,
            methodType: 'action',
          });
        }
      } else {
        // Single item: standard get/wait/click triad
        methods.push({
          name: `get${base}`,
          returnType: 'any',
          parameters: [],
          body: frameSel ? this.bodyGetInFrame(selector, frameSel, options) : this.bodyGet(selector, options),
          description: `Get ${base} element`,
          elementId: first.id,
          isGetter: true,
          isSetter: false,
          isAction: false,
          isAssertion: false,
          supportsChaining: false,
          frameworkSpecific: false,
          methodType: 'getter',
        });
        methods.push({
          name: `wait${base}`,
          returnType: 'void',
          parameters: [{ name: 'timeout', type: 'number', required: false, defaultValue: '5000' }],
          body: frameSel ? this.bodyWaitInFrame(selector, frameSel, options) : this.bodyWait(selector, options),
          description: `Wait until ${base} is visible`,
          elementId: first.id,
          isGetter: false,
          isSetter: false,
          isAction: false,
          isAssertion: true,
          supportsChaining: false,
          frameworkSpecific: false,
          methodType: 'validation',
        });
        if (first.isInteractive || ['a', 'button', 'input', 'select', 'textarea'].includes(first.tagName)) {
          methods.push({
            name: `click${base}`,
            returnType: 'void',
            parameters: [],
            body: frameSel ? this.bodyClickInFrame(selector, frameSel, options) : this.bodyClickWithSelector(selector, options),
            description: `Click ${base}`,
            elementId: first.id,
            isGetter: false,
            isSetter: false,
            isAction: true,
            isAssertion: false,
            supportsChaining: false,
            frameworkSpecific: false,
            methodType: 'action',
          });
        }
      }
    }

    return methods;
  }

  private shouldIncludeInPOM(el: Element): boolean {
    const hasDataTestId = !!(el.attributes?.['data-test-id'] || el.attributes?.['data-testid']);
    const stableId = !!this.sanitizeVolatileToken(el.elementId);
    const isInteractive = !!el.isInteractive || ['a', 'button', 'input', 'select', 'textarea'].includes(el.tagName);
    const hasMeaningfulText = !!(el.attributes?.['label-text'] || (el.text && el.text.length > 0 && el.text.length <= 60));
    const hasSrcAlt = el.tagName === 'img' && !!(el.alt || el.title);
    const notGenericWrapper = !this.isUtilityClassHeavy(el) && !(el.tagName === 'div' || el.tagName === 'span');
    // Keep if clearly meaningful
    if (hasDataTestId || stableId || isInteractive || hasMeaningfulText || hasSrcAlt) return true;
    // Otherwise drop generic wrappers
    return false && notGenericWrapper;
  }

  private isUtilityClassHeavy(el: Element): boolean {
    if (!el.className) return false;
    const classStr = typeof el.className === 'string' ? el.className : '';
    const classes = classStr.split(/\s+/).filter(Boolean);
    if (classes.length <= 2) return false;
    const utilityPrefixes = ['flex', 'grid', 'w-', 'h-', 'p-', 'px-', 'py-', 'm-', 'mx-', 'my-', 'text-', 'bg-', 'rounded', 'justify-', 'items-', 'mt-', 'mb-', 'ml-', 'mr-', 'gap-'];
    const utilityCount = classes.filter(c => utilityPrefixes.some(p => c.startsWith(p))).length;
    return utilityCount >= Math.max(2, Math.floor(classes.length * 0.6));
  }

  private isSelectorUsable(selector: string, options: GenerationOptions): boolean {
    if (!selector) return false;
    // Avoid extremely generic selectors
    if (selector === 'div' || selector === 'span' || selector === 'p') return false;
    // Avoid XPath where not robust
    if (selector.startsWith('//')) {
      // Allow XPath only for Selenium and TestCafe where CSS cannot be built
      if (!(options.framework === 'selenium' || options.framework === 'testcafe')) return false;
    }
    // Avoid bare tag selectors without attributes/classes
    if (/^\w+$/.test(selector) && !['input', 'button', 'a', 'select', 'textarea', 'img'].includes(selector)) return false;
    return true;
  }

  /**
   * Generate full class code for the given framework/language, mirroring simple POM style
   */
  private generateClassCode(
    options: GenerationOptions,
    className: string,
    methods: any[],
    _elements: Element[],
    url: string
  ): string {
    const header = this.generateFileHeader(options);
    const classHeader = `export class ${className} {\n`;
    let body = '';
    const renderParams = (m: any, typed: boolean): string => {
      const params = (m.parameters || []) as Array<{ name: string; type?: string; defaultValue?: string }>;
      if (!params.length) return '';
      return params
        .map(p => {
          const type = typed ? `: ${p.type || 'any'}` : '';
          const def = p.defaultValue ? ` = ${p.defaultValue}` : '';
          return `${p.name}${type}${def}`;
        })
        .join(', ');
    };

    switch (options.framework) {
      case 'cypress': {
        // Visit method
        body += `  visit() {\n    cy.visit('${url}');\n  }\n\n`;
        // Method bodies
        for (const m of methods) {
          const params = renderParams(m, false);
          body += `  ${m.name}(${params}) {\n    ${m.body}\n  }\n\n`;
        }
        break;
      }
      case 'playwright': {
        // Constructor with Page
        body += `  constructor(private page: Page) {}\n\n`;
        // Visit method
        body += `  async visit(): Promise<void> {\n    await this.page.goto('${url}');\n  }\n\n`;
        for (const m of methods) {
          const params = renderParams(m, true);
          body += `  async ${m.name}(${params}): Promise<void> {\n    ${m.body}\n  }\n\n`;
        }
        break;
      }
      case 'puppeteer': {
        body += `  constructor(private page: Page) {}\n\n`;
        body += `  async visit(): Promise<void> {\n    await this.page.goto('${url}');\n  }\n\n`;
        for (const m of methods) {
          const params = renderParams(m, true);
          body += `  async ${m.name}(${params}): Promise<void> {\n    ${m.body}\n  }\n\n`;
        }
        break;
      }
      case 'selenium': {
        body += `  constructor(private driver: WebDriver) {}\n\n`;
        body += `  async visit(): Promise<void> {\n    await this.driver.get('${url}');\n  }\n\n`;
        for (const m of methods) {
          const params = renderParams(m, true);
          body += `  async ${m.name}(${params}): Promise<void> {\n    ${m.body}\n  }\n\n`;
        }
        break;
      }
      case 'testcafe': {
        body += `  async visit(): Promise<void> {\n    await t.navigateTo('${url}');\n  }\n\n`;
        for (const m of methods) {
          const params = renderParams(m, true);
          body += `  async ${m.name}(${params}): Promise<void> {\n    ${m.body}\n  }\n\n`;
        }
        break;
      }
      default: {
        for (const m of methods) {
          const params = renderParams(m, false);
          body += `  ${m.name}(${params}) {\n    ${m.body}\n  }\n\n`;
        }
      }
    }

    const classFooter = `}`;
    return [header, classHeader, body, classFooter].filter(Boolean).join('\n');
  }

  private generateFileHeader(options: GenerationOptions): string {
    const imports = this.generateUniversalImports(options);
    return imports.length > 0 ? imports.join('\n') + '\n\n' : '';
  }

  private deriveElementName(el: Element, idx: number, used?: Set<string>): string {
    const scored = this.computeNameCandidates(el, idx);
    // pick highest score candidate
    let best = scored.sort((a, b) => b.score - a.score)[0]?.value || `${el.tagName}${idx}`;
    // add container context if generic or too short
    if (this.isGenericName(best) || best.length < 4) {
      const containerSel = (el as any).attributes?.['nearest-container-selector'] as string | undefined;
      const containerName = containerSel ? this.deriveContainerName(containerSel) : '';
      if (containerName) best = this.toPascalCase(`${containerName} ${best}`);
    }
    // add semantic type suffix
    const typeSuffix = this.getSemanticTypeSuffix(el);
    if (typeSuffix && !best.toLowerCase().endsWith(typeSuffix.toLowerCase())) {
      best = `${best}${typeSuffix}`;
    }
    if (!/^[A-Za-z_]/.test(best)) best = `El${best}`;
    if (used) {
      let unique = best;
      let n = 2;
      while (used.has(unique)) unique = `${best}${n++}`;
      used.add(unique);
      return unique;
    }
    return best;
  }

  private computeNameCandidates(el: Element, _idx: number): Array<{ value: string; score: number; source: string }> {
    const out: Array<{ value: string; score: number; source: string }> = [];
    const push = (raw: string | undefined, score: number, source: string) => {
      if (!raw) return;
      const normalized = this.normalizeNameString(raw);
      if (!normalized) return;
      out.push({ value: normalized, score, source });
    };
    const meaningfulHref = this.extractKeywordFromHref((el as any).href || el.attributes?.['href']);
    // Priority levels
    push(el.attributes?.['data-test-id'] as string, 100, 'data-test-id');
    push(el.attributes?.['data-testid'] as string, 98, 'data-testid');
    push(el.attributes?.['aria-label'] as string, 95, 'aria-label');
    push(el.attributes?.['label-text'] as string, 92, 'label-text');
    push(el.attributes?.['section-text'] as string, 85, 'section-text');
    push(meaningfulHref, 82, 'href');
    push(el.alt, 70, 'alt');
    push(el.title, 68, 'title');
    push(el.text, 60, 'text');
    push(this.sanitizeVolatileToken(el.elementId), 65, 'id');
    push(el.tagName, 10, 'tag');
    // Boost if interactive
    const interactiveBoost = (el.isInteractive || ['a', 'button', 'input', 'select', 'textarea'].includes(el.tagName)) ? 5 : 0;
    for (const cand of out) cand.score += interactiveBoost;
    // Penalize generic terms
    for (const cand of out) if (this.isGenericName(cand.value)) cand.score -= 15;
    // Return distinct by value with max score
    const byVal = new Map<string, { value: string; score: number; source: string }>();
    for (const cand of out) {
      const prev = byVal.get(cand.value);
      if (!prev || cand.score > prev.score) byVal.set(cand.value, cand);
    }
    return Array.from(byVal.values());
  }

  private normalizeNameString(input: string): string {
    // tokenize, apply synonyms, remove stopwords, then PascalCase
    const tokens = this.tokenize(input)
      .map(t => this.applySynonym(t))
      .filter(t => !this.isStopword(t));
    return this.toPascalCaseFromTokens(tokens);
  }

  private tokenize(input: string): string[] {
    return (input || '')
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(t => t.toLowerCase());
  }

  private toPascalCaseFromTokens(tokens: string[]): string {
    if (!tokens.length) return '';
    return tokens.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  }

  private applySynonym(token: string): string {
    const map: Record<string, string> = {
      // Buttons
      btn: 'button',
      button: 'button',
      
      // Images
      img: 'image', 
      pic: 'image',
      photo: 'image',
      thumbnail: 'image',
      
      // Navigation
      hdr: 'header',
      nav: 'nav',
      menu: 'nav',
      navbar: 'nav',
      
      // User related
      uname: 'username',
      user: 'user',
      usr: 'user',
      acct: 'account',
      account: 'account',
      
      // Authentication
      pwd: 'password',
      pass: 'password',
      passwd: 'password',
      pword: 'password',
      signin: 'login',
      login: 'login',
      signup: 'register',
      register: 'register',
      
      // Names
      fname: 'firstName',
      firstname: 'firstName',
      fn: 'firstName',
      lname: 'lastName', 
      lastname: 'lastName',
      ln: 'lastName',
      
      // Profile
      prof: 'profile',
      profile: 'profile',
      
      // Stats/Scores
      lb: 'leaderboards',
      leaderboard: 'leaderboards',
      rankings: 'leaderboards',
      scores: 'leaderboards',
      stats: 'statistics',
      statistics: 'statistics',
      
      // Common UI elements
      txt: 'text',
      sel: 'select',
      chk: 'checkbox',
      rad: 'radio',
      lbl: 'label',
      msg: 'message',
      err: 'error',
      desc: 'description',
      
      // Actions
      submit: 'submit',
      save: 'save',
      cancel: 'cancel',
      del: 'delete',
      edit: 'edit',
      update: 'update',
      add: 'add',
      remove: 'remove'
    };
    return map[token] || token;
  }

  private isStopword(token: string): boolean {
    const stop = new Set([
      'the','a','an','of','for','and','or','to','in','on','at','by','with','from','as','is','are','be','this','that','these','those'
    ]);
    return stop.has(token);
  }

  private extractKeywordFromHref(href?: string): string | undefined {
    if (!href) return undefined;
    try {
      const u = new URL(href, 'https://dummy.base');
      const path = u.pathname.replace(/\/$/, '');
      const last = path.split('/').filter(Boolean).pop();
      if (!last) return undefined;
      return last.replace(/[-_]/g, ' ');
    } catch {
      return undefined;
    }
  }

  private toPascalCase(input: string): string {
    const cleaned = input.replace(/[^a-zA-Z0-9]+/g, ' ').trim();
    if (!cleaned) return '';
    return cleaned
      .split(' ')
      .filter(Boolean)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join('');
  }

  private isGenericName(name: string): boolean {
    const lower = name.toLowerCase();
    return ['div', 'span', 'p', 'text', 'label', 'container', 'section', 'element', 'el'].includes(lower);
  }

  private deriveContainerName(selector: string): string {
    if (selector.startsWith('#')) return this.toPascalCase(selector.slice(1));
    const m = selector.match(/\[data-test-id="([^"]+)"\]/);
    if (m && m[1]) return this.toPascalCase(m[1]);
    return '';
  }

  private getSemanticTypeSuffix(el: Element): string {
    const role = (el as any).attributes?.role || '';
    if (el.tagName === 'a' || role === 'link') return 'Link';
    if (el.tagName === 'button' || role === 'button') return 'Button';
    if (el.tagName === 'input') return 'Input';
    if (el.tagName === 'select') return 'Select';
    if (el.tagName === 'textarea') return 'Textarea';
    if (el.tagName === 'img') return 'Image';
    return '';
  }

  private sanitizeVolatileToken(value?: string): string | undefined {
    if (!value) return undefined;
    if (value === 'null' || value === 'undefined') return undefined;
    // Drop known volatile prefixes like Hotjar _hjSafeContext_xxxx
    if (/^_?hj/i.test(value)) return undefined;
    // Trim long digit suffixes that change across reloads
    const trimmed = value.replace(/\d{4,}$/g, '');
    return trimmed || undefined;
  }

  private buildSelector(el: Element): string {
    const dtid = el.attributes?.['data-test-id'] || el.attributes?.['data-testid'];
    if (dtid) return `[data-test-id="${dtid}"]`;
    const id = el.elementId;
    if (id && id !== 'null' && id !== 'undefined') {
      // If id appears volatile (_hj..., or long numeric suffix), avoid exact match
      if (/^_?hj/i.test(id)) {
        // try container-aware or class below
      } else if (/\d{4,}$/.test(id)) {
        const prefix = id.replace(/\d{4,}$/, '');
        if (prefix) return `[id^="${prefix}"]`;
      } else {
        return `[id="${id}"]`;
      }
    }
    // If the selector is only class-based, consider prefixing with nearest strong container
    const containerSel = el.attributes?.['nearest-container-selector'];
    const classOnly = !!el.className && (!el.cssSelector || /^\.[A-Za-z0-9_.\-\s]+$/.test(el.cssSelector));
    if (containerSel && classOnly) {
      const classPart = el.cssSelector ? el.cssSelector : '.' + el.className!.trim().split(/\s+/).join('.');
      return `${containerSel} ${classPart}`;
    }
    if (el.cssSelector && /^[A-Za-z0-9_\-#\.\[\]="\s]+$/.test(el.cssSelector)) {
      return el.cssSelector;
    }
    if (el.xpath) return el.xpath; // as last resort for non-Cypress frameworks
    return el.tagName;
  }

  // bodyClick kept for backward compat (unused by new generator)

  private bodyClickWithSelector(selector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `await this.page.locator('${selector}').click();`;
      case 'selenium':
        return `await this.driver.findElement(By.css('${selector}')).click();`;
      case 'cypress':
        return `cy.get('${selector}').click();`;
      case 'puppeteer':
        return `await this.page.click('${selector}');`;
      case 'testcafe':
        return `await t.click(Selector('${selector}'));`;
      default:
        return '';
    }
  }

  // Frame-aware helpers
  private bodyGetInFrame(selector: string, frameSelector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `const frame = this.page.frameLocator('${frameSelector}');
return frame.locator('${selector}');`;
      case 'selenium':
        return `const iframe = await this.driver.findElement(By.css('${frameSelector}'));
await this.driver.switchTo().frame(iframe);
const el = await this.driver.findElement(By.css('${selector}'));
await this.driver.switchTo().defaultContent();
return el;`;
      case 'cypress':
        return `return cy.get('${frameSelector}').its('0.contentDocument.body').should('not.be.empty').then(cy.wrap).find('${selector}');`;
      case 'puppeteer':
        return `const handle = await this.page.$('${frameSelector}');
const frame = await handle.contentFrame();
return await frame.$('${selector}');`;
      case 'testcafe':
        return `await t.switchToIframe(Selector('${frameSelector}'));
const el = Selector('${selector}');
await t.switchToMainWindow();
return el;`;
      default:
        return '';
    }
  }

  private bodyWaitInFrame(selector: string, frameSelector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `await this.page.frameLocator('${frameSelector}').locator('${selector}').waitFor({ state: 'visible', timeout });`;
      case 'selenium':
        return `const iframe = await this.driver.findElement(By.css('${frameSelector}'));
await this.driver.switchTo().frame(iframe);
const el = await this.driver.findElement(By.css('${selector}'));
await this.driver.wait(until.elementIsVisible(el), timeout);
await this.driver.switchTo().defaultContent();`;
      case 'cypress':
        return `cy.get('${frameSelector}').its('0.contentDocument.body').should('not.be.empty').then(cy.wrap).find('${selector}').should('be.visible');`;
      case 'puppeteer':
        return `const handle = await this.page.$('${frameSelector}');
const frame = await handle.contentFrame();
await frame.waitForSelector('${selector}', { visible: true, timeout });`;
      case 'testcafe':
        return `await t.switchToIframe(Selector('${frameSelector}'));
await t.expect(Selector('${selector}').visible).ok({ timeout });
await t.switchToMainWindow();`;
      default:
        return '';
    }
  }

  private bodyClickInFrame(selector: string, frameSelector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `await this.page.frameLocator('${frameSelector}').locator('${selector}').click();`;
      case 'selenium':
        return `const iframe = await this.driver.findElement(By.css('${frameSelector}'));
await this.driver.switchTo().frame(iframe);
await this.driver.findElement(By.css('${selector}')).click();
await this.driver.switchTo().defaultContent();`;
      case 'cypress':
        return `cy.get('${frameSelector}').its('0.contentDocument.body').then(cy.wrap).find('${selector}').click();`;
      case 'puppeteer':
        return `const handle = await this.page.$('${frameSelector}');
const frame = await handle.contentFrame();
await (await frame.$('${selector}')).click();`;
      case 'testcafe':
        return `await t.switchToIframe(Selector('${frameSelector}'));
await t.click(Selector('${selector}'));
await t.switchToMainWindow();`;
      default:
        return '';
    }
  }

  private bodyGetAllInFrame(selector: string, frameSelector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `return this.page.frameLocator('${frameSelector}').locator('${selector}');`;
      case 'selenium':
        return `const iframe = await this.driver.findElement(By.css('${frameSelector}'));
await this.driver.switchTo().frame(iframe);
const els = await this.driver.findElements(By.css('${selector}'));
await this.driver.switchTo().defaultContent();
return els;`;
      case 'cypress':
        return `return cy.get('${frameSelector}').its('0.contentDocument.body').then(cy.wrap).find('${selector}');`;
      case 'puppeteer':
        return `const handle = await this.page.$('${frameSelector}');
const frame = await handle.contentFrame();
return await frame.$$('${selector}');`;
      case 'testcafe':
        return `await t.switchToIframe(Selector('${frameSelector}'));
const sel = Selector('${selector}');
await t.switchToMainWindow();
return sel;`;
      default:
        return '';
    }
  }

  private bodyGetAtInFrame(selector: string, frameSelector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `return this.page.frameLocator('${frameSelector}').locator('${selector}').nth(index);`;
      case 'selenium':
        return `const iframe = await this.driver.findElement(By.css('${frameSelector}'));
await this.driver.switchTo().frame(iframe);
const els = await this.driver.findElements(By.css('${selector}'));
const el = els[index];
await this.driver.switchTo().defaultContent();
return el;`;
      case 'cypress':
        return `return cy.get('${frameSelector}').its('0.contentDocument.body').then(cy.wrap).find('${selector}').eq(index);`;
      case 'puppeteer':
        return `const handle = await this.page.$('${frameSelector}');
const frame = await handle.contentFrame();
const els = await frame.$$('${selector}');
return els[index];`;
      case 'testcafe':
        return `await t.switchToIframe(Selector('${frameSelector}'));
const el = Selector('${selector}').nth(index);
await t.switchToMainWindow();
return el;`;
      default:
        return '';
    }
  }

  private bodyWaitAtInFrame(selector: string, frameSelector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `await this.page.frameLocator('${frameSelector}').locator('${selector}').nth(index).waitFor({ state: 'visible', timeout });`;
      case 'selenium':
        return `const iframe = await this.driver.findElement(By.css('${frameSelector}'));
await this.driver.switchTo().frame(iframe);
const els = await this.driver.findElements(By.css('${selector}'));
await this.driver.wait(until.elementIsVisible(els[index]), timeout);
await this.driver.switchTo().defaultContent();`;
      case 'cypress':
        return `cy.get('${frameSelector}').its('0.contentDocument.body').then(cy.wrap).find('${selector}').eq(index).should('be.visible');`;
      case 'puppeteer':
        return `const handle = await this.page.$('${frameSelector}');
const frame = await handle.contentFrame();
await frame.waitForFunction((sel, idx) => {
  const nodes = Array.from(document.querySelectorAll(sel));
  const el = nodes[idx];
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  const visible = rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && Number(style.opacity || '1') > 0.01;
  return visible;
}, { timeout }, '${selector}', index);`;
      case 'testcafe':
        return `await t.switchToIframe(Selector('${frameSelector}'));
await t.expect(Selector('${selector}').nth(index).visible).ok({ timeout });
await t.switchToMainWindow();`;
      default:
        return '';
    }
  }

  private bodyClickAtInFrame(selector: string, frameSelector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `await this.page.frameLocator('${frameSelector}').locator('${selector}').nth(index).click();`;
      case 'selenium':
        return `const iframe = await this.driver.findElement(By.css('${frameSelector}'));
await this.driver.switchTo().frame(iframe);
const els = await this.driver.findElements(By.css('${selector}'));
await els[index].click();
await this.driver.switchTo().defaultContent();`;
      case 'cypress':
        return `cy.get('${frameSelector}').its('0.contentDocument.body').then(cy.wrap).find('${selector}').eq(index).click();`;
      case 'puppeteer':
        return `const handle = await this.page.$('${frameSelector}');
const frame = await handle.contentFrame();
const els = await frame.$$('${selector}');
await els[index].click();`;
      case 'testcafe':
        return `await t.switchToIframe(Selector('${frameSelector}'));
await t.click(Selector('${selector}').nth(index));
await t.switchToMainWindow();`;
      default:
        return '';
    }
  }

  private bodyGet(selector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `return this.page.locator('${selector}');`;
      case 'selenium':
        return `return await this.driver.findElement(By.css('${selector}'));`;
      case 'cypress':
        return `return cy.get('${selector}');`;
      case 'puppeteer':
        return `return await this.page.$('${selector}');`;
      case 'testcafe':
        return `return Selector('${selector}');`;
      default:
        return '';
    }
  }

  private bodyWait(selector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `await this.page.locator('${selector}').waitFor({ state: 'visible', timeout });`;
      case 'selenium':
        return `await this.driver.wait(until.elementIsVisible(await this.driver.findElement(By.css('${selector}'))), timeout);`;
      case 'cypress':
        return `cy.get('${selector}').should('be.visible');`;
      case 'puppeteer':
        return `await this.page.waitForSelector('${selector}', { visible: true, timeout });`;
      case 'testcafe':
        return `await t.expect(Selector('${selector}').visible).ok({ timeout });`;
      default:
        return '';
    }
  }

  private bodyGetAll(selector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `return this.page.locator('${selector}');`;
      case 'selenium':
        return `return await this.driver.findElements(By.css('${selector}'));`;
      case 'cypress':
        return `return cy.get('${selector}');`;
      case 'puppeteer':
        return `return await this.page.$$('${selector}');`;
      case 'testcafe':
        return `return Selector('${selector}');`;
      default:
        return '';
    }
  }

  private bodyGetAt(selector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `return this.page.locator('${selector}').nth(index);`;
      case 'selenium':
        return `const els = await this.driver.findElements(By.css('${selector}'));
return els[index];`;
      case 'cypress':
        return `return cy.get('${selector}').eq(index);`;
      case 'puppeteer':
        return `const els = await this.page.$$('${selector}');
return els[index];`;
      case 'testcafe':
        return `return Selector('${selector}').nth(index);`;
      default:
        return '';
    }
  }

  private bodyWaitAt(selector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `await this.page.locator('${selector}').nth(index).waitFor({ state: 'visible', timeout });`;
      case 'selenium':
        return `const els = await this.driver.findElements(By.css('${selector}'));
await this.driver.wait(until.elementIsVisible(els[index]), timeout);`;
      case 'cypress':
        return `cy.get('${selector}').eq(index).should('be.visible');`;
      case 'puppeteer':
        return `await this.page.waitForFunction((sel, idx) => {
  const nodes = Array.from(document.querySelectorAll(sel));
  const el = nodes[idx];
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  const visible = rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && Number(style.opacity || '1') > 0.01;
  return visible;
}, { timeout }, '${selector}', index);`;
      case 'testcafe':
        return `await t.expect(Selector('${selector}').nth(index).visible).ok({ timeout });`;
      default:
        return '';
    }
  }

  private bodyClickAt(selector: string, options: GenerationOptions): string {
    switch (options.framework) {
      case 'playwright':
        return `await this.page.locator('${selector}').nth(index).click();`;
      case 'selenium':
        return `const els = await this.driver.findElements(By.css('${selector}'));
await els[index].click();`;
      case 'cypress':
        return `cy.get('${selector}').eq(index).click();`;
      case 'puppeteer':
        return `const els = await this.page.$$('${selector}');
await els[index].click();`;
      case 'testcafe':
        return `await t.click(Selector('${selector}').nth(index));`;
      default:
        return '';
    }
  }
  /** Initialize MCP server */
  async initializeMCPServer(config: any): Promise<any> {
    this.logger.debug('Initializing MCP server');
      this.mcpServer = {
        serverUrl: config.serverUrl,
        tools: config.tools,
        credentials: config.credentials,
        contextManagement: config.contextManagement,
      };
    this.initialized = true;
      return this.mcpServer;
  }

  /** Execute MCP tool */
  async executeTool(toolName: string, parameters: any): Promise<any> {
    if (!this.initialized) throw new Error('MCP not initialized');
      switch (toolName) {
        case 'detect_page_elements':
          return await this.detectPageElements(parameters);
        case 'generate_pom_structure':
          return await this.generatePOMStructure(parameters);
        case 'detect_pom_changes':
          return await this.detectPOMChanges(parameters);
        case 'optimize_pom_code':
          return await this.optimizePOMCode(parameters);
        default:
        return { ok: false, error: `Unknown tool ${toolName}` };
    }
  }

  /**
   * Enhance POM with MCP
   */
  async enhancePOM(pom: POM, config: any): Promise<POM> {
    this.logger.debug('Enhancing POM with MCP');

    try {
      // Simulate MCP enhancement
      const enhancedPOM = { ...pom };
      
      // Add MCP-specific metadata
      enhancedPOM.metadata = {
        ...enhancedPOM.metadata,
        mcpEnhanced: true,
        mcpTools: config.tools,
        mcpServerUrl: config.serverUrl,
      };

      this.logger.debug('POM enhanced with MCP successfully');
      return enhancedPOM;
    } catch (error) {
      this.logger.error(`MCP POM enhancement failed: ${error}`);
      throw error;
    }
  }

  /**
   * Detect page elements using MCP
   */
  private async detectPageElements(_parameters: any): Promise<any> {
    this.logger.debug('Detecting page elements with MCP');

    // Simulate element detection with MCP
    const elements = [
      {
        id: 'login-button',
        tagName: 'button',
        text: 'Login',
        cssSelector: '#login-button',
        isInteractive: true,
      },
      {
        id: 'username-input',
        tagName: 'input',
        type: 'text',
        placeholder: 'Username',
        cssSelector: '#username',
        isInteractive: true,
      },
    ];

    return {
      success: true,
      elements,
      count: elements.length,
    };
  }

  /**
   * Generate POM structure using MCP
   */
  private async generatePOMStructure(_parameters: any): Promise<any> {
    this.logger.debug('Generating POM structure with MCP');

    // Simulate POM structure generation with MCP
    const structure = {
      className: 'LoginPage',
      methods: [
        {
          name: 'getLoginButton',
          returnType: 'WebElement',
          description: 'Get the login button element',
        },
        {
          name: 'getUsernameInput',
          returnType: 'WebElement',
          description: 'Get the username input element',
        },
      ],
    };

    return {
      success: true,
      structure,
    };
  }

  /**
   * Detect POM changes using MCP
   */
  private async detectPOMChanges(_parameters: any): Promise<any> {
    this.logger.debug('Detecting POM changes with MCP');

    // Simulate change detection with MCP
    const changes = {
      addedElements: [],
      removedElements: [],
      modifiedElements: [],
      breakingChanges: [],
    };

    return {
      success: true,
      changes,
    };
  }

  /**
   * Optimize POM code using MCP
   */
  private async optimizePOMCode(_parameters: any): Promise<any> {
    this.logger.debug('Optimizing POM code with MCP');

    // Simulate code optimization with MCP
    const optimizations = [
      'Improved selector efficiency',
      'Added wait strategies',
      'Enhanced error handling',
    ];

    return {
      success: true,
      optimizations,
    };
  }
} 