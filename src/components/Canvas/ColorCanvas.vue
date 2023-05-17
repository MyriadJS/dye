<script setup lang="ts">
import { 
  hexType,
  offCanvas, 
  canvasPixelColor,
  isActiveCanvas, 
  mousedown,
  outsideCanvas,
  responsiveCanvas
} from '../../composables/utils/canvas'
import { useCanvas } from '../../composables/color'
import { fillCanvas } from '../../composables/utils/gradient'

const emit = defineEmits(['change'])
const { colorCanvas, pos } = useCanvas()

function updateCanvas(hex: hexType) {
  if(!hex) return
  emit('change', hex)
  pos.value = hex.pixel
}

//Update color while dragging inside canvas
function colorChange(e: MouseEvent, click = false) {
  if(click) mousedown.value = true
  if(offCanvas(e, click)) return
  if(isActiveCanvas(e.target)) return
  const hex = canvasPixelColor(e, colorCanvas.value)
  updateCanvas(hex)
  mouseOn.value = true
}

//when outside canvas
const { mouseOn } = outsideCanvas({ 
  canvas: colorCanvas, 
  updateCanvas
})

const defaultHue = 'blue'
const { width, height } = responsiveCanvas({
  canvas: colorCanvas,
  updateCanvas: () => fillCanvas({
    hue: defaultHue,
    saturation: 100,
    lightness: 100
  })
})
</script>

<template>
  <div class="wrapper">
    <slot :position="pos" />
    <canvas
      ref="colorCanvas"
      class="color-canvas"
      :width="width"
      :height="height"
      @mousedown="(e) => colorChange(e, true)"
      @mousemove="(e) => colorChange(e)"
      @mouseleave="() => mouseOn = false"
    >
    </canvas>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  user-select: none;
  overflow: hidden;
}

canvas.color-canvas {
  aspect-ratio: 1/1;
  width: 300px;
  background-color: var(--background-20, rgb(64, 0, 0));
}
</style>