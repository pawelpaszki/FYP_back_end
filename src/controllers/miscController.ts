import {Request, Response} from 'express';
import * as lodash from 'lodash';
import * as get from 'simple-get';
import {ChildProcessHandler} from '../utilities/ChildProcessHandler';
import ImageNameToDirNameConverter from '../utilities/ImageNameToDirNameConverter';
import {default as OutputParser, IOsJSON} from '../utilities/OutputParser';

class MiscController {

  public removeSrcCode = async (req: Request, res: Response) => {
    const testDir: string = ImageNameToDirNameConverter.convertImageNameToDirName(req.params.imageName);
    if (testDir.length > 0) {
      async function checkDirExists() {
        const checkDirOutput: string = await ChildProcessHandler.executeChildProcCommand(
          'cd imagesTestDir && find . -maxdepth 1 -name ' + testDir, false);
        if (!checkDirOutput.includes(testDir)) {
          return res.status(404).json({
            error: 'No source code found',
          });
        } else {
          try {
            await ChildProcessHandler.executeChildProcCommand(
              'cd imagesTestDir && rm -rf ' + testDir, false);
            res.status(200).json({
              message: 'Source code successfully removed',
            });
          } catch (error) {
            res.status(500).json({
              error: 'Unable to remove source code',
            });
          }
        }
      }
      checkDirExists();
    } else {
      res.status(500).json({
        error: 'No image name provided',
      });
    }
  }

  public dockerLogin = async (req: Request, res: Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const dockerLoginOutput: string = await ChildProcessHandler.executeChildProcCommand(
      'docker login -u ' + username + ' -p ' + password, true);
    if (dockerLoginOutput.includes('Login Succeeded')) {
      res.status(200).json({
        message: 'Login Successful',
      });
    } else {
      res.status(401).json({
        error: 'Incorrect login and/or password',
      });
    }
  }

  public checkOS = async (req: Request, res: Response) => {
    const testDir: string = ImageNameToDirNameConverter.convertImageNameToDirName(req.body.imageName);
    if (testDir.length > 0) {
      async function checkOSVersion() {
        const checkDirOutput: string = await ChildProcessHandler.executeChildProcCommand(
          'cd imagesTestDir && find . -maxdepth 1 -name ' + testDir, false);
        if (!checkDirOutput.includes(testDir)) {
          return res.status(404).json({
            error: 'No source code found',
          });
        } else {
          try {
            const path: string = 'imagesTestDir/' + testDir + '/etc/os-release';
            const osVersion: IOsJSON = await OutputParser.getOSVersion(path);
            if (osVersion.name !== '') {
              const url: string = 'https://registry.hub.docker.com/v2/repositories/library/'
                + osVersion.name + '/tags/';
              let jsonResponse = null;
              /* tslint:disable */
              get.concat(url, function(err, response, data) {
                /* tslint:enable */
                jsonResponse = JSON.parse(data.toString());
                const results = lodash.map(jsonResponse.results, 'name');
                /* tslint:disable */
                const osVersions  = results.filter(function(el) {
                  return el.toString().length && el == +el;
                });
                /* tslint:enable */
                osVersions.sort();
                res.status(200).json({
                  latest: osVersions[osVersions.length - 1],
                  name: osVersion.name,
                  version: osVersion.version,
                });
              });
            }
          } catch (error) {
            res.status(500).json({
              error: 'Unable to get OS version',
            });
          }
        }
      }
      checkOSVersion();
    } else {
      res.status(500).json({
        error: 'No image name provided',
      });
    }
  }

  public getAvailableDirs = async (req: Request, res: Response) => {
    const directories: string = await ChildProcessHandler.executeChildProcCommand(
      'cd imagesTestDir && ls', false);
    const directoryArray = directories.split('\n').filter((directory) => directory !== '');
    res.status(200).json({
      directoryArray,
    });
  }

}

export default new MiscController();
