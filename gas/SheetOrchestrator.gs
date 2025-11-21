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

  // Audit logging
  const auditName = 'Audit';
  let audit = ss.getSheetByName(auditName);
  if (!audit) audit = ss.insertSheet(auditName);
  const ts = new Date();
  const row = [ts, JSON.stringify(results)];
  audit.appendRow(row);

  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Sheet orchestration complete. See Audit tab for log.');
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
