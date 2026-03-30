<template>
  <div class="klineLoading" :class="sizeClass">
    <div class="klineLoading__top">
      <div class="klineLoading__headline">
        <span class="klineLoading__eyebrow"></span>
        <span class="klineLoading__title"></span>
      </div>
      <div class="klineLoading__meta">
        <span class="klineLoading__metaLine"></span>
        <span class="klineLoading__metaLine short"></span>
      </div>
    </div>

    <div class="klineLoading__chart">
      <div class="klineLoading__grid">
        <span v-for="line in 5" :key="`h-${line}`" class="klineLoading__gridLine horizontal"></span>
        <span v-for="line in 4" :key="`v-${line}`" class="klineLoading__gridLine vertical" :style="{ left: `${line * 22}%` }"></span>
      </div>

      <div class="klineLoading__candles">
        <div
          v-for="i in count"
          :key="i"
          class="klineLoading__candle"
          :style="{ animationDelay: `${i * 0.06}s` }"
        >
          <span class="klineLoading__wick" :class="getCandleClass(i)"></span>
          <span class="klineLoading__body" :class="getCandleClass(i)" :style="{ height: getBodyHeight(i) }"></span>
          <span class="klineLoading__wick" :class="getCandleClass(i)"></span>
        </div>
      </div>

      <div class="klineLoading__axis klineLoading__axis--right">
        <span v-for="line in 5" :key="`r-${line}`"></span>
      </div>

      <div class="klineLoading__axis klineLoading__axis--bottom">
        <span v-for="line in 4" :key="`b-${line}`"></span>
      </div>
    </div>

    <div class="klineLoading__footer">
      <span class="klineLoading__footerLine"></span>
      <div class="klineLoading__pulse">
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  count: {
    type: Number,
    default: 22,
  },
  size: {
    type: String,
    default: 'lg',
  },
});

const sizeClass = computed(() => {
  return props.size === 'sm' ? 'isSmall' : props.size === 'md' ? 'isMedium' : 'isLarge';
});

const getCandleClass = (index: number) => {
  return index % 4 === 0 || index % 7 === 0 ? 'isDown' : 'isUp';
};

const getBodyHeight = (index: number) => {
  const heights = ['16px', '26px', '18px', '34px', '20px', '28px', '22px', '38px', '18px', '30px'];
  return heights[index % heights.length];
};
</script>

<style scoped>
.klineLoading {
  position: relative;
  display: grid;
  gap: 14px;
  width: 100%;
  min-height: 260px;
  height: 100%;
  padding: 18px;
  border-radius: 24px;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(95, 224, 179, 0.14), transparent 28%),
    radial-gradient(circle at top right, rgba(103, 183, 255, 0.1), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.015)),
    linear-gradient(180deg, #161f29 0%, #10171f 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  contain: content;
}

.klineLoading::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.06) 45%, transparent 70%);
  transform: translateX(-100%);
  animation: kline-shimmer 2.6s linear infinite;
  pointer-events: none;
}

.klineLoading__top,
.klineLoading__footer {
  position: relative;
  z-index: 1;
}

.klineLoading__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.klineLoading__headline,
.klineLoading__meta {
  display: grid;
  gap: 8px;
}

.klineLoading__eyebrow,
.klineLoading__title,
.klineLoading__metaLine,
.klineLoading__footerLine,
.klineLoading__axis span {
  display: block;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.klineLoading__eyebrow {
  width: 76px;
  height: 10px;
}

.klineLoading__title {
  width: 124px;
  height: 18px;
}

.klineLoading__metaLine {
  width: 58px;
  height: 8px;
}

.klineLoading__metaLine.short {
  width: 42px;
}

.klineLoading__chart {
  position: relative;
  z-index: 1;
  min-height: 180px;
  padding: 18px 38px 28px 12px;
  border-radius: 20px;
  background: rgba(8, 12, 18, 0.36);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.klineLoading__grid {
  position: absolute;
  inset: 16px 34px 24px 12px;
}

.klineLoading__gridLine {
  position: absolute;
  display: block;
  background: rgba(255, 255, 255, 0.08);
}

.klineLoading__gridLine.horizontal {
  left: 0;
  right: 0;
  height: 1px;
}

.klineLoading__gridLine.horizontal:nth-child(1) { top: 0; }
.klineLoading__gridLine.horizontal:nth-child(2) { top: 25%; }
.klineLoading__gridLine.horizontal:nth-child(3) { top: 50%; }
.klineLoading__gridLine.horizontal:nth-child(4) { top: 75%; }
.klineLoading__gridLine.horizontal:nth-child(5) { bottom: 0; }

.klineLoading__gridLine.vertical {
  top: 0;
  bottom: 0;
  width: 1px;
}

.klineLoading__candles {
  position: absolute;
  inset: 24px 42px 36px 18px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 6px;
}

.klineLoading__candle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  min-width: 0;
  animation: candle-bob 1.8s ease-in-out infinite;
}

.klineLoading__wick {
  width: 1px;
  height: 10px;
  opacity: 0.9;
}

.klineLoading__body {
  width: min(8px, 100%);
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.02);
}

.klineLoading__body.isUp,
.klineLoading__wick.isUp {
  background: rgba(24, 195, 126, 0.95);
}

.klineLoading__body.isDown,
.klineLoading__wick.isDown {
  background: rgba(240, 68, 82, 0.9);
}

.klineLoading__axis {
  position: absolute;
  display: grid;
  gap: 18px;
}

.klineLoading__axis--right {
  top: 22px;
  right: 10px;
  bottom: 34px;
  width: 22px;
}

.klineLoading__axis--right span {
  width: 100%;
  height: 8px;
}

.klineLoading__axis--bottom {
  left: 20px;
  right: 40px;
  bottom: 10px;
  grid-auto-flow: column;
  justify-content: space-between;
}

.klineLoading__axis--bottom span {
  width: 28px;
  height: 8px;
}

.klineLoading__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.klineLoading__footerLine {
  width: 84px;
  height: 10px;
}

.klineLoading__pulse {
  position: relative;
  width: 92px;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
}

.klineLoading__pulse span {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, transparent, rgba(95, 224, 179, 0.9), transparent);
  animation: pulse-slide 1.8s linear infinite;
}

.isSmall {
  min-height: 210px;
  padding: 14px;
}

.isSmall .klineLoading__chart {
  min-height: 146px;
}

.isMedium {
  min-height: 236px;
}

@keyframes candle-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes pulse-slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(180%); }
}

@keyframes kline-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(140%); }
}
</style>
