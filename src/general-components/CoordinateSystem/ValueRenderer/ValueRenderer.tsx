/**
 * Dient zum Rendern der Achsenwerte
 */
export interface ValueRenderer {
    render(value: number): JSX.Element;
}
