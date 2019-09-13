export const subPoints = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });

export const midPoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

export const absPoint = p => ({ x: Math.abs(p.x), y: Math.abs(p.y) });

export const clamp = (min, max, num) => Math.max(min, Math.min(max, num));
