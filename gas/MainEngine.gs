// MainEngine.gs
// Family Office Global Holdings — FO-MAE v1.0-staging
// Environment constants
const FO_ENV = 'STAGING';
const FO_SCRIPT_ID = '16DP9d6q2FM0j9ZUkvJy44Aw_PJEJ_0VyrKJkGmZe-nus0iaTgv2-w2uL';
const FO_SHEET_ID = '1b4HXrc357UhqbJT9uNbv129NR-BHV6P6p84xtcFAiz0';
const FO_ORG_NAME = 'Family Office Global Holdings';

function launchDashboard() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('ModalDashboard')
      .setWidth(1200)
      .setHeight(800);
    SpreadsheetApp.getUi().showModalDialog(html, `${FO_ORG_NAME} — FO Engine Dashboard`);
  } catch (err) {
    Logger.log(`Error launching dashboard: ${err}`);
    SpreadsheetApp.getUi().alert('Failed to launch dashboard. Check logs.');
  }
}

function initializeFO() {
  const ss = SpreadsheetApp.openById(FO_SHEET_ID);
  const sheetNames = ['DASHBOARD', 'ASSET REGISTER', 'REAL ESTATE', 'PRIVATE EQUITY', 'DEBT FACILITY', 'CASH FLOW', 'SCENARIO ENGINE', 'VAL & METRICS', 'ADMIN'];
  sheetNames.forEach(name => {
    if (!ss.getSheetByName(name)) {
      ss.insertSheet(name);
    }
  });
  Logger.log('Family Office model initialized successfully.');
}

function refreshKPIs() {
  const ss = SpreadsheetApp.openById(FO_SHEET_ID);
  const dash = ss.getSheetByName('DASHBOARD');
  dash.getRange('B2').setValue(new Date());
  dash.getRange('B3').setValue('KPIs refreshed');
  Logger.log('KPIs refreshed.');
}

function syncScenarioData() {
  try {
    const ss = SpreadsheetApp.openById(FO_SHEET_ID);
    const scen = ss.getSheetByName('SCENARIO ENGINE');
    const assets = ss.getSheetByName('ASSET REGISTER');
    // Example propagation logic
    const growth = scen.getRange('B2').getValue();
    const inflation = scen.getRange('B3').getValue();
    assets.getRange('H2').setValue(growth);
    assets.getRange('H3').setValue(inflation);
    Logger.log('Scenario sync complete.');
  } catch (err) {
    Logger.log(`Error syncing scenario: ${err}`);
  }
}

function recordAudit(eventName) {
  const ss = SpreadsheetApp.openById(FO_SHEET_ID);
  const admin = ss.getSheetByName('ADMIN');
  admin.appendRow([new Date(), eventName, Session.getActiveUser().getEmail()]);
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('FO Engine');
  menu.addItem('Launch Dashboard', 'launchDashboard');
  menu.addItem('Initialize Model', 'initializeFO');
  menu.addItem('Refresh KPIs', 'refreshKPIs');
  menu.addItem('Sync Scenario', 'syncScenarioData');
  menu.addToUi();
  Logger.log('Menu built successfully.');
}
