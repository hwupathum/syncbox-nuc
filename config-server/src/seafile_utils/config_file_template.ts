import config from "config";

export default function configFileTemplate(
  username: string,
  token: string,
  client: string
) {
  const seafile_server = config.get("seafile_server");
  return `[account]
 server = ${seafile_server}
 username = ${username}
 token = ${token}
 is_pro = false
 
 [general]
 client_name = ${client}
 
 [cache]
 size_limit = 1GB
 clean_cache_interval = 10
 `;
}
