import bcrypt from 'bcrypt';

export function hashPassword(password: string, callback: Function) {
    bcrypt.hash(password, 10, (err: any, hash: string) => callback(err, `{bcrypt}${hash}`));
}

export function comparePassword(new_password: string, old_password: string, callback: Function) {
    // remove the prefix
    old_password = old_password.substring(8); 
    bcrypt.compare(new_password, old_password, (err: any, reply: boolean) => callback(err, reply));
}
