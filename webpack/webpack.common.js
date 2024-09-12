// 웹펙은 모듈 번들러 중 하나
// 현재 js 파일들을 하나하나 가져오면 네트워크 통신이 너무 많아진다 -> 페이지 로딩이 느리게 됨
// 여러 리소스를 번들링 및 압축하여 로딩 속도 개선
// 웹팩 공통 설정
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 엔트리 포인트 지정
  // 웹팩의 최초 진입점
  entry: {
    // 이 이름으로 output [name] 결정
    // 여러개 설정 가능
    main: './src/index.jsx',
  },
  // 결과 포인트 지정
  output: {
    // 브라우저에서 참조될 때 출력 디렉터리의 공용 url 지정
    publicPath: '/',
    // /dist 폴더에 결과 생성
    path: path.join(__dirname, '../dist'),
    // 캐시버스팅
    // hash, chunkHash, contentHash가 존재
    // hash는 빌드할 때마다 무조건 변경
    // chunkHash를 활용하여 청크별 고유 해쉬값을 가지게 함 -> 빌드시 변경이 발생한 엔트리의 해쉬 값만 변경
    // contentHash는 전체 청크의 content가 아니라 추출된 content에 의해서만 계산된 해쉬값을 가진다
    // 추가 학습 필요
    filename: '[name].[chunkhash].js',
    // 빌드 전 /dist 폴더 정리
    clean: true,
  },
  // 모듈을 해석하는 방식
  resolve: {
    // js, jsx 파일에서 파일 확장자를 명시하지 않아도 된다
    extensions: ['.js', '.jsx'],
    // 모듈을 해석할 때 검색할 디렉터리 목록
    // 앞에 있는 것들부터 탐색
    modules: [
      // src에 있는 것들 + nodemodules에 있는 것들도
      path.resolve(__dirname, '../src'),
      'node_modules',
    ],
    // import alias 설정
    alias: {
      '@components': path.resolve(__dirname, '../src/_components/index.js'),
      '@data': path.resolve(__dirname, '../src/_data/index.js'),
      '@styles': path.resolve(__dirname, '../src/_styles/index.js'),
      '@utils': path.resolve(__dirname, '../src/_utils/index.js'),
    }
  },
  // 웹팩의 추가적인 기능
  plugins: [
    // 출력된 디렉터리에 HTML을 생성하는 플러그인
    // 현재 index.html의 경로를 적어, 출력된 디렉터리에 해당 index.html을 주입
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    })
  ],
  // 개발 서버 설정
  devServer: {
    // History 라우팅 대체 사용 설정
    // 존재하는 경로는 해당 경로로, 미지정된 경로는 404
    historyApiFallback: true,
    // 호스트 설정
    host: 'localhost',
    // 포트 설정
    port: 3000,
    // 개발 서버 자동 실행
    open: true,
  },
};