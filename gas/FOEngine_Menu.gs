/**
 * FOEngine_Menu
 * ------------------------------------------------------------
 * Handles the custom Google Sheets UI menu, sidebar management,
 * and routing of top-level commands to appropriate engine modules.
 */

/**
 * Add custom menu when spreadsheet is opened.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('FO Modeling')
    .addItem('Open Control Panel', 'FOEngine_Menu.openControlPanel')
    .addSeparator()
    .addItem('Run Monthly Update', 'FOEngine_Menu.runMonthlyUpdate')
    .addItem('Test Connection', 'FOEngine_Menu.testConnection')
    .addToUi();
}

/**
 * Called when the add-on is installed.
 */
function onInstall() {
  onOpen();
}

/**
 * Menu module containing routed methods.
 */
const FOEngine_Menu = {
  /**
   * Opens the HTML sidebar control panel.
   */
  openControlPanel: function() {
    const html = HtmlService.createHtmlOutputFromFile('ControlPanel')
      .setTitle('Family Office Control Panel');
    SpreadsheetApp.getUi().showSidebar(html);
  },

  /**
   * Executes a lightweight connectivity test.
   */
  testConnection: function() {
    FOEngine_Diagnostics.testConnection();
  },

  /**
   * Runs a full monthly update pipeline.
   */
  runMonthlyUpdate: function() {
    try {
      FOEngine_Util.log('Menu', 'Starting monthly update...', 'INFO');
      FOEngine_Diagnostics.startRun('MONTHLY_UPDATE');
      FOEngine_Config.validateEnvironment();

      FOEngine_Portfolio.refreshPortfolio();
      FOEngine_CapitalCalls.refreshCapitalCalls();
      FOEngine_Distributions.refreshDistributions();
      FOEngine_Cashflow.refreshForecasts();
      FOEngine_Reporting.generateReports();

      FOEngine_Diagnostics.completeRun('MONTHLY_UPDATE', 'SUCCESS');
    } catch (err) {
      FOEngine_Util.logError('Menu', err);
      FOEngine_Diagnostics.completeRun('MONTHLY_UPDATE', 'ERROR: ' + err.message);
    }
  }
};