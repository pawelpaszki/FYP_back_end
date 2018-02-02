import  {ImageFreshnessEntry,
  IVulnerability,
  IVulnerabilityCheckRecord
} from "../models/imageFreshnessEntry";
import OutputParser, {VulnScanJSON} from '../utilities/OutputParser';
import {ChildProcessHandler} from "../utilities/ChildProcessHandler";
import ImageNameToDirNameConverter from "../utilities/ImageNameToDirNameConverter";
import DateComparator from "../utilities/DateComparator";

class ImagesFreshnessController {

  public getAll = async (req, res) => {
    const imageFreshnessEntries = await ImageFreshnessEntry.find({}).exec();
    return res.status(200).json(imageFreshnessEntries);
  };

  public getOne = async (req, res) => {
    try {
      let imageFreshnessEntry = await ImageFreshnessEntry.findById(req.params.id).exec();
      if (!imageFreshnessEntry) {
        return res.status(404).json({ error: "ImageFreshnessEntry with given id does not exist!" });
      } else {
        if(req.body.startDate && req.body.endDate) {
          let vulnerabilityCheckRecords: VulnScanJSON[] = [];
          for(let vulnerabilityEntry of imageFreshnessEntry.vulnerabilityCheckRecords) {
            if(DateComparator.isWithinRange(req.body.startDate, req.body.endDate, vulnerabilityEntry.date)) {
              vulnerabilityCheckRecords.push(vulnerabilityEntry);
            }
          }
          return res.status(200).json(vulnerabilityCheckRecords);
        } else {
          return res.status(200).json(imageFreshnessEntry);
        }
      }
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  public create = async (req, res) => {
    try {
      let newEntry = new ImageFreshnessEntry();
      newEntry.name = req.body.name;
      newEntry.low_vuln_count = 0;
      newEntry.medium_vuln_count = 0;
      newEntry.high_vuln_count = 0;
      newEntry.vulnerabilityCheckRecords = [];
      await newEntry.save();
      return res.status(201).json({message: "Image freshness created saved successfully!", entry: newEntry});
    } catch (err) {
      return res.status(403).json({message: "Unable to create image freshness entry", error: err});
    }
  };

  public delete = async (req, res) => {
    await ImageFreshnessEntry.findByIdAndRemove(req.params.id);
    return res.status(200).json({message: "Image freshness entry deleted successfully!"});
  };

  public performVulnerabilityCheck = async (req, res) => {
    if(!req.body.name) {
      return res.status(403).json({
        error: 'Unable to persist vulnerability check. Docker image\'s name required!'
      })
    }
    const folderName = ImageNameToDirNameConverter.convertImageNameToDirName(req.body.name);
    const dirName = 'imagesTestDir/' + folderName;
    async function runCliVulnTest () {
      try {
        let entry = await ImageFreshnessEntry.findOne({name: req.body.name}).exec();
        if(entry === null) {
          entry = new ImageFreshnessEntry();
          entry.name = req.body.name;
          entry.low_vuln_count = 0;
          entry.medium_vuln_count = 0;
          entry.high_vuln_count = 0;
          entry.vulnerabilityCheckRecords = [];
        }
        let todaysDate: Date = new Date();
        let lastCheckDate: Date;
        if(entry.vulnerabilityCheckRecords.length > 0) {
          lastCheckDate = entry.vulnerabilityCheckRecords[entry.vulnerabilityCheckRecords.length - 1].date;
          if(DateComparator.isSameDay(todaysDate, lastCheckDate)) {
            return res.status(403).json({
              error: "Vulnerability check already persisted for today\'s date"
            })
          }
        }
        let snykResults: VulnScanJSON[];
        if(process.env.NODE_ENV !== 'test') {
          const checkDir = await ChildProcessHandler.executeChildProcCommand('cd imagesTestDir && find . -maxdepth 1 -name ' + folderName, false);
          if(!checkDir.toString().includes(folderName)) {
            return res.status(404).json({
              message: "Source code not extracted for this image"
            })
          }
          const object: object = JSON.parse(await ChildProcessHandler.executeChildProcCommand('docker inspect ' + req.body.name, false));
          const workingDir = object[0].ContainerConfig.WorkingDir;
          const dirToScan = dirName + workingDir;
          await ChildProcessHandler.executeChildProcCommand('cd ' + dirToScan + ' && snyk test > snykScanResults.txt', true);
          snykResults = OutputParser.parseSnykOutput(dirToScan + '/snykScanResults.txt');
        } else {
          snykResults = OutputParser.parseSnykOutput('test/test-files/snykScanResultVulnFound.txt');
        }

        let lowSeverity: IVulnerability[] = [];
        let mediumSeverity: IVulnerability[] = [];
        let highSeverity: IVulnerability[] = [];
        for(let result of snykResults) {
          if(result.severity === 'low') {
            lowSeverity.push({
              name: result.vulnComp,
              dependency_path: result.vulnPath,
              remediation: result.remediation,
              description: result.description
            })
          }
          if(result.severity === 'medium') {
            mediumSeverity.push({
              name: result.vulnComp,
              dependency_path: result.vulnPath,
              remediation: result.remediation,
              description: result.description
            })
          }
          if(result.severity === 'high') {
            highSeverity.push({
              name: result.vulnComp,
              dependency_path: result.vulnPath,
              remediation: result.remediation,
              description: result.description
            })
          }
        }
        let vulnerabilityCheckRecord:IVulnerabilityCheckRecord = {} as IVulnerabilityCheckRecord;

        vulnerabilityCheckRecord.date = new Date();
        vulnerabilityCheckRecord.low_severity = lowSeverity;
        vulnerabilityCheckRecord.medium_severity = mediumSeverity;
        vulnerabilityCheckRecord.high_severity = highSeverity;
        if(lowSeverity.length === 0) {
          entry.low_vuln_count = 0;
        } else {
          entry.low_vuln_count = entry.low_vuln_count + 1;
        }
        if(mediumSeverity.length === 0) {
          entry.medium_vuln_count = 0;
        } else {
          entry.medium_vuln_count = entry.medium_vuln_count + 1;
        }
        if(highSeverity.length === 0) {
          entry.high_vuln_count = 0;
        } else {
          entry.high_vuln_count = entry.high_vuln_count + 1;
        }
        entry.vulnerabilityCheckRecords.push(vulnerabilityCheckRecord);
        await entry.save();
        return res.status(201).json({
          message: "Vulnerability check persisted successfully", entry: entry
        })
      } catch (error) {
        return res.status(500).json({
          message: "Unable to persist vulnerability check",
          error: error
        })
      }
    }
    runCliVulnTest();
  };

  public deleteAll = async (req, res) => {
    try {
      await ImageFreshnessEntry.deleteMany({});
      return res.status(200).json({message: "Image freshness entries deleted successfully!"});
    } catch (err) {
      return res.status(400).json({message: `Unable to delete image freshness entries: ${err}`});
    }
  };
}

export default new ImagesFreshnessController