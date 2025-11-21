function testInjectionLog() {
  const sheet = SpreadsheetApp.openById('1b4HXrc357UhqbJT9uNbv129NR-BHV6P6p84xtcFAiz0').getSheetByName('Audit');
  const timestamp = new Date();
  sheet.appendRow(['✅ Repo Update Test Executed', timestamp]);
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Model Ops')
    .addItem('Run Repo Update Test', 'testInjectionLog')
    .addToUi();
}