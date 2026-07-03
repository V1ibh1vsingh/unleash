import { createCipheriv, createHash } from 'crypto';

export function encrypt(s?: string): string {
    const key = process.env.UNLEASH_ENCRYPTION_KEY;
    const iv = process.env.UNLEASH_ENCRYPTION_IV;
    if (!s || !key || !iv) {
        return s ?? '';
    }

    const algorithm = 'aes-256-cbc';

    const cipher = createCipheriv(
        algorithm,
        Buffer.from(key, 'hex'),
        Buffer.from(iv, 'hex'),
    );
    const encrypted = cipher.update(s, 'utf8', 'hex') + cipher.final('hex');
    return `${encrypted}@unleash.run`;
}

export function hashValue(value: string): string {
    throw new Error("STUB");
}

export function anonymise(s?: string): string {
    if (!s) {
        return '';
    }
    const hash = createHash('sha256')
        .update(s, 'utf-8')
        .digest('hex')
        .slice(0, 9);
    return `${hash}@unleash.run`;
}

export function anonymiseKeys<T>(object: T, keys: string[]): T {
    if (typeof object !== 'object' || object === null) {
        return object;
    }

    if (Array.isArray(object)) {
        return object.map((item) => { throw new Error("STUB"); }) as T;
    } else {
        return Object.keys(object).reduce((result, key) => {
            throw new Error("STUB");
        }, object);
    }
}
