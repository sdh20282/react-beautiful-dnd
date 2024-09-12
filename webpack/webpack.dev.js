// development에서만 사용하는 웹팩 설정
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  // 웹팩 모드를 development로 설정
  // 개발에 최적화된 웹팩 내장 기능 사용 가능
  // 환경변수 주입 등
  mode: "development",
  // 소스맵 사용
  devtool: 'eval-cheap-module-source-map',
  // 캐시 타입을 filesystem으로 설정하여 캐시 사용
  cache: {
    type: "filesystem",
  },
  module: {
    rules: [
      {
        // js, jsx 파일만 변환
        test: /\.(js|jsx)$/,
        // nodemodules는 변환하지 않음
        exclude: /node_modules/,
        // babel-loader를 사용하여 코드 변환
        // 폴리필 사용 가능, 캐시 확용 및 최적화 적용 시 빠른 속도
        // ts-loader, esbuild-loader 등의 옵션도 존재
        // 하지만 폴리필 불가능
        loader: 'babel-loader',
        // 바벨 옵션 설정
        // babel.config.json을 통해 설정하는 방법도 존재
        // 여기서는 development, production 별로 웹팩 설정을 다르게 설정하여 직접 명시
        options: {
          // 캐시 설정
          cacheCompression: false,
          // 로더의 결과물을 캐시, 빌드 속도 개선
          cacheDirectory: true,
          presets: [
            // es6를 트랜스파일링하기 위해 사용
            '@babel/preset-env',
            // 리액트 해석
            [
              '@babel/preset-react',
              {
                // import React from 'react' 생략
                // 리액트 자동 import
                runtime: 'automatic'
              }
            ],
          ],
          // 스타일드 컴포넌트 해석
          plugins: [['babel-plugin-styled-components']],
        }
      },
    ]
  },
  optimization: {
    // 런타임 청크 분리용
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
  },
});