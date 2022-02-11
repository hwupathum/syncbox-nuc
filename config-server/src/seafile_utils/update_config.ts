import readFile from "../file_system_utils/read_file";
import updateFile from "../file_system_utils/update_file";

export default function updateSeafileConfigurationFile(
  file_name: string,
  token: string
) {
  const { error, content } = readFile(file_name);
  if (content) {
    let old_token = content.split("\n")[3].substring(8);
    updateFile(file_name, content.replace(old_token, token));
  }
}
