import * as Docker from 'dockerode';
import {Container, ContainerInspectInfo} from 'dockerode';
import * as fs from 'fs';
import {ChildProcessHandler} from '../utilities/ChildProcessHandler';
import ImageNameToDirNameConverter from '../utilities/ImageNameToDirNameConverter';

const docker = new Docker({
  socketPath: '/var/run/docker.sock',
});

class ContainerController {

  public create = async (req, res) => {
    const name = req.body.name;
    docker.createContainer({
      AttachStderr: true,
      AttachStdin: false,
      AttachStdout: true,
      Image: name,
      OpenStdin: false,
      StdinOnce: false,
      Tty: true,
    }, (err, data) => {
      if (data === null) {
        res.status(500).json({
          error: 'Unable to create container',
        });
      } else {
        res.status(201).json({
          message: 'Container created successfully',
        });
      }
    });
  }

  public start = async (req, res) => {
    const container = docker.getContainer(req.body.containerId);
    container.start((err, data) => {
      if (data === null) {
        res.status(404).json({
          error: 'Unable to start container',
        });
      } else {
        res.status(200).json({
          message: 'Container started successfully',
        });
      }
    });
  }
  //
  // public stop = async (req, res) => {
  //   // TODO
  // };
  //
  // public list = async (req, res) => {
  //   // TODO
  // };
  //
  // public remove = async (req, res) => {
  //   // TODO
  // };

  public extract = async (req, res) => {
    const container = docker.getContainer(req.body.containerId);
    let containerInfo: ContainerInspectInfo;
    try {
      containerInfo = await container.inspect();
    } catch (error) {
      return res.status(404).json({
        err: 'Unable to extract source code. Container not found',
      });
    }
    if (containerInfo.State.Running === false) {
      return res.status(403).json({
        err: 'The container must be running to extract the source code',
      });
    }
    const testDir: string = ImageNameToDirNameConverter.convertImageNameToDirName(req.body.imageName);
    if (testDir.length > 0) {
      let checkDirOutput = '';
      async function getDirOutput() {
        if (process.env.NODE_ENV !== 'test') {
          checkDirOutput = await ChildProcessHandler.executeChildProcCommand(
            'cd imagesTestDir && find . -maxdepth 1 -name ' + testDir, false);
          if (checkDirOutput.toString().includes(testDir)) {
            return res.status(403).json({
              message: 'Source code already extracted',
            });
          }
        }
        try {
          container.export((err, stream) => {
            try {
              const ws = fs.createWriteStream('imageArchive.tar');
              stream.pipe(ws);
              ws.on('finish', () => {
                async function extractCont() {
                  try {
                    await ChildProcessHandler.executeChildProcCommand('cd imagesTestDir && mkdir ' + testDir, true);
                    await ChildProcessHandler.executeChildProcCommand(
                      'tar -x -f imageArchive.tar --directory imagesTestDir/' + testDir, true);
                    await ChildProcessHandler.executeChildProcCommand('rm -rf imageArchive.tar', true);
                    return res.status(200).json({
                      message: 'Container source code extracted successfully',
                    });
                  } catch (error) {
                    return res.status(500).json({
                      err: error,
                      message: 'Unable to extract source code',
                    });
                  }
                }
                extractCont();
              });
            } catch (err) {
              return res.status(404).json({
                message: 'Unable to extract source code',
              });
            }
          });
        } catch (error) {
          return res.status(500).json({
            message: 'Unable to extract source code',
          });
        }
      }
      getDirOutput();
    } else {
      res.status(500).json({
        message: 'Unable to extract source code',
      });
    }
  }
}

export default new ContainerController();
