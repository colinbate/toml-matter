import { expect, it, describe } from 'vitest';
import { matter } from '../src/index';

describe('toml-matter (windows carriage returns)', function () {
  it('should extract TOML front matter', function () {
    const actual = matter('+++\r\nabc = "xyz"\r\n+++');
    expect('data' in actual).toBeTruthy();
    expect('content' in actual).toBeTruthy();
    expect('orig' in actual).toBeTruthy();
    expect(actual.data.abc).toEqual('xyz');
  });

  it('should cache orig string in "orig property"', function () {
    const fixture = '+++\r\nabc = "xyz"\r\n+++';
    const actual = matter(fixture);
    expect(actual.orig).toEqual(fixture);
  });

  it('should extract TOML front matter and content', function () {
    const fixture =
      '+++\r\nabc = "xyz"\r\nversion = 2\r\n+++\r\n\r\n<span class="alert alert-info">This is an alert</span>\r\n';
    const actual = matter(fixture);
    expect(actual.data).toEqual({ abc: 'xyz', version: 2 });
    expect(actual.content).toEqual(
      '\r\n<span class="alert alert-info">This is an alert</span>\r\n'
    );
    expect(actual.orig).toEqual(fixture);
  });

  it('should correctly identify delimiters and ignore strings that look like delimiters.', function () {
    const fixture =
      '+++\r\nname = "troublesome +++ value"\r\n+++\r\nhere is some content\r\n';
    const actual = matter(fixture);
    expect(actual.data).toEqual({ name: 'troublesome +++ value' });
    expect(actual.content).toEqual('here is some content\r\n');
    expect(actual.orig).toEqual(fixture);
  });

  it('should correctly parse a string that only has an opening delimiter', function () {
    const fixture = '+++\r\nname = "troublesome +++ value"\r\n';
    const actual = matter(fixture);
    expect(actual.data).toEqual({ name: 'troublesome +++ value' });
    expect(actual.content).toEqual('');
    expect(actual.orig).toEqual(fixture);
  });

  it('should not try to parse a string has content that looks like front-matter.', function () {
    const fixture = '+++++++++name++++++++++++value\r\nfoo';
    const actual = matter(fixture);
    expect(actual.data).toEqual({});
    expect(actual.content).toEqual(fixture);
    expect(actual.orig).toEqual(fixture);
  });
});
