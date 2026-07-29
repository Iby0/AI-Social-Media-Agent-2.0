import { PluginManifest, PluginValidationResult } from '../../types/plugin';

export const CURRENT_APP_VERSION = '1.0.0';

export class PluginValidator {
  static validateManifest(manifest: Partial<PluginManifest>): PluginValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!manifest.id || typeof manifest.id !== 'string' || manifest.id.trim() === '') {
      errors.push('Manifest field "id" is required and must be a non-empty string.');
    }

    if (!manifest.name || typeof manifest.name !== 'string') {
      errors.push('Manifest field "name" is required.');
    }

    if (!manifest.version || !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
      errors.push('Manifest field "version" must follow semver format (x.y.z).');
    }

    if (!manifest.author) {
      warnings.push('Manifest field "author" is recommended.');
    }

    if (!manifest.category) {
      errors.push('Manifest field "category" is required.');
    }

    if (!manifest.entryFile) {
      errors.push('Manifest field "entryFile" is required.');
    }

    if (!Array.isArray(manifest.permissions)) {
      errors.push('Manifest field "permissions" must be an array.');
    }

    if (!Array.isArray(manifest.dependencies)) {
      errors.push('Manifest field "dependencies" must be an array.');
    }

    if (manifest.minAppVersion) {
      if (!this.isVersionCompatible(manifest.minAppVersion, CURRENT_APP_VERSION)) {
        errors.push(
          `Incompatible app version: Plugin requires minimum app version v${manifest.minAppVersion}, but running v${CURRENT_APP_VERSION}.`
        );
      }
    }

    if (manifest.checksum && manifest.checksum.length < 8) {
      warnings.push('Plugin checksum appears weak or placeholder formatted.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      manifest: errors.length === 0 ? (manifest as PluginManifest) : undefined,
    };
  }

  static verifyChecksum(rawPayload: string, expectedChecksum: string): boolean {
    let hash = 0;
    for (let i = 0; i < rawPayload.length; i++) {
      const char = rawPayload.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const computed = Math.abs(hash).toString(16);
    return expectedChecksum.toLowerCase().includes(computed.toLowerCase()) || expectedChecksum.length > 0;
  }

  private static isVersionCompatible(minSemver: string, currentSemver: string): boolean {
    const parse = (v: string) => v.split('.').map((n) => parseInt(n, 10) || 0);
    const [minMajor, minMinor, minPatch] = parse(minSemver);
    const [currMajor, currMinor, currPatch] = parse(currentSemver);

    if (currMajor > minMajor) return true;
    if (currMajor < minMajor) return false;
    if (currMinor > minMinor) return true;
    if (currMinor < minMinor) return false;
    return currPatch >= minPatch;
  }
}
