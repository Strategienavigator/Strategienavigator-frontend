import {ToolErrorController} from "../Tool/ToolSavePage/ToolSavePage";

type SimpleErrorMap = Map<string, string>;
type TreeErrorMap = Map<string, TreeErrorMap | UIError>;

type ErrorLevel = "info" | "warning" | "error";

interface UIError {
    id: string
    message: string
    level: ErrorLevel
}

/**
 * @deprecated
 */
class ErrorBag implements ToolErrorController {
    private errorEntries: TreeErrorMap;


    constructor() {
        this.errorEntries = new Map();
    }

    private splitId(id: string) {
        return id.split(".");
    }

    private static insertError(keys: string[], errors: TreeErrorMap, error: UIError): boolean {
        const key = keys[0];
        const entry = errors.get(key);
        if (entry !== undefined) {
            if (entry instanceof Map) {
                if (keys.length === 1) {
                    entry.set(key, error);
                    return true;
                } else {
                    return ErrorBag.insertError(keys.slice(1, keys.length), entry, error);
                }
            } else {
                return false;
            }
        } else {
            if (keys.length === 1) {
                errors.set(key, error);
                return true;
            }

            const newMap = new Map();
            errors.set(key, newMap);
            return ErrorBag.insertError(keys.slice(1, keys.length), newMap, error);
        }


    }

    addError(error: UIError): void {
        const keys = this.splitId(error.id);
        ErrorBag.insertError(keys, this.errorEntries, error);
    }

    hasError(id: string): boolean {
        return false;
    }

    hasErrors(id: string): boolean {
        return false;
    }


    getErrors(id: string): SimpleErrorMap {
        throw new Error("Not implemented");
    }

    removeError(id: string): void {
    }

    getError(id: string): UIError {
        return {id:"blank",level:"info",message:"Not Implemented"};
    }


}

export type {
    SimpleErrorMap,
    ErrorLevel,
    UIError,
}

export {
    ErrorBag
}
