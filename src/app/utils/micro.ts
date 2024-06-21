export function minFramesForTargetMS(
    targetDuration: number,
    frameSamples: number,
    sr = 16000
  ): number {
    return Math.ceil((targetDuration * sr) / 1000 / frameSamples)
  }
  
  export function arrayBufferToBase64(buffer: ArrayBuffer) {
    var binary = ""
    var bytes = new Uint8Array(buffer)
    var len = bytes.byteLength
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i] as number)
    }
    return btoa(binary)
  }
  
