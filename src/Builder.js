
/**
 * Builder for making BINVOX buffer data.
 */
export class Builder {

  /**
   * Creates a new BINVOX Builder.
   */
  constructor() {
    this.dimension = {};
    this.translation = {};
    this.scale = 1;
    this.voxels = [];
  }

  /**
   * Build BINVOX file buffer data.
   * @param {VoxelData} data JavaScript representation of BINVOX voxel data.
   */
  build(data) {
    this.dimension = data.dimension;
    this.translation = data.translate;
    this.scale = data.scale;
    this.voxels = data.voxels;

    let headerTArray = this._generateHeader();
    let voxelsTArray = this._generateVoxelData();

    // Concatenate the two typed arrays.
    var binvoxArray = new Uint8Array(headerTArray.length + voxelsTArray.length);
    binvoxArray.set(headerTArray);
    binvoxArray.set(voxelsTArray, headerTArray.length);

    return binvoxArray.buffer;
  }

  /**
   * Generate the ASCII BINVOX file header.
   * @private
   */
  _generateHeader() {
    var encoder = new TextEncoder('ascii');

    let header = "";
    header += "#binvox 1\n";
    header += "dim " + [this.dimension.depth, this.dimension.width, this.dimension.height].join(" ") + "\n";
    header += "translate " + [this.translation.depth, this.translation.width, this.translation.height].join(" ") + "\n";
    header += "scale " + this.scale + "\n";
    header += "data\n";

    return encoder.encode(header);
  }

  /**
   * Generate the binary voxel data.
   * @private
   */
  _generateVoxelData() {
    let index = 0;
    let count = 0;
    let state;
    if (
      this.voxels[0].x === 0 &&
      this.voxels[0].y === 0 &&
      this.voxels[0].z === 0
    ) {
      state = 1;
    } else {
      state = 0;
    }

    let array = [];

    for (let i = 0; i < this.dimension.depth; i++) {
      for (let j = 0; j < this.dimension.height; j++) {
        for (let k = 0; k < this.dimension.width; k++) {

          let value = 0;
          if (
            this.voxels[index] !== undefined &&
            this.voxels[index].x === i &&
            this.voxels[index].y === k &&
            this.voxels[index].z === j
          ) {
            index++;
            value = 1;
          }

          if (value === state) {
            count++;
            if (count === 255) {
              // Max count encountered!
              array.push(state, count);
              count = 0;
            }
          } else {
            // Switch in state detected!
            array.push(state, count);
            state = value;
            count = 1;
          }
        }
      }
    }
    // Handle remaining.
    if (count > 0) {
      array.push(state, count);
    }

    return new Uint8Array(array);
  }
}
