import * as fs from 'fs';

/**
 * @author Pawel Paszki
 * This class is used to read content of files specified by their path
 */

class FileToStringConverter {

    /**
     *
     * @param {string} path of file to be read
     * @returns {string} - string content of read file
     */
    public static readFile(path: string): string {
        try {
            return fs.readFileSync(path).toString();
        } catch (err) {
            return '';
        }

    }
}

export default FileToStringConverter;