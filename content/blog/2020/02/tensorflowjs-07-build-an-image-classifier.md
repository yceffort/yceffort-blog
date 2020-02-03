---
title: "Tensorflow.js - 07. Build an image classifier"
tags: [machine-learning, ai, tensorflow, javascript]
published: true
date: 2020-02-03 20:41:09
---

```toc
tight: true,
from-heading: 1
to-heading: 3
```

# Transfer learning image classifier

본 튜토리얼에서는, 브라우저 환경에서 Tesnorflow.js를 활용하여 커스텀 이미지 분류기를 만드는 방법을 알아봅니다.

이번 장에서는, 최소한의 데이터를 활용하여 높은 정확도를 가진 모델을 만들기 위하여 transfer learning(전이학습)을 활용해볼 것입니다. 우리는 이미 잘 학습되어 있는 MobileNet이라고 불리우는 이미지 분류기를 활용할 것입니다. 이 모델을 기반으로, 이미지 클래스를 사용자 정의 하여 학습해볼 것입니다.

## 1. Introduction

이번 튜토리얼에서는, 간단한 [teachable machine](https://teachablemachine.withgoogle.com/)을 만들어 볼 것입니다. teachable machine이란, 자바스크립트로 작성된 유연하고도 강력한 머신러닝 라이브러리인 tensorflow.js를 활용하여 브라우저에서 작동할 수 있는 커스텀 이미지 분류기 입니다. 먼저 MobileNet이라고 불리우는 모델을 브라우저 환경에서 불러오고 실행해볼 것입니다. 그 다음에는 전이학습을 활용하여 이미 학습된 MobileNet 모델을 커스터마이징하고 우리의 앱에서 실행할 수 있도록 할 것입니다.

이 튜토리얼에서는 teachable machine 어플리케이션을 만드는데 필요한 이론적 배경을 소개하지는 않습니다. 만약 궁금하다면, [이 튜토리얼](https://beta.observablehq.com/@nsthorat/how-to-build-a-teachable-machine-with-tensorflow-js)을 참고하시기 바랍니다.

### 배우게 될 것

- 이미 학습된 MobileNet 모델을 불러오고 새로운 데이터로 예측하는 방법
- 웹캠을 활용하여 예측하는 법
- MobileNet을 즉시 활성화하여, 웹캠에서 인식된 이미지를 분류하는 법

## 2. 요구 사항

1. 최신버전의 크롬 또는 모던 브라우저
2. 로컬 머신에서 실행할 수 있는 텍스트 에디터, 혹은 웹에서 이용할 수 있는 Codepen이나 Glitch
3. HTML, CSS, Javascript, Chrome Devtool에 대하한 기본적인 지식
4. 신경망에 대한 높은 수준의 이해. 만약 이에 관련된 지식이 필요하다면, [3blue1brown](https://www.youtube.com/watch?v=aircAruvnKk)이나 [video on Deep Learning in Javascript by Ashi Krishnan](https://www.youtube.com/watch?v=SV-cgdobtTA)를 보는 것을 추천합니다.

## 3. Tensorflow.js와 MobileNet 불러오기

index.html을 열고 아래 코드를 넣어주세요.

```html
<html>
  <head>
    <!-- Load the latest version of TensorFlow.js -->
    <script src="https://unpkg.com/@tensorflow/tfjs"></script>
    <script src="https://unpkg.com/@tensorflow-models/mobilenet"></script>
  </head>
  <body>
    <div id="console"></div>
    <!-- Add an image that we will use to test -->
    <img
      id="img"
      crossorigin
      src="https://i.imgur.com/JlUvsxa.jpg"
      width="227"
      height="227"
    />
    <!-- Load index.js after the content of the page -->
    <script src="index.js"></script>
  </body>
</html>
```

## 4. 브라우저에서 MobileNet을 로딩

`index.js`를만들고 연다음에, 아래 코드를 넣어주세요.

```javascript
let net

async function app() {
  console.log("Loading mobilenet..")

  // Load the model.
  net = await mobilenet.load()
  console.log("Successfully loaded model")

  // Make a prediction through the model on our image.
  const imgEl = document.getElementById("img")
  const result = await net.classify(imgEl)
  console.log(result)
}

app()
```

## 5. MobileNet을 테스트 하기

index.html을 웹브라우저에서 열어보세요.

자바스크립트 콘솔에, 사진의 강아지가 어떤 강아지인지 예측한 작업내역을 볼 수 있습니다. 이 작업은 모델을 다운로드 하는데 시간이 약간의 시간이 걸릴 수 있으므로 조금 기다리시기 바랍니다.

```json
[
  { "className": "kelpie", "probability": 0.5226836204528809 },
  {
    "className": "American Staffordshire terrier, Staffordshire terrier, American pit bull terrier, pit bull terrier",
    "probability": 0.1948588341474533
  },
  { "className": "malinois", "probability": 0.11830379068851471 }
]
```

🚧 작성중 🚧
