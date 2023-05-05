import { expect, it, describe } from 'vitest';
import { matter } from '../src/index';

describe('toml-matter', () => {
  it('should extract TOML front matter', function () {
    const actual = matter('+++\nabc = "xyz"\n+++');
    expect('data' in actual).toBeTruthy();
    expect('content' in actual).toBeTruthy();
    expect('orig' in actual).toBeTruthy();
    expect(actual.data.abc).toEqual('xyz');
  });

  it('being passed YAML not TOML throws an error', function () {
    expect(function () {
      matter('+++\nabc: xyz\n+++');
    }).throws();
  });

  it('should throw an error when a string is not passed:', function () {
    expect(function () {
      (matter as unknown as () => unknown)();
    }).throws();
  });

  it('should return an object when the string is 0 length:', function () {
    const actual = matter('');
    expect('data' in actual).toBeTruthy();
    expect('content' in actual).toBeTruthy();
    expect('orig' in actual).toBeTruthy();
  });

  it('should extract TOML front matter and content', function () {
    const fixture =
      '+++\nabc = "xyz"\nversion = 2\n+++\n\n<span class="alert alert-info">This is an alert</span>\n';
    const actual = matter(fixture);
    expect(actual.data).toEqual({ abc: 'xyz', version: 2 });
    expect(actual.content).toEqual(
      '\n<span class="alert alert-info">This is an alert</span>\n'
    );
    expect(actual.orig).toEqual(fixture);
  });

  it('should correctly identify delimiters and ignore strings that look like delimiters.', function () {
    const fixture =
      '+++\nname = "troublesome +++ value"\n+++\nhere is some content\n';
    const actual = matter(fixture);
    expect(actual.data).toEqual({ name: 'troublesome +++ value' });
    expect(actual.content).toEqual('here is some content\n');
    expect(actual.orig).toEqual(fixture);
  });

  it('should correctly parse a string that only has an opening delimiter', function () {
    const fixture = '+++\nname = "troublesome +++ value"\n';
    const actual = matter(fixture);
    expect(actual.data).toEqual({ name: 'troublesome +++ value' });
    expect(actual.content).toEqual('');
    expect(actual.orig).toEqual(fixture);
  });

  it('should not try to parse a string has content that looks like front-matter.', function () {
    const fixture = '+++++++++name++++++++++++value\nfoo';
    const actual = matter(fixture);
    expect(actual.data).toEqual({});
    expect(actual.content).toEqual(fixture);
    expect(actual.orig).toEqual(fixture);
  });
});
