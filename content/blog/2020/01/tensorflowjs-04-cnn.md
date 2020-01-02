---
title: "Tensorflow.js - 04. CNN"
tags: [machine-learning, ai, tensorflow, javascript]
published: true
date: 2020-01-02 18:52:09
---

# Handwritten digit recognition with CNNs

이 튜토리얼에서는, Tensorflow.js의 CNN을 활용해 손글씨 숫자를 인식하는 모델을 만들어 볼 것입니다. 먼저, 손으로 쓴 수천개의 숫자 이미지와 이들의 라벨 (어떤 숫자인지)를 분류하는 훈련을 진행합니다. 그런 다음, 모델이 보지 못한 테스트 데이터를 사용하여 분류의 정확도를 평가합니다.

## 1. 들어가기전에

이 튜토리얼에서는, Tensorflow.js의 CNN을 활용해 손글씨 숫자를 인식하는 모델을 만들어 볼 것입니다. 먼저, 손으로 쓴 수천개의 숫자 이미지와 이들의 라벨 (어떤 숫자인지)를 분류하는 훈련을 진행합니다. 그런 다음, 모델이 보지 못한 테스트 데이터를 사용하여 분류의 정확도를 평가합니다.

입력으로 주어진 이미지에 카테고리(이미지에 나타나는 숫자)를 부여하기 위해 모델을 학습시키는 이 작업은 분류 작업으로 볼 수 있다. 우리는 최대한 많은 이미지와 정답을 입력해여 정확한 결과 값이 나오게 할 것입니다. 이를 [Supervised Learning](https://developers.google.com/machine-learning/problem-framing/cases)이라고 합니다.

### 만들어 볼 것

브라우저에서 Tensorflow.js를 활용해 모델을 훈련시키는 웹페이지를 만들어 볼 것입니다. 특정 크기의 흑백이미지에 나타나는 숫자를 분류하는 작업을 진행합니다. 이 작업에는

- 데이터 로딩
- 모델 아키텍쳐 정의
- 모델을 학습시키고 학습 성능을 실시간으로 측정
- 몇가지 예측을 통해 훈련된 모델을 평가

### 우리가 배울 것

- Tensorflow.js Layers API를 활용하여 Tensorflow.js syntax에 맞는 합성곱 모델을 만드는 법
- Tensorflow.js에서 분류 학습을 진행하는 법
- `tfjs-vis`라이브러리를 활용해어 학습 과정을 실시간으로 모니터링 하는 법

### 학습 전에 준비해야 할 것

- 최신 버전의 크롬ㅁ이나 es6 모듈을 지원하는 다른 모던 브라우저
- 로컬 머신에서 작동시킬 수 있는 텍스트 에디터 또는 웹에서 사용할 수 있는 Codepen이나 Glitch
- HTML, CSS, Javascript 그리고 Chrome Dev tool에 대한 지식 (혹은 선호하는 브라우저의 dev tool)
- 신경망에 대한 높은 수준의 이해. 학습이 필요하다면, 이 비디오들을 보기를 권장합니다. [3blue1brown](https://www.youtube.com/watch?v=aircAruvnKk) [Deep Learning in JS - Ashi Krishnan - JSConf EU 2018](https://www.youtube.com/watch?v=SV-cgdobtTA)

## 2. Set up

### HTML, Javascript 생성

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TensorFlow.js Tutorial</title>

    <!-- Import TensorFlow.js -->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>
    <!-- Import tfjs-vis -->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis@1.0.2/dist/tfjs-vis.umd.min.js"></script>

    <!-- Import the data file -->
    <script src="data.js" type="module"></script>

    <!-- Import the main script file -->
    <script src="script.js" type="module"></script>
  </head>

  <body></body>
</html>
```

## 데이터와 코드를 위한 자바스크립트 파일 생성

1. HTML과 같은 레벨에, `data.js`를 생성하고, [이 링크](https://storage.googleapis.com/tfjs-tutorials/mnist_data.js)에 있는 파일 내용을 복사해서 넣어주세요.
2. 1번과 같은 레벨에 `script.js`를 생성하고, 아래 내용을 붙여 넣어주세요.

```javascript
console.log("Hello TensorFlow")
```

> 여기에서 알려드린 코드에서는, 스크립트 태그로 로딩을 하고 있습니다. 많은 수의 자바스크립트 개발자들은 npm 으로 dependencies를 설치하고, 번들러로 프로젝트를 빌드하는 것을 선호합니다. 만약 할 수 있따면, `tensorflow.js`와 `tfjs-vis`를 npm으로 설치해보세요.

> 브라우저의 제약사항에 따라서, CORS 제한을 우회하기 위하여 로컬 브라우저에서 실행해야 할지도 모릅니다. [Python SimpleServer](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server)나 [Node Http server](https://www.npmjs.com/package/http-server) 두 가지 옵션이 있습니다. 아니면 Glitch와 같은 온라인 코딩 플랫폼을 이용하셔도 좋습니다.

> 저는 참고로 CodeSandbox를 사용합니다.

## 테스트 해보기

HTML과 javascript를 만들어 보았으므로, 테스트를 해볼 차례입니다. `index.html`을 브라우저에서 열고, devtools console을 열어보세요.

만약 모든게 잘 작동하고 있다면, 두개의 글로벌 변수가 생성되었을 것입니다. `tf`는 Tensorflow 라이브러리를 참조하고, `tfvis`는 `tfjs-vis`라이브러리를 참조합니다.

`Hello Tensorflow`라는 메시지를 보게 된다면, 다음 단계로 넘어갈 준비가 된 것입니다.

🚧작성 중 🚧
