import FileToStringConverter from '../utilities/FileToStringConverter';

/**
 * @author Pawel Paszki
 * This class is used to extract meaningful data from files and return
 * appropriately formatted responses
 */

class OutputParser {


  /**
   * THis method gets os-release file and returns OS's name and version tag
   * @param {string} path - file path
   * @returns {OsJSON} - OS info in JSON format
   */
  public static getOSVersion(path: string): OsJSON {
    const osRelease = FileToStringConverter.readFile(path).split('\n');
    let name: string = '';
    let version: string = '';
    if (osRelease.length > 0) {
      for (let line of osRelease) {
        if (line.startsWith('ID=')) {
          name = line.substring(3);
        } else if (line.startsWith('PRETTY_NAME')) {
          let startIndex: number = 0;
          let endIndex: number = line.length;
          let startSet: boolean = false;
          let endSet: boolean = false;
          for (let i = 0; i < line.length; i++) {
            if (!startSet && '0123456789'.indexOf(line.charAt(i)) !== -1) {
              startSet = true;
              startIndex = i;
            }
            if (startSet && !endSet && '0123456789.'.indexOf(line.charAt(i)) === -1) {
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

  /**
   * This method parses Dockerfile content and returns info extracted from that file
   * @param {string} path - file path
   * @returns {DockerinfoJSON} - image info on JSON format
   */
  public static parseDockerfile(path: string): DockerinfoJSON {
    const dockerfileContent = FileToStringConverter.readFile(path).split('\n');
    let workDIR = '';
    let alpineNodeFound = false;
    if (dockerfileContent.length > 0) {
      for (let line of dockerfileContent) {
        if (line.startsWith('WORKDIR')) {
          workDIR = line.substring(7).trim();
        }
        if (line.includes('mhart/alpine-node')) {
          alpineNodeFound = true;
        }
      }
    }
    return {
      workDIR: workDIR,
      alpineNodeUsed: alpineNodeFound
    };
  }

  /**
   * This method parses content of SNYK test output
   * @param {string} path - file path
   * @returns {VulnScanJSON[]} - information about vulnerable components in JSON format
   */
  public static parseSnykOutput(path: string): VulnScanJSON[] {
    const snykScanContent: string[] = FileToStringConverter.readFile(path).split('\n');
    let entries: VulnScanJSON[] = [];
    let vulnComp: string = '';
    let severity: string = '';
    let vulnPath: string = '';
    let remediation: string = '';
    let vulnPathComponents: string[] = [];
    let description: string = '';
    if (snykScanContent.length > 0) {
      if (snykScanContent[5].includes('no vulnerable paths found')) {
        return [];
      } else {
        for (let i = 0; i < snykScanContent.length; i++) {
          vulnPath = '';
          let entryStartIndex: number = 0;
          if (snykScanContent[i].includes('severity')) {
            entryStartIndex = i;
            if (snykScanContent[i].includes('Low severity')) {
              severity = 'low';
            } else if (snykScanContent[i].includes('Medium severity')) {
              severity = 'medium';
            } else {
              severity = 'high';
            }
            vulnComp = snykScanContent[i].substring(snykScanContent[i].indexOf('found on') + 9);
            description = snykScanContent[i + 1].substring(8);
            vulnPathComponents = snykScanContent[i + 3].split('>');
            for (let j = 1; j < vulnPathComponents.length - 1; j++) {
              vulnPath += vulnPathComponents[j].trim() + ' > ';
            }
            vulnPath += vulnPathComponents[vulnPathComponents.length - 1].trim();
            if (snykScanContent[i + 4].startsWith('No direct')) {
              remediation = 'no upgrade available';
            } else if (snykScanContent[i + 4].startsWith('Your')) {
              remediation = 'try to reinstall components';
            } else if (snykScanContent[i + 4].startsWith('Upgrade')) {
              remediation = snykScanContent[i + 4].substring(26);
            }
            entries.push({
              vulnComp: vulnComp,
              severity: severity,
              vulnPath: vulnPath,
              remediation: remediation,
              description: description
            });
          }
        }
      }
    }
    return entries
  }

  public static parseNcuOutput(path: string): NcuJSON[] {
    const ncuCheckContent: string[] = FileToStringConverter.readFile(path).split('\n');
    const packagesToUpdate: NcuJSON[] = [];
    if (ncuCheckContent.length > 1) {
      if (ncuCheckContent[2].startsWith('All dependencies match')) {
        return []
      } else {
        for (let line of ncuCheckContent) {
          if (!line.startsWith('Using /') && !line.startsWith('The following') && !line.startsWith('Run ncu')) {
            if (line.length > 0) {
              packagesToUpdate.push({
                package: line.trim()
              })
            }
          }
        }
        return packagesToUpdate
      }
    }
    return []
  }
}

export default OutputParser

export interface DockerinfoJSON {
  workDIR: string;
  alpineNodeUsed: boolean;
}

export interface OsJSON {
  name: string;
  version: string;
}

export interface NcuJSON {
  package: string;
}

export interface VulnScanJSON {
  vulnComp: string;
  severity: string;
  vulnPath: string;
  remediation: string;
  description: string;
}
