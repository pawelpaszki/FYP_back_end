import {Request, Response} from 'express';
import {ChildProcessHandler} from '../utilities/ChildProcessHandler';
import ImageNameToDirNameConverter from '../utilities/ImageNameToDirNameConverter';
import OutputParser from '../utilities/OutputParser';
import SourceCodeFinder from '../utilities/SourceCodeFinder';

class NpmController {

  public runTests = async (req: Request, res: Response) => {
    const testDir: string = ImageNameToDirNameConverter.convertImageNameToDirName(req.body.imageName);
    if (testDir.length > 0 && testDir !== 'test') {
      let testResults: string[];
      async function runNpmTests() {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'test') {
          try {
            const dirToScan = await SourceCodeFinder.getFullSrcPath(req.body.imageName);
            if (dirToScan === '') {
              return res.status(404).json({
                error: 'No source code found',
              });
            }
            await ChildProcessHandler.executeChildProcCommand(
              'cd ' + dirToScan + ' && npm test > npmTestResults.txt', true);
            testResults = OutputParser.parseNpmTests(dirToScan + '/npmTestResults.txt');
          } catch (error) {
            return res.status(500).json({
              error: 'Unable to run npm tests',
            });
          }
        } else {
          testResults = OutputParser.parseNpmTests('test/test-files/npmTestResults.txt');
        }
        return res.status(200).json({
          testResults,
        });
      }
      runNpmTests();
    } else {
      res.status(500).json({
        error: 'No image name provided',
      });
    }
  }

  public checkForUpdates = async (req: Request, res: Response) => {
    const testDir: string = ImageNameToDirNameConverter.convertImageNameToDirName(req.body.imageName);
    if (testDir.length > 0 && testDir !== 'test') {
      let updatesAvailable: string[];
      async function checkForUpdates() {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'test') {
          try {
            const dirToScan = await SourceCodeFinder.getFullSrcPath(req.body.imageName);
            if (dirToScan === '') {
              return res.status(404).json({
                error: 'No source code found',
              });
            }
            await ChildProcessHandler.executeChildProcCommand(
              'cd ' + dirToScan + ' &&  ncu --packageFile package.json > ncuResults.txt', true);
            updatesAvailable = OutputParser.parseNpmTests(dirToScan + '/ncuResults.txt');
            if (updatesAvailable.length > 0) {
              updatesAvailable = updatesAvailable.filter(
                (entry) => !entry.startsWith('Run ncu') && !entry.startsWith('The following'));
            }
          } catch (error) {
            return res.status(500).json({
              error: 'Unable to check for npm updates',
            });
          }
        } else {
          updatesAvailable = OutputParser.parseNcuOutput('test/test-files/npmUpdatesAvailable.txt');
        }
        return res.status(200).json({
          updatesAvailable,
        });
      }
      checkForUpdates();
    } else {
      res.status(500).json({
        error: 'No image name provided',
      });
    }
  }

  public updateComponents = async (req: Request, res: Response) => {
    const testDir: string = ImageNameToDirNameConverter.convertImageNameToDirName(req.body.imageName);
    if (testDir.length > 0 && testDir !== 'test') {
      let updatedModules: string[];
      async function checkForUpdates() {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'test') {
            const dirToScan = await SourceCodeFinder.getFullSrcPath(req.body.imageName);
            if (dirToScan === '') {
              return res.status(404).json({
                error: 'No source code found',
              });
            }
            await ChildProcessHandler.executeChildProcCommand(
              'cd ' + dirToScan + ' &&  ncu -a --packageFile package.json > upgraded.txt', true);
            try {
              updatedModules = OutputParser.parseNcuOutput(dirToScan + '/upgraded.txt');
              await ChildProcessHandler.executeChildProcCommand(
                'cd ' + dirToScan + ' &&  rm -rf node_modules', true);
              await ChildProcessHandler.executeChildProcCommand(
                'cd ' + dirToScan + ' &&  npm install', true);
            } catch (error) {
              return res.status(500).json({
                error: 'Unable to upgrade components',
              });
            }
        } else {
          updatedModules = OutputParser.parseNcuOutput('test/test-files/npmUpdatesAvailable.txt');
        }
        return res.status(200).json({
          updatedModules,
        });
      }
      checkForUpdates();
    } else {
      res.status(500).json({
        error: 'No image name provided',
      });
    }
  }

}

export default new NpmController();
