/**
 * FO Modeling Gateway - Base Apps Script Entry
 * Project Script ID: 16DP9d6q2FM0j9ZUkvJy44Aw_PJEJ_0VyrKJkGmZe-nus0iaTgv2-w2uL
 * Repo: cgrusovi/fo-modeling-scripts
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('FO Gateway')
    .addItem('Connectivity Test', 'testConnection')
    .addToUi();
}

function testConnection() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  sheet.getRange('A1').setValue('✅ Gateway connected at ' + new Date());
}