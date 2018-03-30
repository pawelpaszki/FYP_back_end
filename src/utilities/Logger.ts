import * as fs from 'fs';

export class Logger {

  public static logActivity(message: string) {
    const timestamp: Date = new Date();
    const logString = timestamp + '. ENV: ' + process.env.NODE_ENV + ' ' + message + '\n';
    fs.appendFile('./.log', logString, (err) => {
      if (err) {
        return console.log(err);
      }
    });
  }

}
