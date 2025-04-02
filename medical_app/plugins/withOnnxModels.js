const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withOnnxModels(config) {
  return withDangerousMod(config, [
    'android',
    async (cfg) => {
      const modelDir = path.join(cfg.modRequest.projectRoot, 'android/app/src/main/assets/onnx');
      if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir, { recursive: true });
      }
      fs.copyFileSync(
        path.join(cfg.modRequest.projectRoot, 'assets/model.onnx'),
        path.join(modelDir, 'decoder_model_merged_quantized.onnx')
      );
      return cfg;
    }
  ]);
};