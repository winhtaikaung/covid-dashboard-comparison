import pg from "pg";
import CountryDataDomain from "../countrydata";

// Mocking the pg.Client instance
jest.mock("pg", () => {
    const mockClient = jest.fn();
    return { Client: mockClient };
});

describe('CountryDataDomain', () => {
    let countryDataDomain: CountryDataDomain;

    beforeEach(() => {
        const db = new pg.Client();
        countryDataDomain = new CountryDataDomain(db, 'test_table');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch new reported cases by country', async () => {
        countryDataDomain.queryData = jest.fn(() => Promise.resolve([{ date: '2024-11-25', new_cases: 100 }]));
        const result = await countryDataDomain.getNewReportedCaseByCountry('CountryName');
        expect(result).toEqual([{ date: '2024-11-25', new_cases: 100 }]);
    });

    it('should fetch test positivity rate by country', async () => {
        countryDataDomain.queryData = jest.fn(() => Promise.resolve([{ date: '2024-11-25', positive_rate: 5.5 }]));
        const result = await countryDataDomain.getTestPositivityRateByCountry('CountryName');
        expect(result).toEqual([{ date: '2024-11-25', positive_rate: 5.5 }]);
    });

    it('should fetch new deaths by country', async () => {
        countryDataDomain.queryData = jest.fn(() => Promise.resolve([{ date: '2024-11-25', new_deaths: 10 }]));
        const result = await countryDataDomain.getNewDeathsByCountry('CountryName');
        expect(result).toEqual([{ date: '2024-11-25', new_deaths: 10 }]);
    });

    it('should fetch ICU patient vs hospitalization by country', async () => {
        countryDataDomain.queryData = jest.fn(() => Promise.resolve([{ country: 'CountryName', date: '2024-11-25', total_hosp_patients: 50, total_icu_patients: 10 }]));
        const result = await countryDataDomain.getICUPatientVsHospByCountry('CountryName');
        expect(result).toEqual([{ country: 'CountryName', date: '2024-11-25', total_hosp_patients: 50, total_icu_patients: 10 }]);
    });

    it('should fetch total vaccination percentage by country', async () => {
        countryDataDomain.queryData = jest.fn(() => Promise.resolve([{ country: 'CountryName', percent_fully_vaccinated: 50, percent_booster_added: 20, population: 1000000 }]));
        const result = await countryDataDomain.getTotalVaccicationPercentageByCountry('CountryName');
        expect(result).toEqual([{ country: 'CountryName', percent_fully_vaccinated: 50, percent_booster_added: 20, population: 1000000 }]);
    });
});