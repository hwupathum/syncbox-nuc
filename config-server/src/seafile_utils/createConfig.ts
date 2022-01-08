import fs from "fs";

export default function createConfig(location: string, server: string, username: string, token: string, client: string){
    const content = `[account]
server = ${server}
username = ${username}
token = ${token}
is_pro = false

[general]
client_name = ${client}

[cache]
size_limit = 1GB
clean_cache_interval = 10
`
    fs.writeFile(location, content, err => {
        if (err) {
          console.error(err)
          return
        }
        //file written successfully
      })
}
