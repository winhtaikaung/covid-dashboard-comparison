import { Log, COLOR } from '../log';

describe('Log', () => {
    let originalEnv: string;

    beforeAll(() => {
        originalEnv = process.env.NODE_ENV || 'development';
    });

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
    });

    it('should log info message in non-production environment', () => {
        process.env.NODE_ENV = 'development';
        const logSpy = jest.spyOn(process.stdout, 'write');

        Log.info('Info message');

        expect(logSpy).toHaveBeenCalledWith(`${COLOR.fgCyan}Info message${COLOR.reset}\n`);
    });

    it('should log success message in non-production environment', () => {
        process.env.NODE_ENV = 'development';
        const logSpy = jest.spyOn(process.stdout, 'write');

        Log.success('Success message');

        expect(logSpy).toHaveBeenCalledWith(`${COLOR.fgGreen}Success message${COLOR.reset}\n`);
    });

    it('should log warn message in non-production environment', () => {
        process.env.NODE_ENV = 'development';
        const logSpy = jest.spyOn(process.stdout, 'write');

        Log.warn('Warning message');

        expect(logSpy).toHaveBeenCalledWith(`${COLOR.fgYellow}Warning message${COLOR.reset}\n`);
    });

    it('should log error message in non-production environment', () => {
        process.env.NODE_ENV = 'development';
        const logSpy = jest.spyOn(process.stdout, 'write');

        Log.error('Error message');

        expect(logSpy).toHaveBeenCalledWith(`${COLOR.fgRed}Error message${COLOR.reset}\n`);
    });


});