import { useState } from "react";
import { Card, Col, Form, FormControl, InputGroup, ListGroup, Row } from "react-bootstrap";

export default function FileTile({ file, download, schedule }) {
    const [startDate, setStartDate] = useState();
    const [startTime, setStartTime] = useState();

    return (
        <Card.Footer>
            <ListGroup>
                <ListGroup.Item action onClick={() => download(file.name)}>Download Now</ListGroup.Item>
                <ListGroup.Item action>
                    <Row>
                        <Col xs={6} md={4}>Schedule Download</Col>
                        <Col xs={12} md={8}>
                            <Form onSubmit={(e) => schedule(e, file.name, startDate, startTime)}>
                                <Row className="align-items-center">
                                    <Col xs="auto">
                                        <Form.Label htmlFor="inlineFormInput" visuallyHidden>Start Time</Form.Label>
                                        <InputGroup className="mb-2">
                                            <InputGroup.Text>DATE</InputGroup.Text>
                                            <FormControl type="date" placeholder="Start Time" onChange={e => setStartDate(e.target.value)} />
                                        </InputGroup>
                                    </Col>
                                    <Col xs="auto">
                                        <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>End Time</Form.Label>
                                        <InputGroup className="mb-2">
                                            <InputGroup.Text>TIME</InputGroup.Text>
                                            <FormControl type="time" placeholder="End Time" onChange={e => setStartTime(e.target.value)} />
                                        </InputGroup>
                                    </Col>
                                    <Col xs="auto">
                                        <button type="submit" className="btn mb-2 btn-sm btn-primary">Schedule</button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
        </Card.Footer>

    )
}
