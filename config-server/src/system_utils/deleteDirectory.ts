import { exec } from "child_process";
import fs from 'fs';

export default function deleteDirectory(directory: string) {
    try {
        if (fs.existsSync(directory)) {
            let command: string = `rm -dr ${directory}`;
            exec(command);   
            console.log(`${directory} is deleted successfully...`);
        }
    } catch (error) {
        console.error(error);  
    }  
}
