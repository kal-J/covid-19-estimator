/** const input_data = {
    region: {
        name: "africa",
        avgAge: 19.7,
        avgDailyIncomeInUSD: 5,
        avgDailyIncomePopulation: 0.71,
    },
    periodType: "days",
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
} */

const normaliseDurationInputToDays = (timeToElapse, type) => {
  const input = timeToElapse;
  switch (type) {
    case 'days':
      return input;
    case 'weeks':
      return input * 7;
    case 'months':
      return input * 30; // we are assuming 1month = 30days
    default:
      return 0;
  }
};

const calculateImpact = (
  reportedCases,
  reportedCasesMultiplyer,
  days,
  totalHospitalBeds,
  avgDailyIncomePopulation,
  avgDailyIncomeInUSD
) => {
  const currentlyInfected = reportedCases * reportedCasesMultiplyer;
  const infectionsByRequestedTime = currentlyInfected * (2 ** Math.ceil(days / 3));
  const severeCasesByRequestedTime = (15 / 100) * infectionsByRequestedTime;
  const hospitalBedsByRequestedTime = (35 / 100) * (totalHospitalBeds - severeCasesByRequestedTime);
  const casesForICUByRequestedTime = (5 / 100) * infectionsByRequestedTime;
  const casesForVentilatorsByRequestedTime = (2 / 100) * infectionsByRequestedTime;
  const dollarsInFlight = infectionsByRequestedTime
    * avgDailyIncomePopulation
    * avgDailyIncomeInUSD
    * days;

  const result = {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
  return result;
};

const covid19ImpactEstimator = (data) => {
  const {
    reportedCases, periodType, timeToElapse, totalHospitalBeds
  } = data;
  const { avgDailyIncomePopulation, avgDailyIncomeInUSD } = data.region;

  // normalise duration input to days
  const days = normaliseDurationInputToDays(timeToElapse, periodType);

  // calculate estimate
  const impact = calculateImpact(
    reportedCases,
    10,
    days,
    totalHospitalBeds,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD
  );
  const severeImpact = calculateImpact(
    reportedCases,
    50,
    days,
    totalHospitalBeds,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD
  );

  const estimate = {
    data,
    impact,
    severeImpact
  };

  return estimate;
};

export default covid19ImpactEstimator;
