
/**
 * @typedef {Object} Voxel The actual voxel data, describing a filled voxel.
 * @property {number} x The x coordinate of the voxel.
 * @property {number} y The y coordinate of the voxel.
 * @property {number} z The z coordinate of the voxel.
 */

/**
 * @typedef {Object} VoxelData Parsed BINVOX file data structure representation.
 * @property {Object} dimension The dimension of the voxel data.
 * @property {number} dimension.depth The depth dimension of the voxel data.
 * @property {number} dimension.width The width dimension of the voxel data.
 * @property {number} dimension.height The height dimension of the voxel data.
 * @property {Object} translate The translation of the voxel data.
 * @property {number} translate.depth The depth translation of the voxel data.
 * @property {number} translate.width The width translation of the voxel data.
 * @property {number} translate.height The height translation of the voxel data.
 * @property {number} scale The scaling of the voxel data.
 * @property {Array<Voxel>} voxels The actual voxel data, describing filled voxels.
 */

/**
 * Parser for parsing BINVOX voxel file data.
 */
export class Parser {

  /**
   * Creates a BINVOX Parser.
   */
  constructor() {
    this.dimension = {};
    this.translation = {};
    this.scale = 1;
    this.voxels = [];
    this.index = 0;
  }

  /**
   * Parse BINVOX file buffer data.
   * @param {ArrayBuffer} buffer BINVOX buffer data.
   * @returns {VoxelData} The parsed voxel data.
   */
  parse(buffer) {
    this._parseHeader(buffer);
    this._parseVoxelData(buffer);

    return {
      dimension: this.dimension,
      translate: this.translation,
      scale: this.scale,
      voxels: this.voxels
    }
  }

  /**
   * Parse the BINVOX ASCII file header.
   * @param {ArrayBuffer} buffer BINVOX file buffer data.
   * @private
   */
  _parseHeader(buffer) {
    var decoder = new TextDecoder('ascii');
    let continueReading = true;
    let lines = [];

    let i = this.index;
    let line = "";
    while (continueReading) {
      let char = decoder.decode(buffer.slice(i, i + 1));
      if (char === "\n") {
        lines.push(line);
        line = "";
      } else {
        line += char;
      }
      if (line === "Data" || lines.length >= 5) {
        continueReading = false;
      }
      i++;
    }

    this.index = i;

    let version = lines[0];
    let dimension = lines[1];
    let translate = lines[2];
    let scale = lines[3];
    let data = lines[4];

    // Check "version" line
    if (version !== "#binvox 1") {
      throw new Error("First line reads \"" + version + "\" instead of \"#binvox\"");
    }

    // Parse "dimension"
    let dimensionArray = dimension.split(" ");
    if (dimensionArray[0] !== "dim") {
      throw new Error("Error reading dimension line");
    }
    this.dimension = { depth: parseInt(dimensionArray[1]), width: parseInt(dimensionArray[2]), height: parseInt(dimensionArray[3]) };

    // Parse "translation"
    let translateArray = translate.split(" ");
    if (translateArray[0] !== "translate") {
      throw new Error("Error reading translate line");
    }
    this.translation = { depth: parseFloat(translateArray[1]), width: parseFloat(translateArray[2]), height: parseFloat(translateArray[3]) };

    // Parse "scale"
    let scaleArray = scale.split(" ");
    if (scaleArray[0] !== "scale") {
      throw new Error("Error reading scale line");
    }
    this.scale = parseFloat(scaleArray[1]);

    // Check "data" line
    if (data !== "data") {
      throw new Error("Error reading header");
    }
  }

  /**
   * Parse the voxel buffer data.
   * @param {ArrayBuffer} buffer BINVOX file voxel buffer data.
   * @private
   */
  _parseVoxelData(buffer) {
    var int8view = new Uint8Array(buffer, this.index);

    let i = 0;
    let y = 0;
    let z = 0;
    let x = 0;

    while (i < int8view.length) {
      const value = int8view[i];
      const count = int8view[i + 1];

      for (let j = 0; j < count; j++) {
        if (value === 1) {
          let point = { x: x, y: y, z: z };
          this.voxels.push(point);
        }
        y++;
        if (y === this.dimension.width) {
          y = 0;
          z++;
        }
        if (z === this.dimension.height) {
          z = 0;
          x++;
        }
      }
      i += 2;
    }
  }
}
