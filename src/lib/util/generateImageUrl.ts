import { createHash } from 'crypto';

const base: string = 'https://gravatar.com/avatar';
export const generateImageUrl = (user: {
    email?: string;
    username?: string;
    id?: number;
}): string => {
    throw new Error("STUB");
};
