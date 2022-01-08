export class User {
    Username: string;
    // salt: string;
    Password: string;
    Scope: string;
    Modify: boolean;
    
    constructor(username: string, password: string, scope: string, modify: boolean) {
        this.Username = username;
        this.Password = password;
        this.Scope = scope;
        this.Modify = modify;
    }
}

class Rule {
    path: string;
    regex: boolean;
    allow: boolean;
    modify: boolean;

    constructor(path: string, regex: boolean, allow: boolean, modify: boolean) {
        this.path = path;
        this.regex = regex;
        this.allow = allow;
        this.modify = modify;
    }
}
