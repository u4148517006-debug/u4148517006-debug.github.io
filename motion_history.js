const pointsLength = 4;
export let motionHistory = [];

export function updateMotionHistory(currentRotated) {
  motionHistory.push(currentRotated);
  if (motionHistory.length > 30) {
    motionHistory.shift();
  }
}

export function isMoving() {
  if (motionHistory.length < pointsLength) return [false, false, false, false];
  let answer = [];
  let recent = motionHistory.slice(-pointsLength);

  for (let finger = 0; finger < 4; finger++) {
    let pts = recent.map(f => f[finger]);
    let lineLength = Math.hypot(pts[pts.length - 1].x - pts[0].x, pts[pts.length - 1].y - pts[0].y);
    let speed = lineLength / pointsLength;

    let start = pts[0];
    let end = pts[pts.length - 1];
    let baseLen = Math.hypot(end.x - start.x, end.y - start.y);
    let sumDist = 0;

    if (baseLen > 0) {
      pts.forEach(p => {
        let proj = ((p.x - start.x) * (end.x - start.x) + (p.y - start.y) * (end.y - start.y)) / baseLen;
        let closest = { 
          x: start.x + (end.x - start.x) * (proj / baseLen), 
          y: start.y + (end.y - start.y) * (proj / baseLen) 
        };
        let dist = Math.hypot(closest.x - p.x, closest.y - p.y);
        sumDist += dist;
      });
    }
    let straightness = sumDist / pts.length;
    // 速度が4以上、かつ横ブレが3未満
    answer.push(speed > 4 && straightness < 3);
  }
  return answer;
}
