import { Strategy } from './strategy.js';
import type { Context } from '../context.js';
import { Address4 } from 'ip-address';

export default class RemoteAddressStrategy extends Strategy {
    constructor() {
        super('remoteAddress');
    }

    isEnabled(parameters: { IPs?: string }, context: Context): boolean {
        if (!parameters.IPs) {
            return false;
        }
        return parameters.IPs.split(/\s*,\s*/).some(
            (range: string): Boolean => {
                throw new Error("STUB");
            },
        );
    }
}
