class ImageFreshnessProvider {

  public static getFreshnessGrade(low_vuln_count: number, medium_vuln_count: number, high_vuln_count: number): string {
    if (low_vuln_count >= 180 || medium_vuln_count >= 90 || high_vuln_count >= 30) {
      return 'F';
    } else if (low_vuln_count >= 90 || medium_vuln_count >= 30 || high_vuln_count >= 7) {
      return 'E';
    } else if (low_vuln_count >= 30 || medium_vuln_count >= 7 || high_vuln_count > 0) {
      return 'D';
    } else if ((low_vuln_count >= 7 || medium_vuln_count > 0) && high_vuln_count == 0) {
      return 'C';
    } else if (low_vuln_count > 0 && medium_vuln_count == 0 && high_vuln_count == 0) {
      return 'B';
    } else {
      return 'A';
    }
  }
}

export default ImageFreshnessProvider;