// RealEstateModel.gs - property-level underwriting and performance model

function calculateNOI(grossIncome, vacancyRate, operatingExpenses) {
  const effectiveGrossIncome = grossIncome * (1 - vacancyRate);
  const noi = effectiveGrossIncome - operatingExpenses;
  Logger.log('Calculated NOI: ' + noi);
  return noi;
}

function calculateCapRate(noi, propertyValue) {
  const capRate = (noi / propertyValue);
  Logger.log('Cap Rate: ' + capRate);
  return capRate;
}

function projectCashFlows(purchasePrice, noiGrowthRate, holdYears) {
  const flows = [];
  let noi = purchasePrice * 0.08; // assume initial 8% yield
  for (let year = 1; year <= holdYears; year++) {
    noi *= (1 + noiGrowthRate);
    flows.push(noi);
  }
  Logger.log('Projected Cash Flows: ' + flows.join(', '));
  return flows;
}

function runRealEstateStress() {
  Logger.log('Running Real Estate stress scenarios...');
  const noi = calculateNOI(1200000, 0.05, 350000);
  const capRate = calculateCapRate(noi, 15000000);
  const flows = projectCashFlows(15000000, 0.03, 10);
  return {noi, capRate, flows};
}