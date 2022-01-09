import { useEffect } from "react";
import { Alert } from "react-bootstrap";

export default function AlertMessage({ message, show, variant }) {

    useEffect(() => {
        const timeId = setTimeout(() => show(false), 5000);
        return () => clearTimeout(timeId);
    }, []);

    return (
        <Alert variant={variant} onClose={() => show(false)} dismissible >{message}</Alert>
    )
}
