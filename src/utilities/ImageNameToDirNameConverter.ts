import * as fs from 'fs';

/**
 * @author Pawel Paszki
 * This class is used to read content of files specified by their path
 */

class ImageNameToDirNameConverter {

  public static convertImageNameToDirName(imageName: string): string {
    const imageNameTokens = imageName.split('/');
    const dirPrefix: string = process.env.NODE_ENV === 'test' ? 'test' : '';
    if (imageNameTokens.length === 2) {
      return dirPrefix + imageNameTokens[0].toUpperCase() + imageNameTokens[1].toLowerCase();
    } else {
      if (imageNameTokens.length === 1) {
        return dirPrefix + imageNameTokens[0].toUpperCase();
      }
    }

  }
}

export default ImageNameToDirNameConverter;
