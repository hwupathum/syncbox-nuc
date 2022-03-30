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


export function getFileDetailsByAxios(
  token: string,
  path_hash: string,
  filename: string,
) {
    axios.get(`${host}/api2/repos/${path_hash}/file/detail/?p=/${filename}`, {headers : {
      'Accept': 'application/json; charset=utf-8; indent=4',
      'Authorization': `Token ${token}`
    }}).then(function (response) {
      // handle success
      console.log(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    }) 
}
