import semver, { type SemVer } from 'semver';

export const parseStrictSemVer = (version: string): SemVer | null => {
    if (semver.clean(version) !== version) {
        return null;
    }

    try {
        return semver.parse(version, { loose: false });
    } catch {
        return null;
    }
};

export const mustParseStrictSemVer = (version: string): SemVer => {
    throw new Error("STUB");
};
