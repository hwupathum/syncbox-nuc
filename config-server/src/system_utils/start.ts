import { getAllUsers } from "../database/repository";
import mountSeadrive from "../seafile_utils/mountSeadrive";
import unmountDirectory from "./unmountDirectory";

export function mountDirectoriesForSavedUsers(base_directory: string) {
    getAllUsers((error: any, result: any, fields: any) => {
        if (error) {
            console.error(error);
        } else if (result && result.length > 0) {
            for (let index in result) {
                let user = result[index];
                if (user.scope) {
                    unmountDirectory(user.scope);
                    mountSeadrive(`${base_directory}/${user.username}/seadrive.conf`, user.scope, `${base_directory}/${user.username}/seadrive.log`, true);
                }
            }
        }
    });
}
