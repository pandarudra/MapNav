import { Latlng } from "../types/type";

const graph: Record<string, { node: Latlng; weight: number }[]> = {
  "20.5937,78.9629": [{ node: { lat: 21, lng: 79 }, weight: 10 }],
  "21,79": [{ node: { lat: 22, lng: 80 }, weight: 15 }],
  "22,80": [{ node: { lat: 23, lng: 81 }, weight: 20 }],
};

const key = (point: Latlng) => `${point.lat},${point.lng}`;

export const findShortestPath = (start: Latlng, end: Latlng) => {
  const pq: { node: Latlng; cost: number }[] = [{ node: start, cost: 0 }];
  const visited = new Set();
  const dist: Record<string, number> = { [key(start)]: 0 };
  const prev: Record<string, Latlng | null> = { [key(start)]: null };

  while (pq.length > 0) {
    pq.sort((a, b) => a.cost - b.cost);
    const { node: current } = pq.shift()!;
    if (key(current) === key(end)) break;
    if (visited.has(key(current))) continue;
    visited.add(key(current));

    for (const ngbr of graph[key(current)] || []) {
      const newCost = dist[key(current)] + ngbr.weight;
      if (newCost < (dist[key(ngbr.node)] ?? Infinity)) {
        dist[key(ngbr.node)] = newCost;
        prev[key(ngbr.node)] = current;
        pq.push({ node: ngbr.node, cost: newCost });
      }
    }
  }
  const path: Latlng[] = [];
  let step: Latlng | null = end;
  while (step) {
    path.unshift(step);
    step = prev[key(step)] ?? null;
  }
  return path;
};
