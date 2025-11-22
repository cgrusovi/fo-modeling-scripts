// Controlled stress test builder
function runStressTest() {
  const ss = SpreadsheetApp.getActive();
  ss.getSheets().forEach(s => { if (s.getName().startsWith("Stress_")) ss.deleteSheet(s); });
  const sheetCount = 12;
  const rows = 100;
  const cols = 100;
  for (let i = 1; i <= sheetCount; i++) {
    const sh = ss.insertSheet('Stress_' + i);
    const data = Array.from({length: rows}, () => Array.from({length: cols}, () => Math.random()*100));
    sh.getRange(1,1,rows,cols).setValues(data);
    for (let c = 2; c <= cols; c+=10) {
      sh.getRange(1,c).setFormula(`=AVERAGE(A2:A${rows})+${c}`);
    }
    if (i > 1) {
      sh.getRange('A1').setFormula(`='Stress_${i-1}'!B2*2`);
    }
  }
  const sum = ss.insertSheet('Stress_Summary');
  for (let i = 1; i <= sheetCount; i++) {
    sum.getRange(i,1).setValue('Stress_' + i);
    sum.getRange(i,2).setFormula(`=SUM('Stress_${i}'!A:A)`);
  }
  sum.getRange('D1').setFormula('=NOW()');
  Logger.log('Controlled stress test complete');
}