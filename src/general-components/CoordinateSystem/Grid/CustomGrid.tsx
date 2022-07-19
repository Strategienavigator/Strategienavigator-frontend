import {ReactElement} from "react";


abstract class CustomGrid {
    private classNames = ["grid-overlay"];

    protected constructor(classNames?: string[]) {
        if (classNames) {
            this.classNames = this.classNames.concat(classNames);
        }
    }

    public render() {
        return (
            <div className={this.classNames.join(" ")}>
                {this.getItems()}
            </div>
        );
    }

    protected addClassName = (className: string) => {
        this.classNames.push(className);
    }

    protected abstract getItems(): ReactElement[];

}

export {
    CustomGrid
}