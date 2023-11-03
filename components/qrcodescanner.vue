<script setup >
import { Html5QrcodeScanner } from 'html5-qrcode';

const emit = defineEmits();

const config = {
  fps: 10,
  qrbox: 250,
};

function onScanSuccess(decodedText, decodedResult) {
  emit('result', decodedText, decodedResult);
}

onMounted(() => {
  const html5QrcodeScanner = new Html5QrcodeScanner(
    'qr-code-full-region',
    config,
  );
  html5QrcodeScanner.render(onScanSuccess);
});
</script>

<template>
  <div>
    <div id="qr-code-full-region"></div>
  </div>
</template>