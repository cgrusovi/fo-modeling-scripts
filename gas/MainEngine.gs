// MainEngine.gs — Institutional Final Form (FO-MAE v1.0-staging)
// Family Office Global Holdings
// Environment constants
const FO_ENV = 'STAGING';
const FO_SCRIPT_ID = '16DP9d6q2FM0j9ZUkvJy44Aw_PJEJ_0VyrKJkGmZe-nus0iaTgv2-w2uL';
const FO_SHEET_ID = '1b4HXrc357UhqbJT9uNbv129NR-BHV6P6p84xtcFAiz0';
const FO_ORG_NAME = 'Family Office Global Holdings';

/**
 * Main institutional control engine for the Family Office Multi‑Asset Environment (FO‑MAE).
 * Built for stress‑testing, scenario propagation, and multi‑tab orchestration.
 */

var MainEngine = (function () {
  /** Cache Sheet object references for speed. */
  const _ss = SpreadsheetApp.openById(FO_SHEET_ID);
  const _cache = {};

  /** Utility to fetch sheet by name with caching */
  function getSheet_(name) {
    if (!_cache[name]) {
      _cache[name] = _ss.getSheetByName(name);
    }
    return _cache[name];
  }

  /** Write to the audit log */
  function logEvent_(event, detail) {
    const admin = getSheet_('ADMIN');
    admin.appendRow([new Date(), event, detail || '', Session.getActiveUser().getEmail(), FO_ENV]);
  }

  /** Safe execution wrapper */
  function safeExecute_(fn, label) {
    try {
      const start = new Date();
      fn();
      const ms = new Date() - start;
      logEvent_(`Execution OK — ${label}`, `${ms} ms`);
    } catch (err) {
      logEvent_(`Execution FAILED — ${label}`, err.toString());
    }
  }

  /** Initialize core model structure */
  function initializeEnvironment() {
    safeExecute_(function () {
      const names = ['DASHBOARD','ASSET REGISTER','REAL ESTATE','PRIVATE EQUITY','DEBT FACILITY','CASH FLOW','SCENARIO ENGINE','VAL & METRICS','ADMIN'];
      names.forEach(n => {
        if (!_ss.getSheetByName(n)) _ss.insertSheet(n);
      });
      getSheet_('ADMIN').appendRow([new Date(), 'Environment Initialized', FO_ORG_NAME]);
    }, 'initializeEnvironment');
  }

  /** Refresh KPI dashboard */
  function refreshDashboard() {
    safeExecute_(function () {
      const dash = getSheet_('DASHBOARD');
      const now = new Date();
      dash.getRange('A1').setValue(`${FO_ORG_NAME} — FO Engine`);
      dash.getRange('B2').setValue(now);
      dash.getRange('B3').setValue('KPIs Refreshed');
      const valSheet = getSheet_('VAL & METRICS');
      const data = valSheet.getRange('A2:B10').getValues();
      dash.getRange('D2:E10').setValues(data);
    }, 'refreshDashboard');
  }

  /** Scenario propagation */
  function propagateScenario() {
    safeExecute_(function () {
      const scen = getSheet_('SCENARIO ENGINE');
      const values = scen.getRange('A2:B20').getValues();
      const dict = {};
      values.forEach(r => dict[r[0]] = r[1]);
      const re = getSheet_('REAL ESTATE');
      const pe = getSheet_('PRIVATE EQUITY');
      const debt = getSheet_('DEBT FACILITY');
      // Example propagation to RE tab
      re.getRange('H2').setValue(dict['Growth'] || 0);
      pe.getRange('H2').setValue(dict['Multiple'] || 0);
      debt.getRange('H2').setValue(dict['Rate'] || 0);
    }, 'propagateScenario');
  }

  /** Consolidate all cash flow tabs into a master sheet */
  function consolidateCashflows() {
    safeExecute_(function () {
      const re = getSheet_('REAL ESTATE').getRange('A2:D100').getValues();
      const pe = getSheet_('PRIVATE EQUITY').getRange('A2:D100').getValues();
      const debt = getSheet_('DEBT FACILITY').getRange('A2:D100').getValues();
      const cash = getSheet_('CASH FLOW');
      cash.clearContents();
      cash.getRange(1,1,1,4).setValues([['Source','Period','Inflows','Outflows']]);
      const rows = [];
      re.forEach(r => rows.push(['RE'].concat(r)));
      pe.forEach(r => rows.push(['PE'].concat(r)));
      debt.forEach(r => rows.push(['Debt'].concat(r)));
      cash.getRange(2,1,rows.length,rows[0].length).setValues(rows);
    }, 'consolidateCashflows');
  }

  /** Main sync orchestrator */
  function runFullSync() {
    safeExecute_(function () {
      propagateScenario();
      consolidateCashflows();
      refreshDashboard();
    }, 'runFullSync');
  }

  /** Menu builder */
  function onOpen() {
    const ui = SpreadsheetApp.getUi();
    const menu = ui.createMenu('FO Engine');
    menu.addItem('Initialize Environment', 'MainEngine.initializeEnvironment');
    menu.addItem('Run Full Sync', 'MainEngine.runFullSync');
    menu.addItem('Refresh Dashboard', 'MainEngine.refreshDashboard');
    menu.addItem('Propagate Scenario', 'MainEngine.propagateScenario');
    menu.addToUi();
    logEvent_('Menu Built');
  }

  /** Expose public API */
  return {
    initializeEnvironment: initializeEnvironment,
    refreshDashboard: refreshDashboard,
    propagateScenario: propagateScenario,
    consolidateCashflows: consolidateCashflows,
    runFullSync: runFullSync,
    onOpen: onOpen
  };
})();

function onOpen() {
  MainEngine.onOpen();
}