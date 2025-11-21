/**
 * StressSuite.gs — Comprehensive All‑In‑One Sheet System Load & Audit Suite
 *
 * Runs sequential heavy‑load tests covering values, formulas, formats, and links.
 */

function runFullStressAudit() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const log = [];
  const start = new Date();

  const sheet = ss.getSheetByName('Sheet1') || ss.insertSheet('Sheet1');
  sheet.clear();

  log.push('BEGIN STRESS AUDIT: ' + start);

  try {
    // 1️⃣ Large Value Matrix
    const rows = 1000, cols = 10;
    const data = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) row.push(`R${r+1}-C${c+1}`);
      data.push(row);
    }
    sheet.getRange(1, 1, rows, cols).setValues(data);
    log.push(`✔ Wrote ${rows*cols} string values`);

    // 2️⃣ Formula Throughput
    const formulas = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) row.push('=ROW()*COLUMN()');
      formulas.push(row);
    }
    sheet.getRange(1, 12, rows, cols).setFormulas(formulas);
    log.push('✔ Inserted 10k formulas');

    // 3️⃣ Mixed Types
    sheet.getRange('X1').setValue(new Date());
    sheet.getRange('X2').setValue(3.14159);
    sheet.getRange('X3').setValue('Long text '.repeat(200));
    sheet.getRange('X4').setFormula('=RAND()');
    log.push('✔ Mixed-type cells written');

    // 4️⃣ Cross-Sheet Links
    const out = ss.getSheetByName('Outputs') || ss.insertSheet('Outputs');
    out.clear();
    for (let i = 1; i <= 1000; i++) out.getRange(i, 1).setFormula(`=Sheet1!A${i}*1.07`);
    log.push('✔ Linked Outputs→Sheet1 references');

    // 5️⃣ Named Ranges
    for (let i = 1; i <= 20; i++) {
      ss.setNamedRange('TestRange' + i, sheet.getRange(i, 1));
    }
    log.push('✔ 20 named ranges created');

    // 6️⃣ Conditional Formatting
    const rule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=MOD(ROW(),2)=0')
      .setBackground('#f2f2f2')
      .setRanges([sheet.getRange(1, 1, 1000, 10)])
      .build();
    sheet.setConditionalFormatRules([rule]);
    log.push('✔ Conditional formatting applied');

    // 7️⃣ Style Stress
    const range = sheet.getRange(1, 1, 1000, 10);
    range.setFontWeight('bold').setFontColor('blue').setHorizontalAlignment('center');
    log.push('✔ Style formatting applied');

    // 8️⃣ Validation Stress
    const rule2 = SpreadsheetApp.newDataValidation()
      .requireValueInList(['A','B','C'], true)
      .build();
    range.setDataValidation(rule2);
    log.push('✔ Data validation applied');

    // 9️⃣ Error Injection
    sheet.getRange('Z1:Z10').setFormulas(Array(10).fill(['=#REF!']));
    log.push('✔ Error formulas injected');

    // 🔟 Copy Block
    sheet.getRange(1, 1, 1000, 10).copyTo(sheet.getRange(1, 20));
    log.push('✔ Copy block complete');

  } catch (err) {
    log.push('❌ Error: ' + err);
  }

  const duration = (new Date() - start) / 1000;
  log.push('STRESS AUDIT COMPLETE in ' + duration + 's');

  // Write to Audit tab
  const audit = ss.getSheetByName('Audit') || ss.insertSheet('Audit');
  audit.appendRow([new Date(), log.join('\n')]);
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Stress audit complete. See Audit tab.');
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Model Controls')
    .addItem('🧱 Ensure Model Sheets', 'ensureModelSheets')
    .addItem('🔥 Run Full Stress Audit', 'runFullStressAudit')
    .addToUi();
}
