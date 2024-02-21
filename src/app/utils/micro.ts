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
  
  /*
  This rest of this was mostly copied from https://github.com/linto-ai/WebVoiceSDK
  */
  

  function interleave(inputL: Float32Array, inputR: Float32Array) {
    var length = inputL.length + inputR.length
    var result = new Float32Array(length)
    var index = 0
    var inputIndex = 0
    while (index < length) {
      result[index++] = inputL[inputIndex] as number
      result[index++] = inputR[inputIndex] as number
      inputIndex++
    }
    return result
  }
  
  function writeFloat32(output: DataView, offset: number, input: Float32Array) {
    for (var i = 0; i < input.length; i++, offset += 4) {
      output.setFloat32(offset, input[i] as number, true)
    }
  }
  
  function floatTo16BitPCM(
    output: DataView,
    offset: number,
    input: Float32Array
  ) {
    for (var i = 0; i < input.length; i++, offset += 2) {
      var s = Math.max(-1, Math.min(1, input[i] as number))
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
  }
  
  function writeString(view: DataView, offset: number, string: string) {
    for (var i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }