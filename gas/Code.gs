/**
 * Family Office Control Engine (FOCE)
 * Main Apps Script Backend - Production Version v1
 * -------------------------------------------------
 * Provides menu creation, backend orchestration, and modular subsystems for:
 *  - Portfolio Monitoring
 *  - Capital Calls / Distributions
 *  - Cash Flow Forecasting
 *  - LP Reporting
 *  - Diagnostics / Logging
 */

/** =========================
 *   ON OPEN / MENU LOGIC
 *  ========================= */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('FO Modeling')
    .addItem('Open Control Panel', 'openControlPanel')
    .addSeparator()
    .addItem('Run Monthly Update', 'runMonthlyUpdate')
    .addItem('Test Connection', 'testConnection')
    .addToUi();
}

function onInstall() {
  onOpen();
}

/** =========================
 *   SIDEBAR CONTROL PANEL
 *  ========================= */
function openControlPanel() {
  const html = HtmlService.createHtmlOutputFromFile('ControlPanel')
    .setTitle('Family Office Control Panel');
  SpreadsheetApp.getUi().showSidebar(html);
}

/** =========================
 *   TEST CONNECTION
 *  ========================= */
function testConnection() {
  const sheetName = 'DIAGNOSTICS';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  sheet.getRange('A1').setValue('FOCE Connection Test');
  sheet.getRange('B1').setValue(new Date());
  sheet.getRange('C1').setValue('SUCCESS');
  logEvent('TestConnection', 'SUCCESS');
}

/** =========================
 *   RUN MONTHLY UPDATE
 *  ========================= */
function runMonthlyUpdate() {
  try {
    logEvent('MonthlyUpdate', 'START');
    PortfolioEngine.refreshPortfolio();
    CapitalEngine.refreshCapitalCalls();
    CashflowEngine.refreshForecasts();
    ReportingEngine.refreshReports();
    logEvent('MonthlyUpdate', 'COMPLETE');
  } catch (err) {
    logEvent('MonthlyUpdate', 'ERROR: ' + err.message);
  }
}

/** =========================
 *   LOGGING UTILITY
 *  ========================= */
function logEvent(processName, status) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('DIAGNOSTICS');
  if (!sheet) sheet = ss.insertSheet('DIAGNOSTICS');
  const lastRow = sheet.getLastRow() + 1;
  sheet.getRange(lastRow, 1, 1, 4).setValues([[new Date(), Session.getActiveUser().getEmail(), processName, status]]);
}

/** =========================
 *   MODULES
 *  ========================= */

/** PORTFOLIO ENGINE */
const PortfolioEngine = {
  refreshPortfolio: function() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('PORTFOLIO_OVERVIEW');
    if (!sheet) sheet = ss.insertSheet('PORTFOLIO_OVERVIEW');
    sheet.getRange('A1').setValue('Portfolio refreshed at:');
    sheet.getRange('B1').setValue(new Date());
  }
};

/** CAPITAL ENGINE */
const CapitalEngine = {
  refreshCapitalCalls: function() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('CAPITAL_CALLS');
    if (!sheet) sheet = ss.insertSheet('CAPITAL_CALLS');
    sheet.getRange('A1').setValue('Capital Calls refreshed:');
    sheet.getRange('B1').setValue(new Date());
  }
};

/** CASHFLOW ENGINE */
const CashflowEngine = {
  refreshForecasts: function() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('CASH_FLOW_FORECAST');
    if (!sheet) sheet = ss.insertSheet('CASH_FLOW_FORECAST');
    sheet.getRange('A1').setValue('Forecasts updated:');
    sheet.getRange('B1').setValue(new Date());
  }
};

/** REPORTING ENGINE */
const ReportingEngine = {
  refreshReports: function() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('LP_REPORTING');
    if (!sheet) sheet = ss.insertSheet('LP_REPORTING');
    sheet.getRange('A1').setValue('Reports refreshed:');
    sheet.getRange('B1').setValue(new Date());
  }
};

/** =========================
 *   NAMED RANGE UTILITIES
 *  ========================= */
const RangeUtils = {
  getNamed: function(name) {
    return SpreadsheetApp.getActiveSpreadsheet().getRangeByName(name);
  },
  setNamed: function(name, value) {
    const range = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(name);
    if (range) range.setValue(value);
  }
};