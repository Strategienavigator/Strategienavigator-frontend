import {Component, ReactNode} from "react";


export interface ErrorPageProps {
    header: ReactNode,
    text: ReactNode,
    image?: string,
    imageAlt?: string
}

class ErrorPage extends Component<ErrorPageProps, any> {

    render() {
        return (
            <div>
                <h2>{this.props.header}</h2>

                {this.props.image && (
                    <img src={this.props.image} alt={this.props.imageAlt}/>
                )}

                <p>{this.props.text}</p>
            </div>
        );
    }

}

export {
    ErrorPage
}
