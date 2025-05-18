import 'reflect-metadata';

import { validate } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { plainToInstance } from 'class-transformer';

describe('PaginationDto', () => {
  it('should validate with default values', async () => {
    const dto = new PaginationDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with valid data', async () => {
    const dto = new PaginationDto();
    dto.limit = 1;
    dto.page = 1;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with invalid data page', async () => {
    const dto = new PaginationDto();
    dto.page = -1;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThanOrEqual(1);

    errors.forEach((error) => {
      if (error.property === 'page') {
        expect(error.constraints?.min).toBeDefined();
      } else {
        expect(true).toBeFalsy();
      }
    });
  });

  it('should validate with invalid limit page', async () => {
    const dto = new PaginationDto();
    dto.limit = -1;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThanOrEqual(1);

    errors.forEach((error) => {
      if (error.property === 'limit') {
        expect(error.constraints?.min).toBeDefined();
      } else {
        expect(true).toBeFalsy();
      }
    });
  });

  it('should convert strings to numbers for page and limit', async () => {
    const body = { limit: '10', page: '2' };
    const dto = plainToInstance(PaginationDto, body);

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.limit).toBe(10);
    expect(dto.page).toBe(2);
  });
});
