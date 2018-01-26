import { expect } from 'chai';
import FileToStringConverter from "../src/utilities/FileToStringConverter";

describe("# FileToStringConverter", () => {

    describe('should read file content or return empty string on empty path', () => {
        it('should return proper os version and name', () => {
            let filePath = '/home/pawel/Documents/wit/year4/semester1/modules/Fyp/FYP_code/FYP-back-end/test/os-release-v1';
            let readString: string = FileToStringConverter.readFile(filePath);
            expect(readString.length).to.not.equal(0);
            let nonExistentPath = '/nonexistentpath';
            let readEmptyString: string = FileToStringConverter.readFile(nonExistentPath);
            expect(readEmptyString.length).to.equal(0);
        });
    });

});