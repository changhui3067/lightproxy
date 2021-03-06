// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

export default class ScriptOriginPlugin extends Sources.UISourceCodeFrame.Plugin {
  /**
   * @param {!SourceFrame.SourcesTextEditor} textEditor
   * @param {!Workspace.UISourceCode} uiSourceCode
   */
  constructor(textEditor, uiSourceCode) {
    super();
    this._textEditor = textEditor;
    this._uiSourceCode = uiSourceCode;
  }

  /**
   * @override
   * @param {!Workspace.UISourceCode} uiSourceCode
   * @return {boolean}
   */
  static accepts(uiSourceCode) {
    return uiSourceCode.contentType().hasScripts() || !!ScriptOriginPlugin._script(uiSourceCode);
  }

  /**
   * @override
   * @return {!Array<!UI.ToolbarItem>}
   */
  rightToolbarItems() {
    const originURL = Bindings.CompilerScriptMapping.uiSourceCodeOrigin(this._uiSourceCode);
    if (originURL) {
      const item = UI.formatLocalized('(source mapped from %s)', [Components.Linkifier.linkifyURL(originURL)]);
      return [new UI.ToolbarItem(item)];
    }

    // Handle anonymous scripts with an originStackTrace.
    const script = ScriptOriginPlugin._script(this._uiSourceCode);
    if (!script || !script.originStackTrace) {
      return [];
    }
    const link = _linkifier.linkifyStackTraceTopFrame(script.debuggerModel.target(), script.originStackTrace);
    return [new UI.ToolbarItem(link)];
  }

  /**
   * @param {!Workspace.UISourceCode} uiSourceCode
   * @return {?SDK.Script}
   */
  static _script(uiSourceCode) {
    const locations = Bindings.debuggerWorkspaceBinding.uiLocationToRawLocations(uiSourceCode, 0, 0);
    for (const location of locations) {
      const script = location.script();
      if (script && script.originStackTrace) {
        return script;
      }
    }
    return null;
  }
}

export const _linkifier = new Components.Linkifier();

/* Legacy exported object */
self.Sources = self.Sources || {};

/* Legacy exported object */
Sources = Sources || {};

/** @constructor */
Sources.ScriptOriginPlugin = ScriptOriginPlugin;

Sources.ScriptOriginPlugin._linkifier = _linkifier;
