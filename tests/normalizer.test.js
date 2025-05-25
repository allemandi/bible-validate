import { normalizeBookName } from '../src/utils/normalizer';

describe('normalizeBookName()', () => {
  it('converts uppercase to lowercase', () => {
    expect(normalizeBookName('GENESIS')).toBe('genesis');
  });

  it('trims leading and trailing spaces', () => {
    expect(normalizeBookName('  Genesis ')).toBe('genesis');
  });

  it('handles mixed case and extra spaces', () => {
    expect(normalizeBookName('  gEnEsIs  ')).toBe('genesis');
  });

  it('returns empty string if input is only spaces', () => {
    expect(normalizeBookName('   ')).toBe('');
  });

  it('returns null if input is null', () => {
    expect(normalizeBookName(null)).toBeNull();
  });

  it('returns null if input is undefined', () => {
    expect(normalizeBookName(undefined)).toBeNull();
  });

  it('works with already clean input', () => {
    expect(normalizeBookName('genesis')).toBe('genesis');
  });
});
