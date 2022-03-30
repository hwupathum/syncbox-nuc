import { exec } from "child_process";
import config from "config";
import { SeafileResponse } from "../model/seafile_response.model";
import axios from 'axios';

const host = config.get("seafile_host");

export default function getFileDetails(
  token: string,
  path_hash: string,
  filename: string,
  callback: Function
) {
  let command: string = `curl -H 'Authorization: Token ${token}' -H 'Accept: application/json; charset=utf-8; indent=4' '${host}/api2/repos/${path_hash}/file/detail/?p=/${filename}'`;
  exec(command, (error, stdout, stderr) => {
    callback(new SeafileResponse(error, stdout, stderr));
  });
}


export async function getFileDetailsByAxios(
  token: string,
  path_hash: string,
  filename: string,
) {
  try {
    const results = await axios.get(`${host}/api2/repos/${path_hash}/file/detail/?p=/${filename}`, {headers : {
      'Accept': 'application/json; charset=utf-8; indent=4',
      'Authorization': `Token ${token}`
    }})

    return results?.data;

  } catch (e: any) {
    console.log("Get File Details error", e?.message)
  }
    
  
}
