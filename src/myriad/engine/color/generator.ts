import tinycolor from "tinycolor2"
import { mixToShade, pickContrast } from "./primitives/color"
import { adjust } from "./adjust"
import { AdjustedScheme, MyriadOutput, GenColor } from "./config"

interface ColorRange {
  color: tinycolor.Instance,
  antithesis: tinycolor.Instance,
}

export const ColorObj = (colors: ColorRange, scheme: AdjustedScheme): GenColor => {
  //Generic color object with all its auto generated color variations
  const faintness = 1.1
  const { color, antithesis } = colors

  return {
    color,
    shade: mixToShade(color, antithesis, 12.0),
    shade2: mixToShade(color, antithesis, faintness),
    contrast: pickContrast(color, scheme).toString()
  }
}

//generate colors
export function generateColor(colors: ColorRange, scheme: AdjustedScheme) {
  if(!colors.color) return
  return ColorObj(colors, scheme)
}

function background(scheme: AdjustedScheme) {
  if(!scheme.background) return
  const { background, foreground } = scheme
  return generateColor({
    color: background, 
    antithesis: foreground || background
  }, scheme)
}

function foreground(scheme: AdjustedScheme) {
  if(!scheme.foreground) return
  const { background, foreground } = scheme
  return generateColor({
    color: foreground, 
    antithesis: background || foreground
  }, scheme)
}

function accents(scheme: AdjustedScheme) {
  if(!scheme.accents) return []
  return scheme.accents?.map((fl) => generateColor({
    color: fl, 
    antithesis: scheme.background || fl
  }, scheme))
}

export const generate = (scheme = adjust()): MyriadOutput => {
  //Gets the adjusted colors from the wrapper and generates more colors
  //assosiated with the root colors. Like, shadeded variations and accent contrast colors.
  return {
    background: background(scheme),
    foreground: foreground(scheme),
    accents: accents(scheme) || []
  }
}