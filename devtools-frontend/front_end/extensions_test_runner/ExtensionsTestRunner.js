// Copyright 2017 The Chromium Authors. All
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @fileoverview using private properties isn't a Closure violation in tests.
 * @suppress {accessControls}
 */

const extensionsHost = 'devtools-extensions.oopif.test';
Extensions.extensionServer._registerHandler('evaluateForTestInFrontEnd', onEvaluate);
Extensions.extensionsOrigin = `http://${extensionsHost}:8000`;
Extensions.extensionServer._extensionAPITestHook = function(extensionServerClient, coreAPI) {
  window.webInspector = coreAPI;
  window._extensionServerForTests = extensionServerClient;
  coreAPI.panels.themeName = 'themeNameForTest';
};

ExtensionsTestRunner._replyToExtension = function(requestId, port) {
  Extensions.extensionServer._dispatchCallback(requestId, port);
};

function onEvaluate(message, port) {
  // Note: reply(...) is actually used in eval strings
  // eslint-disable-next-line no-unused-vars
  function reply(param) {
    Extensions.extensionServer._dispatchCallback(message.requestId, port, param);
  }

  try {
    eval(message.expression);
  } catch (e) {
    TestRunner.addResult('Exception while running: ' + message.expression + '\n' + (e.stack || e));
    TestRunner.completeTest();
  }
}

ExtensionsTestRunner.showPanel = function(panelId) {
  if (panelId === 'extension') {
    panelId = UI.inspectorView._tabbedPane._tabs[UI.inspectorView._tabbedPane._tabs.length - 1].id;
  }
  return UI.inspectorView.showPanel(panelId);
};

ExtensionsTestRunner.evaluateInExtension = function(code) {
  ExtensionsTestRunner._codeToEvaluateBeforeTests = code;
};

ExtensionsTestRunner.runExtensionTests = async function(tests) {
  const result = await TestRunner.RuntimeAgent.evaluate('location.href', 'console', false);

  if (!result) {
    return;
  }

  ExtensionsTestRunner._pendingTests = (ExtensionsTestRunner._codeToEvaluateBeforeTests || '') + tests.join('\n');
  const pageURL = result.value;
  let extensionURL = pageURL.replace(/^(https?:\/\/[^\/]*\/).*$/, '$1') + 'devtools/resources/extension-main.html';
  extensionURL = extensionURL.replace('127.0.0.1', extensionsHost);

  Extensions.extensionServer._addExtension(
      {startPage: extensionURL, name: 'test extension', exposeWebInspectorNamespace: true});
};

(function disableLogging() {
  // Suppress console warnings from ExtensionServer.js
  console.warn = () => undefined;
})();
