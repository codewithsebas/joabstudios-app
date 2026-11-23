/**
 * JoabStudios logo, rebuilt geometrically from the brand artwork (STUDIOS over
 * JOAB) so every stroke is uniform and every curve is a true arc.
 *
 * Construction (logo units, cap line y=24.3, baseline y=140.8):
 *  - JOAB: one stroke weight W, straight lines + circular arcs.
 *  - A: straight legs cut flat at cap line/baseline; the crossbar is an arc
 *    that peels off tangent to the left leg; the right leg runs into the B's
 *    lower bowl through a fillet arc tangent to both.
 *  - STUDIOS: same geometric construction with a fine stroke.
 * All measurements come from the supplied artwork; tangency points are solved,
 * not eyeballed. Keep `brandLogoSvg` (used by the OG image) in sync.
 */

export const BRAND_W = 14
export const STUDIOS_W = 1.8
const CAP = 24.3
const BASE = 140.8

export const brandViewBox = { x: 0, y: 0, width: 397, height: 142 }

// --- JOAB -------------------------------------------------------------------
const J = 'M25 31.3H72.95V94.3A40 40 0 0 1 4.67 122.58'
const O = { cx: 142.35, cy: 69.6, r: 39.3 }
const O_BAR = 'M111.3 133.8H173.4'
const A_LEFT = 'M185.71 150L248.43 15'
const A_SWOOSH = 'M191.92 136.64L193.18 133.92A91.32 91.32 0 0 1 276 81.08'
/** Right leg of the A, fillet into the B's lower bowl, bowl up to the stem. */
const A_RIGHT_B = 'M239.48 15L287.67 96.68A77.3 77.3 0 0 0 354.25 134.7A32 32 0 1 0 322.25 102.7'
/** Sized so its bottom lands exactly on the top of the lower bowl (no visible join). */
const B_UPPER = 'M322.25 31.3H359.9A19.7 19.7 0 0 1 379.6 51A19.7 19.7 0 0 1 359.9 70.7H354.25'
/** Region the A/B stroke may paint: below the cap line, minus the wedge under the B's foot cut. */
const BOWL_CLIP = `M150 ${CAP}H410V170H150ZM314 96.09L329.25 112.66H314Z`
/** B stem with its 45° foot, as a filled shape. */
const B_STEM = 'M315.25 24.3H329.25V112.66L315.25 97.45Z'

// --- STUDIOS ----------------------------------------------------------------
const s = (x: number) =>
  `M${x + 8.32} 2.06A4.05 2.725 0 1 0 ${x + 5} 6.35A4.05 2.725 0 1 1 ${x + 1.68} 10.64`
const STUDIOS = [
  s(25.4),
  'M38.4 0.9H49M43.7 0.9V12.7', // T
  'M54 0V6.85A4.95 4.95 0 0 0 63.9 6.85V0', // U
  'M70.5 0V12.7M69.6 0.9H75.05A5.45 5.45 0 0 1 75.05 11.8H69.6', // D
  'M88.15 0V12.7', // I
  'M95.3 6.35A5.8 5.45 0 1 0 106.9 6.35A5.8 5.45 0 1 0 95.3 6.35', // O
  s(112.2),
].join('')


/** React elements for the logo; colour comes from `currentColor`. */
export function BrandLogoShapes({ idPrefix }: { idPrefix: string }) {
  const CLIP_ID = `${idPrefix}-cap`
  const CLIP_TOP_ID = `${idPrefix}-top`
  return (
    <>
      <defs>
        {/* Cap line + baseline: flat cuts for the A's legs. */}
        <clipPath id={CLIP_ID}>
          <rect x="150" y={CAP} width="260" height={BASE - CAP} />
        </clipPath>
        {/* Cap line only: flat apex, while the B's bowl keeps its round bottom. */}
        <clipPath id={CLIP_TOP_ID}>
          <path clipRule="evenodd" d={BOWL_CLIP} />
        </clipPath>
      </defs>
      <g fill="none" stroke="currentColor" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={10}>
        <path d={STUDIOS} strokeWidth={STUDIOS_W} />
        <g strokeWidth={BRAND_W}>
          <path d={J} />
          <circle cx={O.cx} cy={O.cy} r={O.r} />
          <path d={O_BAR} />
          <path d={B_UPPER} />
          <path d={A_LEFT} clipPath={`url(#${CLIP_ID})`} />
          <path d={A_SWOOSH} />
          <path d={A_RIGHT_B} clipPath={`url(#${CLIP_TOP_ID})`} />
        </g>
      </g>
      <path d={B_STEM} fill="currentColor" />
    </>
  )
}

/** Standalone SVG markup (for the OG image / exports). */
export function brandLogoSvg(color: string): string {
  const { width, height } = brandViewBox
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><defs><clipPath id="c"><rect x="150" y="${CAP}" width="260" height="${BASE - CAP}"/></clipPath><clipPath id="t"><path clip-rule="evenodd" d="${BOWL_CLIP}"/></clipPath></defs><g fill="none" stroke="${color}" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10"><path d="${STUDIOS}" stroke-width="${STUDIOS_W}"/><g stroke-width="${BRAND_W}"><path d="${J}"/><circle cx="${O.cx}" cy="${O.cy}" r="${O.r}"/><path d="${O_BAR}"/><path d="${B_UPPER}"/><path d="${A_LEFT}" clip-path="url(#c)"/><path d="${A_SWOOSH}"/><path d="${A_RIGHT_B}" clip-path="url(#t)"/></g></g><path d="${B_STEM}" fill="${color}"/></svg>`
}

/** The "J" alone, for the app icon (viewBox frames just the letter). */
export const brandJ = { viewBox: '-3 22 86 122', d: J, strokeWidth: BRAND_W }
