import pg from "pg";
import Options from "../option";

// Mocking the pg.Client instance
jest.mock("pg", () => {
    const mockClient = jest.fn();
    return { Client: mockClient };
});

describe('Options', () => {
    let options: Options;

    beforeEach(() => {
        const db = new pg.Client();
        options = new Options(db, 'test_table');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch continents', async () => {
        options.queryData = jest.fn(() => Promise.resolve([{ name: 'asia', displayName: 'Asia' }]));
        const result = await options.getContinents();
        expect(result).toEqual([{ name: 'asia', displayName: 'Asia' }]);
    });

    it('should fetch countries by continent', async () => {
        options.queryData = jest.fn(() => Promise.resolve([{ name: 'country1', displayName: 'Country 1' }, { name: 'country2', displayName: 'Country 2' }]));
        const result = await options.getCountriesByContinent('Asia');
        expect(result).toEqual([{ name: 'country1', displayName: 'Country 1' }, { name: 'country2', displayName: 'Country 2' }]);
    });
});