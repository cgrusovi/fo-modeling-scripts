/**
 * Sheet Orchestrator: Ensures required modeling tabs exist and provides UI menu entry.
 */

function createOrEnsureTabs(requiredSheets) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const existing = ss.getSheets().map(s => s.getName());
  const results = {};

  requiredSheets.forEach(name => {
    if (!existing.includes(name)) {
      ss.insertSheet(name);
      results[name] = 'created';
    } else {
      results[name] = 'exists';
    }
  });

  SpreadsheetApp.getActiveSpreadsheet().toast('Sheet orchestration complete. Check Audit tab for results.');
  return results;
}

/**
 * Top-level convenience function for sheet orchestration.
 */
function ensureModelSheets() {
  const required = ['Inputs', 'Outputs', 'Scenarios', 'Audit'];
  const results = createOrEnsureTabs(required);
  Logger.log(results);
}

/**
 * Adds a custom toolbar menu for in-sheet access.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Model Controls')
    .addItem('🧱 Ensure Model Sheets', 'ensureModelSheets')
    .addToUi();
}