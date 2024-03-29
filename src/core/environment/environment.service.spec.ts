import { TestBed } from '@automock/jest';
import { ConfigService } from '@nestjs/config';
import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
  let underTest: EnvironmentService;
  let configService: ConfigService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(EnvironmentService).compile();

    underTest = unit;
    configService = unitRef.get(ConfigService);
  });

  describe('getEnvironmentValue', () => {
    it('should return the value of the environment variable', () => {
      const key = 'NODE_ENV';
      const value = 'development';

      jest.spyOn(configService, 'getOrThrow').mockReturnValueOnce(value);

      expect(underTest.getEnvironmentValue(key)).toEqual(value);
    });

    it('should throw an error if the environment variable is not defined', () => {
      jest.spyOn(configService, 'getOrThrow').mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => underTest.getEnvironmentValue('NODE_ENV')).toThrow();
    });
  });

  describe('isProd', () => {
    it('should return true if the environment variable is "production"', () => {
      const value = 'production';

      jest.spyOn(configService, 'getOrThrow').mockReturnValueOnce(value);

      expect(underTest.isProd()).toBe(true);
    });

    it('should return false if the environment variable is not "production"', () => {
      const value = 'development';

      jest.spyOn(configService, 'getOrThrow').mockReturnValueOnce(value);

      expect(underTest.isProd()).toBe(false);
    });
  });

  describe('isSwaggerEnabled', () => {
    it('should return true if the environment variable is "true"', () => {
      const expected = true;

      jest.spyOn(configService, 'getOrThrow').mockReturnValueOnce(expected);

      expect(underTest.isSwaggerEnabled()).toEqual(expected);
    });

    it('should return false if the environment variable is not "true"', () => {
      jest.spyOn(configService, 'getOrThrow').mockReturnValueOnce(false);

      expect(underTest.isSwaggerEnabled()).toBe(false);
    });
  });
});
