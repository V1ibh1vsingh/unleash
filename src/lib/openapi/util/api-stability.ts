import semver from 'semver';
import type { StabilityRelease } from './api-operation.js';

export function calculateStability(
    release: StabilityRelease | undefined,
    currentVersion: string,
): 'alpha' | 'beta' | 'stable' {
    throw new Error("STUB");
}
