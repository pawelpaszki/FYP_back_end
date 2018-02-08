import * as mongoose from 'mongoose';

export interface IVulnerabilityCheckRecord {
  date: Date;
  low_severity: IVulnerability[];
  medium_severity: IVulnerability[];
  high_severity: IVulnerability[];
}

export interface IVulnerability {
  name: string;
  dependency_path: string;
  remediation: string;
  description: string;
}

interface ImageFreshnessEntry extends mongoose.Document {
  name: string;
  low_vuln_count: number;
  medium_vuln_count: number;
  high_vuln_count: number;
  vulnerabilityCheckRecords: any[];
}

const imageFreshnessEntrySchema = new mongoose.Schema({
  high_vuln_count: Number,
  low_vuln_count: Number,
  medium_vuln_count: Number,
  name: {type: String, unique: true},
  vulnerabilityCheckRecords: [{}],
});

export const ImageFreshnessEntry = mongoose.model<ImageFreshnessEntry>(
  'ImageFreshnessEntry', imageFreshnessEntrySchema);
