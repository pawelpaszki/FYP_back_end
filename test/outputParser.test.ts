import {expect} from 'chai';
import OutputParser from '../src/utilities/OutputParser';

import {IOsJSON} from '../src/utilities/OutputParser';
import {IDockerinfoJSON} from '../src/utilities/OutputParser';
import {IVulnScanJSON} from '../src/utilities/OutputParser';

describe('# OutputParser', () => {

  describe('test os-release parser', () => {
    it('should return proper os version and name', () => {
      let osReleasePathV1 = 'test/test-files/os-release-v1';
      let osReleasePathV2 = 'test/test-files/os-release-v2';
      let nonExistentPath = '/nonexistentpath';
      let OsInfoV1: IOsJSON = OutputParser.getOSVersion(osReleasePathV1);
      expect(OsInfoV1.name).to.equal('alpine');
      expect(OsInfoV1.version).to.equal('3.4');
      let OsInfoV2: IOsJSON = OutputParser.getOSVersion(osReleasePathV2);
      expect(OsInfoV2.name).to.equal('ubuntu');
      expect(OsInfoV2.version).to.equal('16.04.3');
      let OsInfoV3: IOsJSON = OutputParser.getOSVersion(nonExistentPath);
      expect(OsInfoV3.name).to.equal('');
      expect(OsInfoV3.version).to.equal('');
    });
  });

  describe('test Dockerfile parser', () => {
    it('should return path to source code in extracted container file system', () => {
      let dockerfilePath = 'test/test-files/testDockerfile';
      let nonExistentPath = '/nonexistentpath';
      let workDir: IDockerinfoJSON = OutputParser.parseDockerfile(dockerfilePath);
      expect(workDir.workDIR).to.equal('/usr/src/app');
      expect(workDir.alpineNodeUsed).to.equal(true);
      let workDirNA: IDockerinfoJSON = OutputParser.parseDockerfile(nonExistentPath);
      expect(workDirNA.workDIR).to.equal('');
      expect(workDirNA.alpineNodeUsed).to.equal(false);
    });
  });

  describe('test snyk parser', () => {
    it('should return appropriate response based on parsing snyk test output', () => {
      let vulnFoundOutput = 'test/test-files/snykScanResultVulnFound.txt';
      let vulnNotFoundOutput = 'test/test-files/snykScanResultNoVuln.txt';
      let vulnerabilities: IVulnScanJSON[] = OutputParser.parseSnykOutput(vulnFoundOutput);
      expect(vulnerabilities.length).to.equal(21);
      expect(vulnerabilities[0].vulnComp).to.equal('angular@1.5.10');
      expect(vulnerabilities[0].severity).to.equal('medium');
      expect(vulnerabilities[0].vulnPath).to.equal('angular-simple-sidebar@1.3.1 > angular@1.5.10');
      expect(vulnerabilities[0].remediation).to.equal('no upgrade available');
      expect(vulnerabilities[0].description).to.equal('JSONP Callback Attack');
      let vulnerabilitiesNotFound: IVulnScanJSON[] = OutputParser.parseSnykOutput(vulnNotFoundOutput);
      expect(vulnerabilitiesNotFound.length).to.equal(0);
    });
  });

  describe('test ncu parser', () => {
    it('should return appropriate response based on parsing ncu output', () => {
      let npmUpdatesFoundOutput = 'test/test-files/npmUpdatesAvailable.txt';
      let npmUpdatesNotFoundOutput = 'test/test-files/noNpmUpdates.txt';
      let nonExistentPath = '/nonexistentpath';
      let updates: string[] = OutputParser.parseNcuOutput(npmUpdatesFoundOutput);
      expect(updates.length).to.equal(7);
      expect(updates[0]).to.equal('@types/mongoose  ^4.7.32  →  ^5.0.0');
      let updatesNotFound: string[] = OutputParser.parseNcuOutput(npmUpdatesNotFoundOutput);
      expect(updatesNotFound.length).to.equal(0);
      let nonExistentFileParse: string[] = OutputParser.parseNcuOutput(nonExistentPath);
      expect(nonExistentFileParse.length).to.equal(0);
    });
  });

  describe('test npm test parser', () => {
    it('should return appropriate response based on parsing npm test output', () => {
      let npmTestOutput = 'test/test-files/npmTestResults.txt';
      let nonExistentPath = '/nonexistentpath';
      let testLines: string[] = OutputParser.parseNpmTests(npmTestOutput);
      expect(testLines.length).to.be.greaterThan(0);
      expect(testLines[0]).to.equal('> nyc mocha --exit');
      let outputNonexistentPath: string[] = OutputParser.parseNpmTests(nonExistentPath);
      expect(outputNonexistentPath.length).to.equal(0);
    });
  });

  describe('test package.json parser', () => {
    it('should return appropriate response based on parsing package.json output', () => {
      let packageJsonOutput = 'test/test-files/package.json';
      let testLines: string[] = OutputParser.parsePackageJson(packageJsonOutput);
      expect(testLines.length).to.be.greaterThan(0);
    });
  });
});