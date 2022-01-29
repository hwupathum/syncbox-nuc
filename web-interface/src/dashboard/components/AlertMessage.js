import { useEffect } from "react";
import Alert from '@mui/material/Alert';

export default function AlertMessage({ message, show, variant }) {

    useEffect(() => {
        const timeId = setTimeout(() => show(false), 5000);
        return () => clearTimeout(timeId);
    }, []);

    return (
        <Alert severity={variant} onClose={() => show(false)} dismissible >{message}</Alert>
    )
}
