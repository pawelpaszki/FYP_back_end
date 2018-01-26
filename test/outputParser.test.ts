import { expect } from 'chai';
import OutputParser from "../src/utilities/OutputParser";
import {OsJSON} from '../src/utilities/OutputParser';

describe("# OutputParser", () => {

    describe('test os-release parser', () => {
        it('should return proper os version and name', () => {
            let osReleasePathV1 = '/home/pawel/Documents/wit/year4/semester1/modules/Fyp/FYP_code/FYP-back-end/test/os-release-v1';
            let osReleasePathV2 = '/home/pawel/Documents/wit/year4/semester1/modules/Fyp/FYP_code/FYP-back-end/test/os-release-v2';
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

});