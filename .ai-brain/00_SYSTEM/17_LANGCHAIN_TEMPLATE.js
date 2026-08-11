/**
 * LangChain-style Orchestrator Template
 * NamaMedical
 *
 * Pure JS implementation of chain composition (no external LangChain dep).
 * Supports: sequential, parallel, branch, retry, fallback, observability.
 *
 * @module core/langchain
 */

'use strict';

const { performance } = require('node:perf_hooks');

/**
 * Chain step types
 */
const StepType = {
  FUNCTION: 'function',
  PROMPT: 'prompt',
  RETRIEVE: 'retrieve',
  LLM: 'llm',
  PARALLEL: 'parallel',
  BRANCH: 'branch',
  RETRY: 'retry',
  FALLBACK: 'fallback',
};

/**
 * Logger hook
 */
let observabilityHook = (event) => {
  if (process.env.LLM_LOG === 'verbose') {
    console.log('[langchain]', JSON.stringify(event));
  }
};

function setObservabilityHook(fn) {
  observabilityHook = fn;
}

/**
 * Run a single step
 */
async function runStep(step, ctx) {
  const start = performance.now();
  const traceId = ctx.traceId;
  try {
    let output;
    switch (step.type) {
      case StepType.FUNCTION:
        output = await step.fn(ctx.input, ctx);
        break;
      case StepType.PROMPT:
        output = await renderPrompt(step.template, ctx.input, ctx);
        break;
      case StepType.RETRIEVE:
        output = await step.retriever(ctx.input, ctx);
        break;
      case StepType.LLM:
        output = await step.llmCall(ctx.input, ctx);
        break;
      case StepType.PARALLEL:
        output = await runParallel(step.steps, ctx);
        break;
      case StepType.BRANCH:
        output = await runBranch(step, ctx);
        break;
      case StepType.RETRY:
        output = await runRetry(step, ctx);
        break;
      case StepType.FALLBACK:
        output = await runFallback(step, ctx);
        break;
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
    const duration = performance.now() - start;
    observabilityHook({ type: 'step.ok', traceId, step: step.name, duration });
    return output;
  } catch (err) {
    const duration = performance.now() - start;
    observabilityHook({ type: 'step.error', traceId, step: step.name, duration, error: err.message });
    throw err;
  }
}

/**
 * Run a sequence of steps (chain)
 */
async function runChain(steps, initialInput, ctx = {}) {
  ctx.traceId = ctx.traceId || `chain-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  ctx.input = initialInput;
  let output = initialInput;
  for (const step of steps) {
    ctx.input = output;
    output = await runStep(step, ctx);
  }
  return output;
}

/**
 * Run multiple chains in parallel
 */
async function runParallel(steps, ctx) {
  const inputs = Array.isArray(ctx.input) ? ctx.input : [ctx.input];
  const promises = inputs.map((input, i) => {
    const subCtx = { ...ctx, input, traceId: `${ctx.traceId}-p${i}` };
    return runChain(steps, input, subCtx);
  });
  return Promise.all(promises);
}

/**
 * Branch on a condition
 */
async function runBranch(step, ctx) {
  const cond = typeof step.condition === 'function' ? step.condition(ctx.input, ctx) : step.condition;
  const branch = cond ? step.then : step.else;
  if (!branch) return ctx.input;
  return runChain(Array.isArray(branch) ? branch : [branch], ctx.input, ctx);
}

/**
 * Retry with backoff
 */
async function runRetry(step, ctx) {
  const { maxAttempts = 3, backoffMs = 100 } = step;
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await runStep(step.step, ctx);
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts) {
        const delay = backoffMs * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastErr;
}

/**
 * Fallback chain
 */
async function runFallback(step, ctx) {
  try {
    return await runStep(step.primary, ctx);
  } catch (err) {
    observabilityHook({ type: 'fallback.triggered', traceId: ctx.traceId, error: err.message });
    return runStep(step.fallback, ctx);
  }
}

/**
 * Render a prompt template
 * Supports: {{var}}, {{#if cond}}...{{/if}}, {{#each list}}...{{/each}}
 */
async function renderPrompt(template, input, ctx) {
  let out = template;

  // {{var}}
  out = out.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path) => {
    const value = getByPath(input, path) ?? getByPath(ctx, path) ?? '';
    return String(value);
  });

  // {{#if cond}}...{{/if}}
  out = out.replace(/\{\{#if\s+([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, path, body) => {
    return getByPath(input, path) ? body : '';
  });

  // {{#each list}}...{{/each}}  (uses {{this}} and {{@index}})
  out = out.replace(/\{\{#each\s+([\w.]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, path, body) => {
    const list = getByPath(input, path) || [];
    return list.map((item, idx) =>
      body.replace(/\{\{this\}\}/g, String(item))
          .replace(/\{\{@index\}\}/g, String(idx))
    ).join('');
  });

  return out;
}

function getByPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/**
 * Common chain builders
 */
const Chain = {
  /** Sequential chain */
  sequential: (steps) => ({ type: 'sequential', steps }),

  /** Parallel (fan-out) */
  parallel: (steps) => ({ type: StepType.PARALLEL, steps }),

  /** Conditional branch */
  branch: (condition, thenSteps, elseSteps) => ({
    type: StepType.BRANCH,
    condition,
    then: thenSteps,
    else: elseSteps,
  }),

  /** Retry wrapper */
  withRetry: (step, opts) => ({ type: StepType.RETRY, step, ...opts }),

  /** Fallback wrapper */
  withFallback: (primary, fallback) => ({ type: StepType.FALLBACK, primary, fallback }),

  /** RAG pipeline: retrieve → prompt → llm */
  rag: ({ retriever, promptTemplate, llm, topK = 5 }) => [
    { type: StepType.FUNCTION, name: 'retrieve', fn: retriever },
    { type: StepType.PROMPT, name: 'format', template: promptTemplate },
    { type: StepType.LLM, name: 'generate', llmCall: llm },
  ],
};

module.exports = {
  StepType,
  Chain,
  runChain,
  runStep,
  setObservabilityHook,
  renderPrompt,
};
