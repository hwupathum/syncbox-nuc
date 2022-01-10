import bcrypt from 'bcrypt';

export function hashPassword(password: string, callback: Function) {
    bcrypt.hash(password, 10, (err: any, hash: string) => callback(err, `{bcrypt}${hash}`));
}

export function comparePassword(old_password: string, new_password: string, callback: Function) {
    bcrypt.compare(old_password, new_password, (err: any, reply: boolean) => callback(err, reply));
}
