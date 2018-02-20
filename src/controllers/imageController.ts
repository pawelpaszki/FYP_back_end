import * as Docker from 'dockerode';
import {ChildProcessHandler} from '../utilities/ChildProcessHandler';

const docker = new Docker({
  socketPath: '/var/run/docker.sock',
});

class ImageController {

  public search = async (req, res) => {
    const searchTerm = req.body.imageName;
    const searchResults = await ChildProcessHandler.executeChildProcCommand(
      'docker search --format "{{.Name}}" ' + searchTerm, true);
    let images = searchResults.toString().split('\n');
    images = images.filter((image) => image !== '');
    res.status(200).json({
      images,
    });
  }

  public pull = async (req, res) => {
    let imageToPull = req.body.imageName;
    if (!imageToPull.toString().includes(':')) {
      imageToPull += ':latest';
    }
    docker.pull(imageToPull, (error, stream) => {
      try {
        docker.modem.followProgress(stream, onFinished);
        function onFinished(err, output) {
          if (output) {
            res.status(200).json({
              message: 'image pulled successfully',
            });
          }
        }
      } catch (err) {
        res.status(404).json({
          message: 'unable to pull image',
        });
      }
    });
  }

  public remove = async (req, res) => {
    const imageId = req.params.imageId;
    try {
      const removeResults = await ChildProcessHandler.executeChildProcCommand(
        'docker rmi --force ' + imageId, false);
      if (removeResults.toString().includes('No such image')) {
        res.status(404).json({
          message: 'Image not found',
        });
      } else {
        res.status(200).json({
          message: 'Image removed successfully',
        });
      }
    } catch (error) {
      res.status(409).json({
        message: 'Image cannot be removed',
      });
    }
  }
}

export default new ImageController();
