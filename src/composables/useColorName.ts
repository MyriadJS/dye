// @ts-ignore
import nearestColor from 'nearest-color';
import c from 'color-name-list';


type nearestType = (hex: string) => {
  name: string;
  value: string
};
// @ts-ignore
const colors = c.colorNameList.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});
const nearest: nearestType = nearestColor.from(colors);

export function useColorName(h: string) {
  const getColorName = (hex: string = h) => nearest(hex);
  return getColorName
}