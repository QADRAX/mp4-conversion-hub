import { ScanReport } from "@mp4-conversion-hub/shared";
import NodeClam from "clamscan";

const nodeClam = new NodeClam();

const options: NodeClam.Options = {
  removeInfected: false, // If true, removes infected files
  quarantineInfected: false, // False: Don't quarantine, Path: Moves files to this place.
  debugMode: false, // Whether or not to log info/debug/error msgs to the console
  scanRecursively: true, // If true, deep scan folders recursively
  clamscan: {
    path: "/usr/bin/clamscan", // Path to clamscan binary on your server
    scanArchives: true, // If true, scan archives (ex. zip, rar, tar, dmg, iso, etc...)
    active: true, // If true, this module will consider using the clamscan binary
  },
  clamdscan: {
    active: false,
  },
  preference: "clamscan",
};



export async function scanFile(filePath: string): Promise<ScanReport> {
    const clamdscan = await nodeClam.init(options);
    const { isInfected, viruses } = await clamdscan.isInfected(filePath);
    return { isInfected, viruses };
}
