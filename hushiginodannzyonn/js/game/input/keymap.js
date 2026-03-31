const MOVE_KEYS = new Map([
  ['ArrowUp', { type: 'move', dx: 0, dy: -1 }],
  ['ArrowDown', { type: 'move', dx: 0, dy: 1 }],
  ['ArrowLeft', { type: 'move', dx: -1, dy: 0 }],
  ['ArrowRight', { type: 'move', dx: 1, dy: 0 }],
  ['w', { type: 'move', dx: 0, dy: -1 }],
  ['a', { type: 'move', dx: -1, dy: 0 }],
  ['s', { type: 'move', dx: 0, dy: 1 }],
  ['d', { type: 'move', dx: 1, dy: 0 }],
  ['k', { type: 'move', dx: 0, dy: -1 }],
  ['h', { type: 'move', dx: -1, dy: 0 }],
  ['j', { type: 'move', dx: 0, dy: 1 }],
  ['l', { type: 'move', dx: 1, dy: 0 }],
  ['q', { type: 'move', dx: -1, dy: -1 }],
  ['e', { type: 'move', dx: 1, dy: -1 }],
  ['z', { type: 'move', dx: -1, dy: 1 }],
  ['c', { type: 'move', dx: 1, dy: 1 }],
  ['y', { type: 'move', dx: -1, dy: -1 }],
  ['u', { type: 'move', dx: 1, dy: -1 }],
  ['b', { type: 'move', dx: -1, dy: 1 }],
  ['n', { type: 'move', dx: 1, dy: 1 }],
]);

const WAIT_KEYS = new Set(['.', 'x', ' ', '5']);
const DESCEND_KEYS = new Set(['>', 'Enter']);
const RESTART_KEYS = new Set(['r', 'R']);

export function commandFromKey(event) {
  if (event.code === 'Numpad5') {
    return { type: 'wait' };
  }

  if (MOVE_KEYS.has(event.key)) {
    return MOVE_KEYS.get(event.key);
  }

  if (WAIT_KEYS.has(event.key)) {
    return { type: 'wait' };
  }

  if (DESCEND_KEYS.has(event.key)) {
    return { type: 'descend' };
  }

  if (RESTART_KEYS.has(event.key)) {
    return { type: 'restart' };
  }

  return null;
}
