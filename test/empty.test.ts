import { expect, it, describe } from 'vitest';

import { matter } from '../src/index';

describe('toml-matter', function () {
  it('should work with empty front-matter', function () {
    const file1 = matter('+++\n+++\nThis is content');
    expect(file1.content).toEqual('This is content');
    expect(file1.data).toEqual({});
    expect(file1.isEmpty).toBe(true);

    const file2 = matter('+++\n\n+++\nThis is content');
    expect(file2.content).toEqual('This is content');
    expect(file2.data).toEqual({});
    expect(file2.isEmpty).toBe(true);

    const file3 = matter('+++\n\n\n\n\n\n+++\nThis is content');
    expect(file3.content).toEqual('This is content');
    expect(file3.data).toEqual({});
    expect(file3.isEmpty).toBe(true);
  });
});
