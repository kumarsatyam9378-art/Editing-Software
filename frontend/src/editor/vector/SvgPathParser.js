const COMMANDS = new Set(['M', 'L', 'H', 'V', 'C', 'Q', 'S', 'T', 'A', 'Z']);

export function tokenizePath(path = '') {
  return path
    .replace(/,/g, ' ')
    .split(/\s+/)
    .flatMap((chunk) => chunk.match(/[a-zA-Z]|-?\d*\.?\d+/g) || [])
    .filter(Boolean);
}

export function parsePath(path = '') {
  const tokens = tokenizePath(path);
  const nodes = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (COMMANDS.has(token.toUpperCase())) {
      const command = token;
      i += 1;
      const args = [];
      while (i < tokens.length && !COMMANDS.has(tokens[i].toUpperCase())) {
        args.push(Number(tokens[i]));
        i += 1;
      }
      nodes.push({ command, args });
    } else {
      i += 1;
    }
  }
  return nodes;
}
