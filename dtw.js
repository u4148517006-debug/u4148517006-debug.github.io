// 各指のDTWの重み付け (人差し指、中指、薬指、小指)
const weights = [1.0, 1.0, 1.0, 0.7];

// 事前に登録しておくジェスチャーテンプレート (例: "U" の動きなど)
export let gestureTemplates = {};

/**
 * 1フレーム内での4本指の距離を計算
 */
function frameDistance(frameA, frameB) {
  let sum = 0;
  for (let i = 0; i < 4; i++) {
    let dist = Math.hypot(frameB[i].x - frameA[i].x, frameB[i].y - frameA[i].y);
    sum += dist * weights[i];
  }
  return sum;
}

/**
 * マルチタッチDTW（動的時間伸縮法）のコア計算
 */
export function multiDTW(seqA, seqB) {
  const n = seqA.length;
  const m = seqB.length;
  if (n === 0 || m === 0) return Infinity;

  // DPテーブルの初期化 (Infinityで埋める)
  let dp = Array.from({ length: n }, () => Array(m).fill(Infinity));
  dp[0][0] = frameDistance(seqA[0], seqB[0]);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let cost = frameDistance(seqA[i], seqB[j]);

      if (i > 0) dp[i][j] = Math.min(dp[i][j], dp[i - 1][j] + cost);
      if (j > 0) dp[i][j] = Math.min(dp[i][j], dp[i][j - 1] + cost);
      if (i > 0 && j > 0) dp[i][j] = Math.min(dp[i][j], dp[i - 1][j - 1] + cost);
    }
  }
  return dp[n - 1][m - 1];
}

/**
 * 軌跡データを綺麗に「正規化」する (movie.dartの移植)
 * 最初のフレームの人差し指を(0,0)にリセットし、最大サイズを1.0にスケールする
 */
export function normalizeSequence(sequence) {
  if (sequence.length === 0) return [];

  // 最初のフレームの人差し指(インデックス0)を原点にする
  const base = sequence[0][0];

  // 1. 平行移動
  let shifted = sequence.map(frame => {
    return frame.map(p => ({ x: p.x - base.x, y: p.y - base.y }));
  });

  // 2. 最大距離（スケール）の計算
  let maxDist = 0;
  shifted.forEach(frame => {
    frame.forEach(p => {
      let dist = Math.hypot(p.x, p.y);
      if (dist > maxDist) maxDist = dist;
    });
  });

  if (maxDist === 0) return shifted;

  // 3. 正規化を実行
  return shifted.map(frame => {
    return frame.map(p => ({ x: p.x / maxDist, y: p.y / maxDist }));
  });
}

/**
 * 新しいジェスチャーテンプレートを追加する
 */
export function addTemplate(label, rawSequence) {
  if (rawSequence.length === 0) return;
  const normalized = normalizeSequence(rawSequence);
  gestureTemplates[label] = normalized;
  
  // デバッグ用にコンソールにJSONを出力 (これを保存しておけば後でプリセット化できます)
  console.log(`--- TEMPLATE ADDED (${label}) ---`);
  console.log(JSON.stringify(normalized));
}

/**
 * 現在の入力した動き(rawSequence)が、登録済みテンプレートのどれに一番近いか推測する
 */
export function predictGesture(rawSequence) {
  if (Object.keys(gestureTemplates).length === 0) return "テンプレートなし";
  
  const normalizedInput = normalizeSequence(rawSequence);
  let bestLabel = "判定不能";
  let minScore = Infinity;

  for (let label in gestureTemplates) {
    let score = multiDTW(normalizedInput, gestureTemplates[label]);
    if (score < minScore) {
      minScore = score;
      bestLabel = label;
    }
  }
  
  return { label: bestLabel, score: minScore };
}
