import { parse as toml } from 'toml';

const DELIM = '+++';

function stripBom(str: string) {
  if (typeof str === 'string' && str.charAt(0) === '\ufeff') {
    return str.slice(1);
  }
  return str;
}

interface MatterFile {
  content: string;
  data: Record<string, unknown>;
  isEmpty: boolean;
  excerpt: string;
  orig: string;
  matter?: string;
}

function toFile(input: string): MatterFile {
  const file = {
    content: stripBom(input),
    data: {},
    isEmpty: false,
    excerpt: '',
    orig: input,
  };

  return file;
}

function parse(file: MatterFile) {
  if (
    !file.content.startsWith(DELIM) ||
    file.content.charAt(DELIM.length) === DELIM.slice(-1)
  )
    return file;
  file.content = file.content.slice(DELIM.length);
  const len = file.content.length;
  let closeIndex = file.content.indexOf(`\n${DELIM}`); // Closing needs to be a new line
  if (closeIndex === -1) {
    closeIndex = len;
  }
  file.matter = file.content.slice(0, closeIndex + 1);
  const block = file.matter.replace(/^\s*#[^\n]+/gm, '').trim();
  if (block === '') {
    file.isEmpty = true;
  } else {
    file.data = toml(file.matter);
  }
  if (closeIndex === len) {
    file.content = '';
  } else {
    file.content = file.content.slice(closeIndex + 1 + DELIM.length);
    if (file.content[0] === '\r') {
      file.content = file.content.slice(1);
    }
    if (file.content[0] === '\n') {
      file.content = file.content.slice(1);
    }
  }
  return file;
}

export function matter(input: string) {
  if (typeof input !== 'string') {
    throw new Error('`input` must be a string');
  }
  const file = toFile(input);
  if (input === '') return file;
  return parse(file);
}
