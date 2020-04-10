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
  switch (type) {
    case 'days':
      return timeToElapse;
    case 'weeks':
      return timeToElapse * 7;
    case 'months':
      return timeToElapse * 30; // we are assuming 1month = 30days
    default:
      return timeToElapse;
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
  const infectionsByRequestedTime = currentlyInfected * (2 ** Math.floor(days / 3));
  const severeCasesByRequestedTime = Math.trunc(
    (15 / 100) * infectionsByRequestedTime
  );
  const availableBeds = Math.trunc((35 / 100) * totalHospitalBeds);
  const hospitalBedsByRequestedTime = availableBeds - severeCasesByRequestedTime;
  const casesForICUByRequestedTime = Math.trunc(
    (5 / 100) * infectionsByRequestedTime
  );
  const casesForVentilatorsByRequestedTime = Math.trunc(
    (2 / 100) * infectionsByRequestedTime
  );
  const dollarsInFlight = Math.trunc(infectionsByRequestedTime
    * avgDailyIncomePopulation
    * avgDailyIncomeInUSD
    * days);

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
