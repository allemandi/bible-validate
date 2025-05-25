import { normalizeBook } from '../src/utils/normalizer';

describe('normalizeBook()', () => {
  it('converts uppercase to lowercase', () => {
    expect(normalizeBook('GENESIS')).toBe('genesis');
  });

  it('trims leading and trailing spaces', () => {
    expect(normalizeBook('  Genesis ')).toBe('genesis');
  });

  it('handles mixed case and extra spaces', () => {
    expect(normalizeBook('  gEnEsIs  ')).toBe('genesis');
  });

  it('returns empty string if input is only spaces', () => {
    expect(normalizeBook('   ')).toBe('');
  });

  it('returns null if input is null', () => {
    expect(normalizeBook(null)).toBeNull();
  });

  it('returns null if input is undefined', () => {
    expect(normalizeBook(undefined)).toBeNull();
  });

  it('works with already clean input', () => {
    expect(normalizeBook('genesis')).toBe('genesis');
  });
});
