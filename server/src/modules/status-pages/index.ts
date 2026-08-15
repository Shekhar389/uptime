import { StatusPageDTO } from './types.js';
import { generateStatusHtml } from './internal/generator.js';
import { verifyCustomDomain } from './internal/domain-verifier.js';

export * from './types.js';

export async function renderStatusPage(title: string): Promise<string> {
  return generateStatusHtml(title);
}

export async function checkDomainOwnership(domain: string): Promise<boolean> {
  return verifyCustomDomain(domain);
}
