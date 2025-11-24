// PortfolioBuilder.gs — Institutional Build (FO-MAE v1.0-staging)
// Handles asset registration, tab creation, and linkage across RE + PE portfolios.

const PortfolioBuilder = (function(){

  function registerAsset(assetType, assetName, acquisitionDate, cost, leverage){
    const ss = SpreadsheetApp.openById(FO_SHEET_ID);
    const reg = ss.getSheetByName('ASSET REGISTER');
    const id = Utilities.getUuid();
    reg.appendRow([id, assetType, assetName, acquisitionDate, cost, leverage, new Date(), Session.getActiveUser().getEmail()]);
    if(assetType === 'REAL ESTATE'){
      buildRealEstateTab_(id, assetName, cost, leverage);
    } else if(assetType === 'PRIVATE EQUITY'){
      buildPrivateEquityTab_(id, assetName, cost, leverage);
    }
    logBuildEvent_(`Asset Registered: ${assetName}`);
  }

  function buildRealEstateTab_(id, assetName, cost, leverage){
    const ss = SpreadsheetApp.openById(FO_SHEET_ID);
    const sheet = ss.insertSheet(`${assetName}_RE`);
    sheet.getRange('A1:F1').setValues([[ 'Asset ID','Metric','Value','Formula','Notes','Updated']]);
    const data = [
      [id,'Acquisition Cost',cost,'','='],
      [id,'Leverage %',leverage,'','='],
      [id,'Cap Rate','0.06','','='],
      [id,'NOI','=B3*C3','','='],
      [id,'DSCR','=D4/D5','','=']
    ];
    sheet.getRange(2,1,data.length,data[0].length).setValues(data);
    sheet.autoResizeColumns(1,6);
  }

  function buildPrivateEquityTab_(id, assetName, cost, leverage){
    const ss = SpreadsheetApp.openById(FO_SHEET_ID);
    const sheet = ss.insertSheet(`${assetName}_PE`);
    sheet.getRange('A1:E1').setValues([[ 'Asset ID','Period','Cash Outflow','Cash Inflow','Notes']]);
    const data = [];
    for(let i=1;i<=12;i++){
      data.push([id,`Q${i}`,'','', '']);
    }
    sheet.getRange(2,1,data.length,data[0].length).setValues(data);
  }

  function logBuildEvent_(msg){
    const admin = SpreadsheetApp.openById(FO_SHEET_ID).getSheetByName('ADMIN');
    admin.appendRow([new Date(),'PORTFOLIO BUILDER',msg]);
  }

  return {
    registerAsset:registerAsset
  };
})();