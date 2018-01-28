import * as child from 'child_process';

export class ChildProcessHandler {

  public static executeChildProcCommand(command: string, errorsPossible: boolean): Promise<any> {
    let p: Promise<any> = new Promise((resolve, reject) => {
      setTimeout(() => {
        let ch: child.ChildProcess = child.exec(command, function (error, stdout, stderr) {
          if (error) {
            if (errorsPossible === true) {
              if (error === null) {
                resolve(error);
              } else {
                resolve("done");
              }
            } else {
              reject(error);
            }
          } else if (stdout) {
            resolve(stdout);
          } else if (stderr) {
              resolve(stderr);
          } else {
            resolve("done");
          }
        });
      }, 200);
    });
    return p;
  }
}