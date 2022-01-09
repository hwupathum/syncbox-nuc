import axios from "axios";
import { useState } from "react";
import { Card, Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import { base_url } from "../App";

export default function LoginPage({ setToken }) {
    let history = useHistory();
    let location = useLocation();

    let { from } = location.state || { from: { pathname: "/data/" } };

    let [username, setUsername] = useState();
    let [password, setPassword] = useState();
    let [error, setError] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        const response = await loginUser(username, password);

        if (response.token) {
            setToken({ token: response.token, user: username });
            history.replace(from);
        } else if (response.error) {
            setError(response.error);
        }
    }

    return (
        <div>
            <Container className="mt-5">
                <Row>
                    <Col></Col>
                    <Col xs={6}>
                        <Card className="text-center">
                            <Form onSubmit={handleSubmit}>
                                <Card.Header>Welcome to SyncBox</Card.Header>
                                <Card.Body>
                                    <Card.Title>User Login</Card.Title>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="email" placeholder="Enter Email Address" onChange={e => setUsername(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                                    </Form.Group>
                                    <Card.Text className="text-muted">
                                        {error}
                                    </Card.Text>
                                    <Button variant="primary" type="submit">Login</Button>
                                </Card.Body>
                            </Form>
                            <Link className="btn btn-primary" to="/register">Register</Link>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    );
}

async function loginUser(username, password) {
    return axios.post(`${base_url}/login`, { username, password })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error(error);
            return error;
        });
}
