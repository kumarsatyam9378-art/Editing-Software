export default class WaveformEngine {
  async buildWaveformFromBuffer(audioBuffer, buckets = 200) {
    const channel = audioBuffer.getChannelData(0);
    const size = Math.floor(channel.length / buckets);
    const values = [];

    for (let i = 0; i < buckets; i += 1) {
      let sum = 0;
      for (let j = 0; j < size; j += 1) {
        sum += Math.abs(channel[i * size + j] || 0);
      }
      values.push(sum / size);
    }

    return values;
  }

  drawWaveform(ctx, values, width, height, color = '#60a5fa') {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    const bar = width / Math.max(values.length, 1);
    values.forEach((v, i) => {
      const h = Math.max(1, v * height);
      ctx.fillRect(i * bar, (height - h) / 2, Math.max(1, bar - 1), h);
    });
  }
}
