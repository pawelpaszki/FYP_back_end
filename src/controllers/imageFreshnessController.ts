import {ImageFreshnessEntry,
  IVulnerability,
  IVulnerabilityCheckRecord,
} from '../models/imageFreshnessEntry';
import {ChildProcessHandler} from '../utilities/ChildProcessHandler';
import DateComparator from '../utilities/DateComparator';
import ImageFreshnessProvider from '../utilities/ImageFreshnessProvider';
import ImageNameToDirNameConverter from '../utilities/ImageNameToDirNameConverter';
import OutputParser, {VulnScanJSON} from '../utilities/OutputParser';

class ImagesFreshnessController {

  public getAll = async (req, res) => {
    const imageFreshnessEntries = await ImageFreshnessEntry.find({}).exec();
    return res.status(200).json(imageFreshnessEntries);
  }

  public getOne = async (req, res) => {
    try {
      const imageFreshnessEntry = await ImageFreshnessEntry.findById(req.params.id).exec();
      if (!imageFreshnessEntry) {
        return res.status(404).json({ error: 'ImageFreshnessEntry with given id does not exist!' });
      } else {
        if (req.body.startDate && req.body.endDate) {
          const vulnerabilityCheckRecords: VulnScanJSON[] = [];
          for (const vulnerabilityEntry of imageFreshnessEntry.vulnerabilityCheckRecords) {
            if (DateComparator.isWithinRange(req.body.startDate, req.body.endDate, vulnerabilityEntry.date)) {
              vulnerabilityCheckRecords.push(vulnerabilityEntry);
            }
          }
          return res.status(200).json(vulnerabilityCheckRecords);
        } else {
          const freshnessGrade = ImageFreshnessProvider.getFreshnessGrade(imageFreshnessEntry.low_vuln_count,
            imageFreshnessEntry.medium_vuln_count, imageFreshnessEntry.high_vuln_count);
          return res.status(200).json({entry: imageFreshnessEntry, freshnessGrade});
        }
      }
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  public create = async (req, res) => {
    try {
      const newEntry = new ImageFreshnessEntry();
      newEntry.name = req.body.name;
      newEntry.low_vuln_count = 0;
      newEntry.medium_vuln_count = 0;
      newEntry.high_vuln_count = 0;
      newEntry.vulnerabilityCheckRecords = [];
      await newEntry.save();
      return res.status(201).json({message: 'Image freshness created saved successfully!', entry: newEntry});
    } catch (err) {
      return res.status(403).json({message: 'Unable to create image freshness entry', error: err});
    }
  }

  public delete = async (req, res) => {
    await ImageFreshnessEntry.findByIdAndRemove(req.params.id);
    return res.status(200).json({message: 'Image freshness entry deleted successfully!'});
  }

  public performVulnerabilityCheck = async (req, res) => {
    if (!req.body.name) {
      return res.status(403).json({
        error: 'Unable to persist vulnerability check. Docker image\'s name required!',
      });
    }
    const folderName = ImageNameToDirNameConverter.convertImageNameToDirName(req.body.name);
    const dirName = 'imagesTestDir/' + folderName;
    async function runCliVulnTest() {
      try {
        let entry = await ImageFreshnessEntry.findOne({name: req.body.name}).exec();
        if (entry === null) {
          entry = new ImageFreshnessEntry();
          entry.name = req.body.name;
          entry.low_vuln_count = 0;
          entry.medium_vuln_count = 0;
          entry.high_vuln_count = 0;
          entry.vulnerabilityCheckRecords = [];
        }
        const todaysDate: Date = new Date();
        let lastCheckDate: Date;
        if (entry.vulnerabilityCheckRecords.length > 0) {
          lastCheckDate = entry.vulnerabilityCheckRecords[entry.vulnerabilityCheckRecords.length - 1].date;
          if (DateComparator.isSameDay(todaysDate, lastCheckDate)) {
            return res.status(403).json({
              error: 'Vulnerability check already persisted for today\'s date',
            });
          }
        }
        let snykResults: VulnScanJSON[];
        if (process.env.NODE_ENV !== 'test') {
          const checkDir = await ChildProcessHandler.executeChildProcCommand(
            'cd imagesTestDir && find . -maxdepth 1 -name ' + folderName, false);
          if (!checkDir.toString().includes(folderName)) {
            return res.status(404).json({
              message: 'Source code not extracted for this image',
            });
          }
          const object: object = JSON.parse(await ChildProcessHandler.executeChildProcCommand(
            'docker inspect ' + req.body.name, false));
          const workingDir = object[0].ContainerConfig.WorkingDir;
          const dirToScan = dirName + workingDir;
          await ChildProcessHandler.executeChildProcCommand(
            'cd ' + dirToScan + ' && snyk test > snykScanResults.txt', true);
          snykResults = OutputParser.parseSnykOutput(dirToScan + '/snykScanResults.txt');
        } else {
          snykResults = OutputParser.parseSnykOutput('test/test-files/snykScanResultVulnFound.txt');
        }

        const lowSeverity: IVulnerability[] = [];
        const mediumSeverity: IVulnerability[] = [];
        const highSeverity: IVulnerability[] = [];
        for (const result of snykResults) {
          if (result.severity === 'low') {
            lowSeverity.push({
              dependency_path: result.vulnPath,
              description: result.description,
              name: result.vulnComp,
              remediation: result.remediation,
            });
          }
          if (result.severity === 'medium') {
            mediumSeverity.push({
              dependency_path: result.vulnPath,
              description: result.description,
              name: result.vulnComp,
              remediation: result.remediation,
            });
          }
          if (result.severity === 'high') {
            highSeverity.push({
              dependency_path: result.vulnPath,
              description: result.description,
              name: result.vulnComp,
              remediation: result.remediation,
            });
          }
        }
        const vulnerabilityCheckRecord: IVulnerabilityCheckRecord = {} as IVulnerabilityCheckRecord;

        vulnerabilityCheckRecord.date = new Date();
        vulnerabilityCheckRecord.low_severity = lowSeverity;
        vulnerabilityCheckRecord.medium_severity = mediumSeverity;
        vulnerabilityCheckRecord.high_severity = highSeverity;
        if (lowSeverity.length === 0) {
          entry.low_vuln_count = 0;
        } else {
          entry.low_vuln_count = entry.low_vuln_count + 1;
        }
        if (mediumSeverity.length === 0) {
          entry.medium_vuln_count = 0;
        } else {
          entry.medium_vuln_count = entry.medium_vuln_count + 1;
        }
        if (highSeverity.length === 0) {
          entry.high_vuln_count = 0;
        } else {
          entry.high_vuln_count = entry.high_vuln_count + 1;
        }
        entry.vulnerabilityCheckRecords.push(vulnerabilityCheckRecord);
        await entry.save();
        return res.status(201).json({
          entry,
          message: 'Vulnerability check persisted successfully',
        });
      } catch (error) {
        return res.status(500).json({
          message: 'Unable to persist vulnerability check',
        });
      }
    }
    runCliVulnTest();
  }

  public deleteAll = async (req, res) => {
    try {
      await ImageFreshnessEntry.deleteMany({});
      return res.status(200).json({message: 'Image freshness entries deleted successfully!'});
    } catch (err) {
      return res.status(400).json({message: `Unable to delete image freshness entries: ${err}`});
    }
  }
}

export default new ImagesFreshnessController();
