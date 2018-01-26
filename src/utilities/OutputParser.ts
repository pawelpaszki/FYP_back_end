import FileToStringConverter from '../utilities/FileToStringConverter';

class OutputParser {


    /**
     * THis method gets os-release file and returns OS's name and version tag
     * @param {string} path
     * @returns {OsJSON}
     */
    public static getOSVersion(path: string): OsJSON {
        const osRelease = FileToStringConverter.readFile(path).split('\n');
        let name: string = '';
        let version: string = '';
        if(osRelease.length > 0) {
            for (let line of osRelease) {
                if(line.startsWith('ID=')) {
                    name = line.substring(3);
                } else if (line.startsWith('PRETTY_NAME')) {
                    let startIndex: number = 0;
                    let endIndex: number = line.length;
                    let startSet: boolean = false;
                    let endSet: boolean = false;
                    for(let i = 0; i < line.length; i++) {
                        if(!startSet && '0123456789'.indexOf(line.charAt(i)) !== -1) {
                            startSet = true;
                            startIndex = i;
                        }
                        if(startSet && ! endSet && '0123456789.'.indexOf(line.charAt(i)) === -1) {
                            endIndex = i;
                            endSet = true;
                        }
                    }
                    version = line.substring(startIndex, endIndex);
                }
            }
        }
        return {
            name: name,
            version: version
        };
    }
}

export default OutputParser;

export interface OsJSON {
    name: string;
    version: string;
}