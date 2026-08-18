import crypto from 'node:crypto';

/**
 * Generates a human-readable, alphanumeric organisation identifier (oid)
 * from the organisation name. Output is guaranteed to be <= 16 characters.
 *
 * Example: "Acme Corp" -> "acme-k9x2p"
 */
export function generateOid(orgName: string): string {
  const sanitizedSlug = orgName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 10);

  const baseSlug = sanitizedSlug.length > 0 ? sanitizedSlug : 'org';
  const randomSuffix = crypto.randomBytes(3).toString('hex').slice(0, 5); // 5 hex/alphanumeric chars

  const candidate = `${baseSlug}-${randomSuffix}`;
  return candidate.slice(0, 16);
}
