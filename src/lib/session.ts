export type PlatformId = "fansport" | "greenbet";

const KEY_PLATFORM = "dragonvip:platform";
const KEY_ID = "dragonvip:userid";

export const PLATFORMS: Record<
  PlatformId,
  { name: string; tagline: string; accent: string; short: string; promo: string; link: string }
> = {
  fansport: {
    name: "FANSPORT",
    tagline: "المنصة العالمية الأولى",
    accent: "oklch(0.55 0.2 250)",
    short: "FS",
    promo: "X200",
    link: "https://lxzsdfgw.xyz/L?tag=d_5957194m_126154c_&site=5957194&ad=126154",
  },
  greenbet: {
    name: "GREENBET",
    tagline: "أرباح سريعة وسحب فوري",
    accent: "oklch(0.7 0.2 150)",
    short: "GB",
    promo: "RG200",
    link: "https://refpa79184.com/L?tag=d_5931379m_132250c_&site=5931379&ad=132250",
  },
};

export function savePlatform(id: PlatformId) {
  if (typeof window !== "undefined") sessionStorage.setItem(KEY_PLATFORM, id);
}

export function getPlatform(): PlatformId {
  if (typeof window === "undefined") return "fansport";
  const v = sessionStorage.getItem(KEY_PLATFORM);
  return v === "greenbet" ? "greenbet" : "fansport";
}

export function saveUserId(id: string) {
  if (typeof window !== "undefined") sessionStorage.setItem(KEY_ID, id);
}

export function getUserId(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(KEY_ID) ?? "";
}
