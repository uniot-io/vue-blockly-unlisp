'use strict'

import * as Blockly from 'blockly/core'

Blockly.telesphorus.Drawer = function (block, info) {
  Blockly.telesphorus.Drawer.superClass_.constructor.call(this, block, info)
}
Blockly.utils.object.inherits(Blockly.telesphorus.Drawer, Blockly.blockRendering.Drawer)

/**
 * @override
 */
Blockly.telesphorus.Drawer.prototype.drawTop_ = function () {
  const topRow = this.info_.topRow
  const elements = topRow.elements
  let heightCorrection = 0
  this.positionPreviousConnection_()
  this.outlinePath_ += Blockly.utils.svgPaths.moveBy(topRow.xPos, this.info_.startY)
  for (let i = 0, elem; (elem = elements[i]); i++) {
    if (Blockly.blockRendering.Types.isLeftRoundedCorner(elem)) {
      this.outlinePath_ += this.constants_.OUTSIDE_CORNERS.topLeft
    } else if (Blockly.blockRendering.Types.isPreviousConnection(elem)) {
      this.outlinePath_ += elem.shape.pathLeft
    } else if (Blockly.blockRendering.Types.isHat(elem)) {
      this.outlinePath_ += this.constants_.START_HAT.path
      heightCorrection += this.constants_.START_HAT.height
    } else if (Blockly.blockRendering.Types.isSpacer(elem)) {
      this.outlinePath_ += Blockly.utils.svgPaths.lineOnAxis('h', elem.width)
    }
    // No branch for a square corner, because it's a no-op.
  }
  this.outlinePath_ += Blockly.utils.svgPaths.lineOnAxis('v', topRow.height - heightCorrection)
}
