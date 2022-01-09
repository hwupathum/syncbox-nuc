import { Card, ListGroup } from "react-bootstrap";

export default function DirectoryTile({ id, location, name }) {
    return (
        <ListGroup.Item key={id}>
            <Card>
                <Card.Body>
                    <a href={`/data/${location}/${name}`}>{name}</a>
                </Card.Body>
            </Card>
        </ListGroup.Item>
    )
}
