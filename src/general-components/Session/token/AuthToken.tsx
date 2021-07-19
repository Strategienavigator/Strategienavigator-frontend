import Token from "./Token";
import {Buffer} from "buffer";

interface JWTTokenPayloadInterface {
    userId: number;
    expiryDate: Date;
    id: string;
}

class AuthToken extends Token {

    constructor() {
        super("token");
    }

    getValidTokenBreakdown = (): null | JWTTokenPayloadInterface => {
        if (this.exists()) {
            let breakDown = this.breakDown();
            if (breakDown !== null) {
                if (breakDown.expiryDate > new Date()) {
                    return breakDown;
                }
            }
        }
        return null;
    }

    breakDown = (): JWTTokenPayloadInterface | null => {
        if (this.exists()) {
            let token = this.getToken() as string;
            let splitted = token.split(".");

            if (splitted.length === 3) {
                let payload64: string = splitted[1];
                let payload: any = Buffer.from(payload64, 'base64').toString();
                payload = JSON.parse(payload);

                return {
                    userId: parseInt(String(payload["sub"])),
                    id: String(payload["jti"]),
                    expiryDate: new Date(payload["exp"] * 1000)
                };
            }
        }
        return null;
    }

}

export default AuthToken;