var T = /* @__PURE__ */ ((t) => (t.NORTHERN = "Northern", t.SOUTHERN = "Southern", t))(T || {}), G = /* @__PURE__ */ ((t) => (t.NEW = "🌑", t.WAXING_CRESCENT = "🌒", t.FIRST_QUARTER = "🌓", t.WAXING_GIBBOUS = "🌔", t.FULL = "🌕", t.WANING_GIBBOUS = "🌖", t.LAST_QUARTER = "🌗", t.WANING_CRESCENT = "🌘", t))(G || {}), W = /* @__PURE__ */ ((t) => (t.NEW = "🌑", t.WAXING_CRESCENT = "🌘", t.FIRST_QUARTER = "🌗", t.WAXING_GIBBOUS = "🌖", t.FULL = "🌕", t.WANING_GIBBOUS = "🌔", t.LAST_QUARTER = "🌓", t.WANING_CRESCENT = "🌒", t))(W || {}), _ = /* @__PURE__ */ ((t) => (t.ANOMALISTIC = "Anomalistic", t.DRACONIC = "Draconic", t.SIDEREAL = "Sidereal", t.SYNODIC = "Synodic", t.TROPICAL = "Tropical", t))(_ || {}), A = /* @__PURE__ */ ((t) => (t.NEW = "New", t.WAXING_CRESCENT = "Waxing Crescent", t.FIRST_QUARTER = "First Quarter", t.WAXING_GIBBOUS = "Waxing Gibbous", t.FULL = "Full", t.WANING_GIBBOUS = "Waning Gibbous", t.LAST_QUARTER = "Last Quarter", t.WANING_CRESCENT = "Waning Crescent", t))(A || {});
const E = 24405875e-1, C = 2.4234366115277777e6, U = 27.55454988, I = 29.53058770576;
class n {
  static fromDate(e = new Date()) {
    return e.getTime() / 864e5 - e.getTimezoneOffset() / 1440 + E;
  }
  static toDate(e) {
    const N = new Date();
    return N.setTime((e - E + N.getTimezoneOffset() / 1440) * 864e5), N;
  }
}
const R = {
  hemisphere: T.NORTHERN
}, S = (t) => (t -= Math.floor(t), t < 0 && (t += 1), t);
class c {
  static lunarAge(e = new Date()) {
    return c.lunarAgePercent(e) * I;
  }
  static lunarAgePercent(e = new Date()) {
    return S((n.fromDate(e) - 24515501e-1) / I);
  }
  static lunationNumber(e = new Date()) {
    return Math.round((n.fromDate(e) - C) / I) + 1;
  }
  static lunarDistance(e = new Date()) {
    const N = n.fromDate(e), r = c.lunarAgePercent(e) * 2 * Math.PI, s = 2 * Math.PI * S((N - 24515622e-1) / U);
    return 60.4 - 3.3 * Math.cos(s) - 0.6 * Math.cos(2 * r - s) - 0.5 * Math.cos(2 * r);
  }
  static lunarPhase(e = new Date(), N) {
    N = {
      ...R,
      ...N
    };
    const a = c.lunarAge(e);
    return a < 1.84566173161 ? A.NEW : a < 5.53698519483 ? A.WAXING_CRESCENT : a < 9.22830865805 ? A.FIRST_QUARTER : a < 12.91963212127 ? A.WAXING_GIBBOUS : a < 16.61095558449 ? A.FULL : a < 20.30227904771 ? A.WANING_GIBBOUS : a < 23.99360251093 ? A.LAST_QUARTER : a < 27.68492597415 ? A.WANING_CRESCENT : A.NEW;
  }
  static lunarPhaseEmoji(e = new Date(), N) {
    N = {
      ...R,
      ...N
    };
    const a = c.lunarPhase(e);
    return c.emojiForLunarPhase(a, N);
  }
  static emojiForLunarPhase(e, N) {
    const { hemisphere: a } = {
      ...R,
      ...N
    };
    let r;
    switch (a === T.SOUTHERN ? r = W : r = G, e) {
      case A.WANING_CRESCENT:
        return r.WANING_CRESCENT;
      case A.LAST_QUARTER:
        return r.LAST_QUARTER;
      case A.WANING_GIBBOUS:
        return r.WANING_GIBBOUS;
      case A.FULL:
        return r.FULL;
      case A.WAXING_GIBBOUS:
        return r.WAXING_GIBBOUS;
      case A.FIRST_QUARTER:
        return r.FIRST_QUARTER;
      case A.WAXING_CRESCENT:
        return r.WAXING_CRESCENT;
      default:
      case A.NEW:
        return r.NEW;
    }
  }
  static isWaxing(e = new Date()) {
    return c.lunarAge(e) <= 14.765;
  }
  static isWaning(e = new Date()) {
    return c.lunarAge(e) > 14.765;
  }
}
var l = /* @__PURE__ */ ((t) => (t.EARTH_RADII = "Earth Radii", t.KILOMETERS = "km", t.MILES = "m", t))(l || {});
export {
  T as Hemisphere,
  n as Julian,
  _ as LunarMonth,
  A as LunarPhase,
  c as Moon,
  G as NorthernHemisphereLunarEmoji,
  W as SouthernHemisphereLunarEmoji,
  l as Unit
};
//# sourceMappingURL=index.es.js.map
