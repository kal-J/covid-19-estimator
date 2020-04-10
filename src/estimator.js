/* const input_data = {
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
}  */

const normaliseDurationInputToDays = (timeToElapse,type) => {
    let input = parseInt(timeToElapse);
    switch(type) {
        case "days":
            return input;
            break;
        case "weeks":
            return (input * 7);
            break;
        case "months":
            return (input * 30); //we are assuming 1month = 30days
            break;
        default:
            return 0;
    }
}

const calculateImpact = (reportedCases,reportedCasesMultiplyer,days,totalHospitalBeds,avgDailyIncomePopulation,avgDailyIncomeInUSD) => {
    let currentlyInfected = reportedCases * reportedCasesMultiplyer;
    let infectionsByRequestedTime = currentlyInfected * (Math.pow(2,Math.floor(days/3)));
    let severeCasesByRequestedTime = (15/100) * infectionsByRequestedTime;
    let hospitalBedsByRequestedTime = ((35/100) * totalHospitalBeds) - severeCasesByRequestedTime;
    let casesForICUByRequestedTime = (5/100) * infectionsByRequestedTime;
    let casesForVentilatorsByRequestedTime = (2/100) * infectionsByRequestedTime;
    let dollarsInFlight = (infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD * days);

    let result = {
        currentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight,
    }
    return result;
}


const covid19ImpactEstimator = (data) => {
    const { reportedCases, periodType, timeToElapse, totalHospitalBeds } = data;
    const { avgDailyIncomePopulation, avgDailyIncomeInUSD } = data.region;
    
    //normalise duration input to days
    const days = normaliseDurationInputToDays(timeToElapse, periodType);

    //calculate estimate
    let impact = calculateImpact(reportedCases, 10, days, totalHospitalBeds, avgDailyIncomePopulation, avgDailyIncomeInUSD);
    let severeImpact = calculateImpact(reportedCases, 50, days, totalHospitalBeds, avgDailyIncomePopulation, avgDailyIncomeInUSD);
    
    let estimate = {
        data,
        impact,
        severeImpact
    }

    return estimate;
};

export default covid19ImpactEstimator;
