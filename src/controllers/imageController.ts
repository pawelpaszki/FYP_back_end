import {ChildProcessHandler} from '../utilities/ChildProcessHandler';

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
}

export default new ImageController();
