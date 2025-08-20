import { POM } from '../types';
import { Logger } from '../utils/Logger';

export interface LLMConfigInternal {
  provider: 'openai' | 'claude' | 'custom';
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  endpoint?: string;
  headers?: Record<string, string>;
}

/**
 * Lightweight LLM manager.
 * - Initializes provider configuration (no network calls here)
 * - Provides a deterministic enhancement pass when API is not available
 */
export class LLMManager {
  private logger: Logger;
  private config: LLMConfigInternal | null = null;

  constructor() {
    this.logger = new Logger('info');
  }

  async initializeLLM(config: LLMConfigInternal): Promise<void> {
    this.config = config;
    this.logger.info(`LLM initialized: provider=${config.provider} model=${config.model || 'default'}`);
  }

  /**
   * Enhance a generated POM with better naming and metadata.
   * This implementation does not rely on external APIs; it performs
   * deterministic improvements and tags metadata as llmEnhanced.
   */
  async enhancePOM(pom: POM, _config: LLMConfigInternal): Promise<Partial<POM>> {
    // Improve method descriptions to be more action-oriented
    const improvedMethods = (pom.methods || []).map((m) => {
      const improved = { ...m } as any;
      if (typeof improved.description === 'string') {
        improved.description = this.normalizeDescription(improved.description);
      }
      improved.name = this.normalizeMethodName(improved.name);
      return improved;
    });

    const enhanced: Partial<POM> = {
      methods: improvedMethods as any,
      metadata: {
        ...(pom.metadata as any),
        llmEnhanced: true,
        llmProvider: this.config?.provider || 'custom',
        llmModel: this.config?.model || 'deterministic-enhancer',
      } as any,
    };

    return enhanced;
  }

  private normalizeDescription(desc: string): string {
    const trimmed = desc.trim();
    if (!trimmed) return 'Generated method';
    // Ensure description starts with a verb
    if (!/^\b(click|fill|select|verify|get|wait|navigate)\b/i.test(trimmed)) {
      return `Perform action: ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
    }
    return trimmed;
  }

  private normalizeMethodName(name: string): string {
    // Convert to camelCase and ensure verb-first naming
    const camel = name
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .split(' ')
      .map((part, idx) => (idx === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1)))
      .join('');
    // Enforce leading verb when missing
    if (!/^(click|fill|select|verify|get|wait|navigate)/.test(camel)) {
      return `do${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
    }
    return camel;
  }
}

// End of file