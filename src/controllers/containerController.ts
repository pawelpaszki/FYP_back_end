import * as Docker from 'dockerode';

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
    const containerId = req.body.containerId;
    const container = docker.getContainer(containerId);
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
}

export default new containerController