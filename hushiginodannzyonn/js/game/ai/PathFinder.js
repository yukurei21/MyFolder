const CARDINAL_DIRECTIONS = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

function keyOf(x, y) {
  return `${x},${y}`;
}

export class Pathfinder {
  nextStep({ map, entities, start, goal, blockedId = null }) {
    const queue = [start];
    const cameFrom = new Map();
    cameFrom.set(keyOf(start.x, start.y), null);

    while (queue.length > 0) {
      const current = queue.shift();
      if (current.x === goal.x && current.y === goal.y) {
        break;
      }

      for (const dir of CARDINAL_DIRECTIONS) {
        const next = { x: current.x + dir.x, y: current.y + dir.y };
        const key = keyOf(next.x, next.y);
        if (cameFrom.has(key)) {
          continue;
        }
        if (!map.isWalkable(next.x, next.y)) {
          continue;
        }

        const blocker = entities.at(next.x, next.y, { onlyBlocking: true });
        const isGoal = next.x === goal.x && next.y === goal.y;
        if (blocker && blocker.id !== blockedId && !isGoal) {
          continue;
        }

        queue.push(next);
        cameFrom.set(key, current);
      }
    }

    const goalKey = keyOf(goal.x, goal.y);
    if (!cameFrom.has(goalKey)) {
      return null;
    }

    let current = goal;
    let previous = cameFrom.get(goalKey);
    while (previous && !(previous.x === start.x && previous.y === start.y)) {
      current = previous;
      previous = cameFrom.get(keyOf(previous.x, previous.y));
    }

    return current;
  }
}
