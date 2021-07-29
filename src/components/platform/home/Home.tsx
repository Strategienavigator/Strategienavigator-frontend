import {Component} from "react";
import {Link} from "react-router-dom";
import {Form, FormControl} from "react-bootstrap";

class Home extends Component<any, any> {

    render() {
        return (
            <div className={"container"}>
                <Form className="d-flex justify-content-center align-items-center">
                    <FormControl
                        size={"sm"}
                        type="search"
                        placeholder="Suchen"
                        aria-label="Suchen"
                    />
                </Form>

                <Link to={"/pairwise-comparison"}>Paarweiser vergleich</Link>
            </div>
        );
    }

}

export default Home;