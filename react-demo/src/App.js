import {Component} from "react";
import {Table} from "react-bootstrap";

class App extends Component {

    constructor(props) {
        super(props);

       // props.name ist hier Peter

        this.state = {
          loaded: false,
          users: null
        };
    }

    componentDidMount = async () => {
        const APIURL = process.env.REACT_APP_API;

        const response = await fetch(APIURL + "users", null);
        let data = await response.json();

        this.setState({
           loaded: true,
           users: data
        });
    }

    render = () => {
        return (
            <div className="container">
                {!this.state.loaded && (
                    <div>Lädt...</div>
                )}

                {this.state.loaded && (
                    <Table striped hover bordered>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>E-Mail</th>
                                <th>Anonym</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.users.map((value) => {
                            return (
                                <tr key={value.id}>
                                    <td>{value.id}</td>
                                    <td>{value.username}</td>
                                    <td>{value.email}</td>
                                    <td>{(value.anonym) ? "Ja" : "Nein"}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </Table>
                )}
            </div>
        );
    }

}

export default App;
