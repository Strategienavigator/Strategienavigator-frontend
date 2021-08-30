export abstract class Token {
    protected identifier: string;

    protected constructor(identifier: string) {
        this.identifier = identifier;
    }

    public exists = (): boolean => {
        return this.getToken() !== null;
    }

    public getToken = (): null | string => {
        return localStorage.getItem(this.identifier);
    }

    public setToken = (token: string) => {
        localStorage.setItem(this.identifier, token);
    }

    public delete = () => {
        localStorage.removeItem(this.identifier);
    }

}
