const BASE = "https://tesla-bet-default-rtdb.firebaseio.com";

export const VIP_ID = "1729018123";

export function isVip(id: string) {
  return id.trim() === VIP_ID;
}

/** رقم الفاسد في كل صف: 4 صفوف ×1، 3 صفوف ×2، صفّان ×3، صف ×4 */
export const ROTTEN_PER_ROW = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];

export type Matrix = boolean[][]; // true = فاسدة

/** يبني مصفوفة عشوائية بنفس توزيع الفاسد المطلوب (m1 = أسفل يسار) */
export function buildMatrix(): Matrix {
  return ROTTEN_PER_ROW.map((n) => {
    const row = Array.from({ length: 5 }, () => false);
    let placed = 0;
    while (placed < n) {
      const i = Math.floor(Math.random() * 5);
      if (!row[i]) {
        row[i] = true;
        placed++;
      }
    }
    return row;
  });
}

/** يقرأ توقعات التفاحة من فايربيس ويحوّلها لمصفوفة */
export async function fetchAppleMatrix(): Promise<Matrix | null> {
  try {
    const res = await fetch(`${BASE}/m11.json`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown> | null;
    // العقدة ناقصة/فاضية على السيرفر → نكتب توقعات جديدة ونرجّعها (المصدر يبقى فايربيس)
    if (!data || Object.keys(data).length < 50) return await resetAppleMatrix();

    const matrix: Matrix = [];
    for (let r = 0; r < 10; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < 5; c++) {
        const key = `m${r * 5 + c + 1}`;
        const cell = data[key];
        // ندعم الشكلين: { m1: "1" } و { m1: { m1: "1" } }
        const value =
          cell != null && typeof cell === "object"
            ? (cell as Record<string, unknown>)[key]
            : cell;
        row.push(String(value ?? "0") === "1");
      }
      matrix.push(row);
    }
    return matrix;
  } catch {
    return null;
  }
}

/** يكتب توقعات جديدة عشوائية في فايربيس بنفس التنسيق */
export async function resetAppleMatrix(): Promise<Matrix> {
  const matrix = buildMatrix();
  const payload: Record<string, Record<string, string>> = {};
  matrix.forEach((row, r) => {
    row.forEach((rotten, c) => {
      const key = `m${r * 5 + c + 1}`;
      payload[key] = { [key]: rotten ? "1" : "0" };
    });
  });
  try {
    await fetch(`${BASE}/m11.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    /* تجاهل أخطاء الشبكة */
  }
  return matrix;
}

/** يقرأ أودد الطيارة من فايربيس */
export async function fetchCrashOdd(): Promise<number | null> {
  try {
    const res = await fetch(`${BASE}/pre/hipr/hipr.json`, { cache: "no-store" });
    if (!res.ok) return null;
    const raw = await res.json();
    const n = Number(raw);
    return Number.isFinite(n) && n > 1 ? n : null;
  } catch {
    return null;
  }
}
