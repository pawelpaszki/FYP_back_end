import ImageFreshnessEntry, {
  IImageFreshnessEntry, IVulnerability,
  IVulnerabilityCheckRecord
} from "../models/imageFreshnessEntry";
import OutputParser, {VulnScanJSON} from '../utilities/OutputParser';
import {ChildProcessHandler} from "../utilities/ChildProcessHandler";
import ImageNameToDirNameConverter from "../utilities/ImageNameToDirNameConverter";
import * as Q from 'q';
import DateComparator from "../utilities/DateComparator";

class ImagesFreshnessController {

  public getAll = async (req, res) => {
    try {
      let imageFreshnessEntries = await ImageFreshnessEntry.find({}).exec();
      res.status(200).json(imageFreshnessEntries);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  public getOne = async (req, res) => {
    try {
      let imageFreshnessEntry = await ImageFreshnessEntry.findById(req.params.id).exec();
      if (imageFreshnessEntry === null) {
        return res.status(404).json({ message: "This image freshness entry does not exist" });
      } else {
        res.status(200).json(imageFreshnessEntry);
      }
    } catch (err) {
      res.status(400).json(err);
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
      res.status(201).json({message: "Image freshness entry saved successfully!", "id": newEntry._id});
    } catch (err) {
      res.status(400).json({message: "Could not create image freshness entry", errors: err});
    }
  };

  public delete = async (req, res) => {
    try {
      await ImageFreshnessEntry.findByIdAndRemove(req.params.id);
      res.status(200).json({message: "Image freshness entry deleted successfully!"});
    } catch (err) {
      res.status(404).json({message: `Error delete image freshness entry: ${err}`});
    }
  };

  // public runVulnerabilityCheck = async (req, res) => {
  //   function getFreshnessEntry() {
  //     let foundEntry;
  //     return Q(ImageFreshnessEntry.find({_id: req.params.id}).exec())
  //       .then(function(entry) {
  //         foundEntry = entry;
  //         return foundEntry;
  //       })
  //   }
  //   getFreshnessEntry()
  //     .then(function(entry) {
  //       if(entry.length === 0) {
  //         let newEntry = new ImageFreshnessEntry();
  //         newEntry.name = req.body.name;
  //         newEntry.low_vuln_count = 0;
  //         newEntry.medium_vuln_count = 0;
  //         newEntry.high_vuln_count = 0;
  //         newEntry.vulnerabilityCheckRecords = [];
  //         newEntry.save();
  //         ImagesFreshnessController.completeVulnerabilityCheck(req, res);
  //       } else {
  //         ImagesFreshnessController.completeVulnerabilityCheck(req, res);
  //       }
  //     })
  //     .catch(function(err) {
  //       res.status(400).json({message: "Could not save vulnerability check"});
  //     })
  //     .done(function() {
  //
  //     });
  // };

 public performVulnerabilityCheck = async (req, res) => {
    const folderName = ImageNameToDirNameConverter.convertImageNameToDirName(req.body.name);
    const dirName = 'imagesTestDir/' + folderName;
    async function runCliVulnTest () {
      try {
        let entry: IImageFreshnessEntry = await ImageFreshnessEntry.findOne({name: req.body.name}).exec() as IImageFreshnessEntry;
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
            res.status(403).json({
              error: "Vulnerability check already persisted for today\'s date"
            })
          }
        }
        let checkDir = await ChildProcessHandler.executeChildProcCommand('cd imagesTestDir && find . -maxdepth 1 -name ' + folderName, false);
        if(!checkDir.toString().includes(folderName)) {
          res.status(404).json({
            message: "Source code not extracted for this image"
          })
        }

        let object: object = JSON.parse(await ChildProcessHandler.executeChildProcCommand('docker inspect ' + req.body.name, false));
        const workingDir = object[0].ContainerConfig.WorkingDir;
        const dirToScan = dirName + workingDir;
        await ChildProcessHandler.executeChildProcCommand('cd ' + dirToScan + ' && snyk test > snykScanResults.txt', true);
        const snykResults: VulnScanJSON[] = OutputParser.parseSnykOutput(dirToScan + '/snykScanResults.txt');
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
        console.log(vulnerabilityCheckRecord);
        entry.vulnerabilityCheckRecords.push(vulnerabilityCheckRecord);
        await entry.save();
        res.status(200).json({
          message: "Vulnerability check persisted successfully", entry: entry
        })
      } catch (error) {
        res.status(500).json({
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
      res.status(200).json({message: "Image freshness entries deleted successfully!"});
    } catch (err) {
      res.status(400).json({message: `Error delete image freshness entry: ${err}`});
    }
  };
}

export default new ImagesFreshnessController