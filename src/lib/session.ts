export type PlatformId = "xparibet";

const KEY_ID = "appgaps:userid";

export const BRAND = "ثغرات التطبيقات";

export const PLATFORM = {
  id: "xparibet" as PlatformId,
  name: "Xparibet",
  tagline: "المنصة الرسمية المعتمدة",
  short: "XP",
  promo: "FM333",
  deposit: "220 جنيه أو 5 دولار",
  download: "https://xp-aff.com/L?tag=d_4697360m_71587c_apk1&site=4697360&ad=71587",
  register:
    "https://xp-aff.com/L?tag=d_4697360m_64821c_site&site=4697360&ad=64821&r=registration",
  telegram: "https://t.me/vbdhdvdv",
};

export const PLATFORMS: Record<PlatformId, typeof PLATFORM> = { xparibet: PLATFORM };

export function getPlatform(): PlatformId {
  return "xparibet";
}

export function savePlatform(_id: PlatformId) {
  /* single platform */
}

export function saveUserId(id: string) {
  if (typeof window !== "undefined") sessionStorage.setItem(KEY_ID, id);
}

export function getUserId(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(KEY_ID) ?? "";
}
