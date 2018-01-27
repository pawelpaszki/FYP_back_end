import * as Docker from 'dockerode';

let docker = new Docker({
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
      if (data == null) {
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
    // TODO
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