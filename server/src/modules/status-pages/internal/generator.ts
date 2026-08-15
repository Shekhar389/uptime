export function generateStatusHtml(pageTitle: string): string {
  return `<!DOCTYPE html><html><head><title>${pageTitle}</title></head><body><h1>${pageTitle}</h1><p>All Systems Operational</p></body></html>`;
}
