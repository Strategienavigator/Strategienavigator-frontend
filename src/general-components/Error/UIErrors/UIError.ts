type ErrorMap = {
    [id: string]: UIError
};

type ErrorLevel = "info" | "warning" | "error";

interface UIError {
    id: string
    message: string
    level: ErrorLevel
}

export type {
    ErrorLevel,
    UIError,
    ErrorMap,
}
