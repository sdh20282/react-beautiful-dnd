const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  // 웹팩 모드 설정
  mode: "production",
  // devtool 사용하지 않음
  devtool: false,
  // 타겟 설정, es5를 타겟으로
  // 루트 디렉터리에 생성한 browserslistrc 파일로 대체 가능
  target: ["web", "es5"],
  module: {
    rules: [
      {
        // js, jsx 파일만 변환
        test: /\.(js|jsx)$/,
        // nodemodules는 변환하지 않음
        exclude: /node_modules/,
        // babel-loader를 사용하여 코드 변환
        // 폴리필 사용 가능, 캐시 확용 및 최적화 적용 시 빠른 속도
        // 타입 채킹은 ForkTsCheckerWebpackPlugin 플러그인을 통해 가능
        // ts-loader, esbuild-loader 등의 옵션도 존재
        // 하지만 폴리필 불가능
        loader: 'babel-loader',
        // 바벨 옵션 설정
        // babel.config.json을 통해 설정하는 방법도 존재
        // 여기서는 development, production 별로 웹팩 설정을 다르게 설정하여 직접 명시
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                // 어떤 방식으로 폴리필 사용할지 결정
                // false, entry, usage 존재
                // false는 폴리필 사용하지 않음
                // entry는 타겟 브라우저에 필요한 모든 폴리필 생성
                // entry point에 core-js를 직접 import해야 함
                // usage는 타겟 브라우저에서 지원되지 않으면 현재 프로젝트 코드에서 사용하는 기능에 관련된 폴리필만 추가
                useBuiltIns: 'usage',
                // corejs 3을 대상으로 폴리필 생성
                // corejs 2는 지원 종료, 레거시 코드만 업데이트
                // corejs 3에 새로운 기능 추가됨
                corejs: {
                  version: 3,
                  proposals: true
                },
              },
            ],
            // 리액트 해석
            [
              '@babel/preset-react',
              {
                // import React from 'react' 생략
                runtime: 'automatic'
              }
            ],
          ],
          plugins: [
            // 스타일드 컴포넌트 해석
            [
              'babel-plugin-styled-components',
              {
                // 클래스 이름 비활성화
                displayName: false,
                // 웹팩이 압축하지 못한 스타일드 컴포넌트 압축
                minify: true,
                // 템플릿 리터럴 문법 트랜스파일
                transpileTemplateLiterals: true,
                // 스타일드 컴포넌트에서 사용하지 않는 css 코드 제거
                pure: true,
              },
            ],
          ],
        }
      },
    ]
  },
  optimization: {
    // Chunk 파일을 어떻게 분리할지 Webpack에서 설정을 해주지 않으면, 기본 설정인 페이지 별로 Chunk 파일이 분리 ->  페이지에서 동일하게 사용되는 코드가 중복
    // 동기, 비동기, 정적으로 import된 모든 모듈에 대해 최적화 진행
    splitChunks: {
      chunks: 'all',
    },
  },
  // 결과 파일 사이즈 설정
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
});