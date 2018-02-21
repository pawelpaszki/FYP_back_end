import * as Docker from 'dockerode';
import { Request, Response } from 'express';
import {ChildProcessHandler} from '../utilities/ChildProcessHandler';

const docker = new Docker({
  socketPath: '/var/run/docker.sock',
});

class ImageController {

  public search = async (req: Request, res: Response) => {
    const searchTerm: string = req.body.imageName;
    const searchResults: string = await ChildProcessHandler.executeChildProcCommand(
      'docker search --format "{{.Name}}" ' + searchTerm, true).toString();
    let images: string[] = searchResults.toString().split('\n');
    images = images.filter((image) => image !== '');
    res.status(200).json({
      images,
    });
  }

  public pull = async (req: Request, res: Response) => {
    let imageToPull: string = req.body.imageName;
    if (!imageToPull.includes(':')) {
      imageToPull += ':latest';
    }
    docker.pull(imageToPull, (error, stream) => {
      try {
        docker.modem.followProgress(stream, onFinished);
        function onFinished(err, output) {
          if (output) {
            res.status(200).json({
              message: 'Image pulled successfully',
            });
          }
        }
      } catch (err) {
        res.status(404).json({
          error: 'unable to pull image',
        });
      }
    });
  }

  public remove = async (req: Request, res: Response) => {
    const imageId: string = req.params.imageId;
    try {
      const removeResults = await ChildProcessHandler.executeChildProcCommand(
        'docker rmi --force ' + imageId, false).toString();
      if (removeResults.includes('No such image')) {
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
