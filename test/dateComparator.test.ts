import {expect} from "chai";
import DateComparator from "../src/utilities/DateComparator";

describe("# Date comparator", () => {

  describe('test compare two dates', () => {
    it('should return true if two dates are the same', () => {
      let date1: Date = new Date();
      let date2: Date = new Date();
      expect(DateComparator.isSameDay(date1, date2)).to.equal(true);
    });
  });

});