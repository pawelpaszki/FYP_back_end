import { expect } from 'chai';
import OutputParser from "../src/utilities/OutputParser";

import {OsJSON} from '../src/utilities/OutputParser';
import {DockerinfoJSON} from "../src/utilities/OutputParser";
import {VulnScanJSON} from '../src/utilities/OutputParser';

describe("# OutputParser", () => {

    describe('test os-release parser', () => {
        it('should return proper os version and name', () => {
            let osReleasePathV1 = 'test/os-release-v1';
            let osReleasePathV2 = 'test/os-release-v2';
            let nonExistentPath = '/nonexistentpath';
            let OsInfoV1: OsJSON = OutputParser.getOSVersion(osReleasePathV1);
            expect(OsInfoV1.name).to.equal('alpine');
            expect(OsInfoV1.version).to.equal('3.4');
            let OsInfoV2: OsJSON = OutputParser.getOSVersion(osReleasePathV2);
            expect(OsInfoV2.name).to.equal('ubuntu');
            expect(OsInfoV2.version).to.equal('16.04.3');
            let OsInfoV3: OsJSON = OutputParser.getOSVersion(nonExistentPath);
            expect(OsInfoV3.name).to.equal('');
            expect(OsInfoV3.version).to.equal('');
        });
    });

    describe('test Dockerfile parser', () => {
        it('should return path to source code in extracted container file system', () => {
            let dockerfilePath = 'test/testDockerfile';
            let nonExistentPath = '/nonexistentpath';
            let workDir: DockerinfoJSON = OutputParser.parseDockerfile(dockerfilePath);
            expect(workDir.workDIR).to.equal('/usr/src/app');
            expect(workDir.alpineNodeUsed).to.equal(true);
            let workDirNA: DockerinfoJSON = OutputParser.parseDockerfile(nonExistentPath);
            expect(workDirNA.workDIR).to.equal('');
            expect(workDirNA.alpineNodeUsed).to.equal(false);
        });
    });

    describe('test snyk parser', () => {
        it('should return appropriate response based on parsing snyk test output', () => {
            let vulnFoundOutput = 'test/snykScanResultVulnFound.txt';
            let vulnNotFoundOutput = 'test/snykScanResultNoVuln.txt';
            let vulnerabilities: VulnScanJSON[] = OutputParser.parseSnykOutput(vulnFoundOutput);
            expect(vulnerabilities.length).to.equal(21);
            expect(vulnerabilities[0].vulnComp).to.equal('angular@1.5.10');
            expect(vulnerabilities[0].severity).to.equal('medium');
            expect(vulnerabilities[0].vulnPath).to.equal('angular-simple-sidebar@1.3.1 > angular@1.5.10');
            expect(vulnerabilities[0].remediation).to.equal('no upgrade available');
            expect(vulnerabilities[0].description).to.equal('JSONP Callback Attack');
            let vulnerabilitiesNotFound: VulnScanJSON[] = OutputParser.parseSnykOutput(vulnNotFoundOutput);
            expect(vulnerabilitiesNotFound.length).to.equal(0);
        });
    });
});