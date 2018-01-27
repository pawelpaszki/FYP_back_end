import * as mongoose from 'mongoose';

export interface IVulnerabilityCheckRecord {
    date: Date,
    low_severity: Array<IVulnerability>,
    medium_severity: Array<IVulnerability>,
    high_severity: Array<IVulnerability>
}

export interface IVulnerability {
    name: string,
    dependency_path: string
}

export interface IImageFreshnessEntry {
    name: string,
    low_vuln_count: number,
    medium_vuln_count: number,
    high_vuln_count: number,
    vulnerabilityCheckRecords: Array<IVulnerabilityCheckRecord>
}

interface IImageFreshnessEntryModel extends IImageFreshnessEntry, mongoose.Document {
}

let imageFreshnessEntrySchema = new mongoose.Schema({
    name: {type: String, unique: true},
    low_vuln_count: Number,
    medium_vuln_count: Number,
    high_vuln_count: Number,
    vulnerabilityCheckRecords: [{}]
});

let ImageFreshnessEntry = mongoose.model<IImageFreshnessEntryModel>("ImageFreshnessEntry", imageFreshnessEntrySchema);

export default ImageFreshnessEntry;