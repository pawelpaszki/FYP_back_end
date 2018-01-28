import * as Docker from 'dockerode';
import * as fs from "fs";
import {ChildProcessHandler} from "../utilities/ChildProcessHandler";

const docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

class containerController {

  public create = async (req, res) => {
    const name = req.body.name;
    docker.createContainer({
      Image: name,
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      OpenStdin: false,
      StdinOnce: false
    }, (err, data) => {
      if (data === null) {
        res.status(500).json({
          message: "Unable to create container",
          error: err
        })
      } else {
        res.status(201).json({
          message: "Container created successfully"
        })
      }
    });
  };

  public start = async (req, res) => {
    const container = docker.getContainer(req.body.containerId);
    container.start(function (err, data) {
      if (data === null) {
        res.status(404).json({
          message: "Unable to start container",
          error: err
        })
      } else {
        res.status(200).json({
          message: "Container started successfully"
        })
      }
    });
  };

  public stop = async (req, res) => {
    // TODO
  };

  public list = async (req, res) => {
    // TODO
  };

  public remove = async (req, res) => {
    // TODO
  };

  public extract = async (req, res) => {
    const container = docker.getContainer(req.body.containerId);
    const imageName = req.body.imageName;
    const imageNameTokens = imageName.split('/');
    if(imageNameTokens.length == 2) {
      const testDir = imageNameTokens[0].toUpperCase() + imageNameTokens[1].toLowerCase();
      container.export(function (err, stream) {
        if (err) {
          console.log(err);
        }
        try {
          let ws = fs.createWriteStream("imageArchive.tar");
          stream.pipe(ws);
          ws.on('finish', function () {
            async function extractCont () {
              try {
                await ChildProcessHandler.executeChildProcCommand('cd imagesTestDir && rm -rf ' + testDir, true);
                await ChildProcessHandler.executeChildProcCommand('cd imagesTestDir && mkdir ' + testDir, true);
                await ChildProcessHandler.executeChildProcCommand('tar -x -f imageArchive.tar --directory imagesTestDir/' + testDir, true);
                await ChildProcessHandler.executeChildProcCommand("rm -rf imageArchive.tar", true);
                res.status(200).json({
                  message: "Container source code extracted successfully"
                })
              } catch (error) {
                res.status(500).json({
                  message: "Unable to extract source code"
                })
              }
            }
            extractCont();
          });
        } catch (err) {
          res.status(404).json({
            message: "Unable to extract source code"
          })
        }

      });
    } else {
      res.status(500).json({
        message: "Unable to extract source code"
      })
    }
  };
}

export default new containerController