import * as fs from 'fs';

export class Logger {

  public static logActivity(message: string) {
    const timestamp: Date = new Date();
    const logString = timestamp + ' ' + message + '\n';
    fs.appendFile("./.log", logString, function(err) {
      if(err) {
        return console.log(err);
      }
    });
  }

}