/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Telesphorus renderer.
 * @author fenichel@google.com (Rachel Fenichel)
 */
'use strict'

import * as Blockly from 'blockly/core'

/**
 * The telesphorus renderer.
 * @package
 * @constructor
 * @extends {Blockly.blockRendering.Renderer}
 */
Blockly.telesphorus.Renderer = function () {
  Blockly.telesphorus.Renderer.superClass_.constructor.call(this)
}
Blockly.utils.object.inherits(Blockly.telesphorus.Renderer,
  Blockly.blockRendering.Renderer)

/**
 * Create a new instance of the renderer's render info object.
 * @param {!Blockly.BlockSvg} block The block to measure.
 * @return {!Blockly.telesphorus.RenderInfo} The render info object.
 * @protected
 * @override
 */
Blockly.telesphorus.Renderer.prototype.makeRenderInfo_ = function (block) {
  return new Blockly.telesphorus.RenderInfo(this, block)
}

/**
 * Create a new instance of the renderer's drawer.
 * @param {!Blockly.BlockSvg} block The block to render.
 * @param {!Blockly.blockRendering.RenderInfo} info An object containing all
 *   information needed to render this block.
 * @return {!Blockly.telesphorus.Drawer} The drawer.
 * @protected
 * @override
 */
Blockly.telesphorus.Renderer.prototype.makeDrawer_ = function (block, info) {
  return new Blockly.telesphorus.Drawer(block,
    /** @type {!Blockly.telesphorus.RenderInfo} */
    (info))
}

Blockly.blockRendering.register('telesphorus', Blockly.telesphorus.Renderer)
