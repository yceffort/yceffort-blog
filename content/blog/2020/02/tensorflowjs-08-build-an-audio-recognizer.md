---
title: "Tensorflow.js - 08. Build an audio recognizer"
tags: [machine-learning, ai, tensorflow, javascript]
published: true
date: 2020-02-03 20:41:16
---

```toc
tight: true,
from-heading: 1
to-heading: 3
```

# Transfer learning audio recognizer

이번 튜토리얼에서는, Tensorflow.js를 활용하여 브라우저에서 학습시키는 커스텀 오디오 분류기를 만들어 볼 것입니다. 브라우저에서 슬라이더를 컨트롤을 하여 사운드를 만들어 볼 것입니다.

비교적 적은 학습 자료로 짧은 소리를 분류하는 모델을 만들기 위해 전송 학습을 사용할 것입니다. 그리고 음성 명령 인식을 위해 미리 훈련된 모델을 사용할 것입니다, 이 모델 위에 우리가 맞춤형 사운드 클래스를 인식하도록 새로운 모델을 훈련시킬 예정입니다.

## 1. 소개

먼저, 20가지의 음성 명령을 인식할 수 있는 [사전 학습된 모델](https://github.com/tensorflow/tfjs-models/tree/master/speech-commands). 그 다음 마이크를 활용하여, 당신의 목소리를 인식하고, 슬라이더를 좌우로 움직일 수 있게 하는 간단한 신경망을 만들어 볼 것입니다.

이번 학습에서는 음성인식과 관련된 배경지식을 설명하지는 않습니다. 만약 이에 관하여 궁금한 것이 있다면, [이 튜토리얼](https://www.tensorflow.org/tutorials/sequences/audio_recognition)을 참고하시기 바랍니다.

또한 이번 튜토리얼에서 나오는 용어를 모아 머신러닝을 위한 [용어집](https://docs.google.com/document/d/1YcLoCbDFfE6qJGZikBbjfbiI_dG4iETyIBEcS-NQbNE/edit)도 참고하세요.

이번 튜토리얼에서 배울 수 있는 것

- 미리 훈련된 음성 명령 인식 모델을 불러오는 법
- 마이크를 통한 실시간 예측을 하는 방법
- 브라우저의 마이크를 활용해 커스텀 음성 인식 모델을 사용하고 훈련하는 법

## 2. 요구사항

이번 튜토리얼을 마치기 위해서는, 아래와 같은 것들이 필요합니다.

1. 최신버전의 크롬 또는 다른 모던 브라우저
2. 로컬 머신에서 작동할 수 있는 텍스트 편집기 또는, Codepen, Glitch와 같은 툴
3. HTML, CSS, 자바스크립트, Chrome Devtool에 대한 기본적인 지식
4. 신경망에 대한 높은 수준의 이해. 초심자거나 다시 공부가 필요하다면, [3blue1brown](https://www.youtube.com/watch?v=aircAruvnKk)의 영상이나 [이 영상](https://www.youtube.com/watch?v=SV-cgdobtTA)을 참고해주세요.

## 3. Tensorflow.js와 오디오 모델 로딩

`index.html`에 아래 코드를 붙여 넣어주세요.

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands"></script>
  </head>
  <body>
    <div id="console"></div>
    <script src="index.js"></script>
  </body>
</html>
```

첫번쨰 스크립트 태그는 Tensorflow.js 라이브러리를 , 두번째 스크립트 태그는 이미 학습된 [음성 명령 모델](https://github.com/tensorflow/tfjs-models/tree/master/speech-commands)을 불러옵니다. `<div id="console">` 는 모델에서의 결과를 표시할 것입니다.

## 4. 실시간 예측

`index.js`를 만들고 연다음에, 아래 코드를 붙여 넣어주세요.

```javascript
let recognizer

function predictWord() {
  // Array of words that the recognizer is trained to recognize.
  const words = recognizer.wordLabels()
  recognizer.listen(
    ({ scores }) => {
      // Turn scores into a list of (score,word) pairs.
      scores = Array.from(scores).map((s, i) => ({ score: s, word: words[i] }))
      // Find the most probable word.
      scores.sort((s1, s2) => s2.score - s1.score)
      document.querySelector("#console").textContent = scores[0].word
    },
    { probabilityThreshold: 0.75 }
  )
}

async function app() {
  recognizer = speechCommands.create("BROWSER_FFT")
  await recognizer.ensureModelLoaded()
  predictWord()
}

app()
```

## 5. 예측을 테스트 해보기

로컬 머신에 마이크가 있는지 확인하세요. 혹시 없다면, 스마트폰에서 열어서 마이크를 사용해도됩니다. 웹페이지에서 실행하기 위해서, 먼저 `index.html`을 브라우저에서 엽니다. 로컬 파일에서 작업중이라면, 마이크에 엑세스 하기 위해서 web server 를 실행 한 다음에 `http://localhost:port/`를 활용하면 됩니다.

8000 port에서 실행하고 싶다면, 파이썬을 활용해도 됩니다.

`python -m SimpleHTTPServer`

처음에 모델을 다운로드 하는데 시간이 좀 걸립니다. 모델이 로딩되면, 페이지 맨 위에 단어 들이 뜨는 것을 볼 수 있을 것입니다. 이 모델은 0~9의 영문 숫자, 그리고 간단한 단어 `left` `right` `yes` `no` 등을 인식할 수 있습니다.

이들 단어중 하나를 말해보세요. 단어를 정확히 인식하나요? `probabilityThreshold`를 조정해서 한번 시험해보세요. 이 변수는 모델이 결과값을 예측하는 정도를 조절해줍니다. 0.75라는 값은 주어진 단어에 대해서 75% 이상의 확률로 확신한다면, 그 결과를 응답한다는 뜻입니다.

음성 인식 모델과 이 API에 대해서 좀더 자세히 알고 싶다면, Github의 [README.md](https://github.com/tensorflow/tfjs-models/blob/master/speech-commands/README.md)를 참고해보세요.

## 6. 데이터 수집

더 흥미롭게 만들어 봅시다. 슬라이더를 컨트롤 하기 위해, 모든 단어를 인식하는 대신 짧은 단어만 활용해봅시다.

우리는 세가지 명령어 - `left` `right` `noise` 만 인식하도록 훈련 시켜 볼 것입니다. 이 단어로 슬라이더를 움직여 볼 것입니다. `Noise`는 음성인식에서 인식하게 될 중요한 단어인데, 그 이유는 우리는 슬라이더가 올바른 사운드에만 반응하기를 원하기 때문입니다. 우리가 일반적으로 말하는 단어로 말할 때는 움직여서는 안됩니다.

1. 먼저 데이터를 수집해야 합니다. `<body/>` 태그에 원래 있던 `<div id="console"/>` 대신 아래 코드를 붙여 넣습니다.

```html
<button id="left" onmousedown="collect(0)" onmouseup="collect(null)">
  Left
</button>
<button id="right" onmousedown="collect(1)" onmouseup="collect(null)">
  Right
</button>
<button id="noise" onmousedown="collect(2)" onmouseup="collect(null)">
  Noise
</button>
```

2. 아래 코드를 `index.js`에 붙여넣습니다.

```javascript
// One frame is ~23ms of audio.
const NUM_FRAMES = 3
let examples = []

function collect(label) {
  if (recognizer.isListening()) {
    return recognizer.stopListening()
  }
  if (label == null) {
    return
  }
  recognizer.listen(
    async ({ spectrogram: { frameSize, data } }) => {
      let vals = normalize(data.subarray(-frameSize * NUM_FRAMES))
      examples.push({ vals, label })
      document.querySelector(
        "#console"
      ).textContent = `${examples.length} examples collected`
    },
    {
      overlapFactor: 0.999,
      includeSpectrogram: true,
      invokeCallbackOnNoiseAndUnknown: true,
    }
  )
}

function normalize(x) {
  const mean = -100
  const std = 10
  return x.map(x => (x - mean) / std)
}
```

3. `app()`에서 `predictWord()`를 지우고 아래 코드를 붙여넣습니다.

### 코드를 자세히 보기

우리는 Left, Right, Noise라고 이름 붙인 세가지 버튼을 추가했습니다. 이 셋은, 우리 모델이 인식하기를 바라는 각각의 음성 명령입니다. 이 버튼을 누르면, 새롭게 추가한 `collect()` 함수를 실행하는데, 이 함수는 우리 모델에 훈련용 샘플을 만들어 줍니다.

`collect()`는 `recognizer.listen()`의 결과물인 `label` 과 연관 이 있습니다. `includeSpectrogram`가 true라면, `recognizer.listen()`는 1초의 오디오를 43개의 프레임으로 나눈 음성 데이터를 보내는데, 이는 각 프레임당 23ms 의 오디오 정보를 가지고 있습니다.

```javascript
recognizer.listen(async ({spectrogram: {frameSize, data}}) => {
...
}, {includeSpectrogram: true});
```

우리는 슬라이더를 컨트롤 하기 위해 짧은 단어만 필요하므로, 3개의 프레임 (70ms)만 취할 것입니다.

```javascript
let vals = normalize(data.subarray(-frameSize * NUM_FRAMES))
```

숫자 관련 이슈를 피하기 위해, 데이터를 평균 0, 분산 1인 데이터로 정규화 할 것입니다.이 경우, 음성은 -100 언저리의, 표준편차 10의 데이터로 구성되어 있습니다.

```javascript
const mean = -100
const std = 10
return x.map(x => (x - mean) / std)
```

결국엔, 훈련 예제에는 두가지 필드만 남습니다.

- label: 0, 1, 2는 각각 left, right, nosie를 나타냅니다.
- vals: 음성정보를 가지고 있는 696개의 숫자

그리고 우리는 이 데이터를 모두 `examples`에 보관합니다.

```javascript
examples.push({ vals, label })
```

## 7. 수집한 데이터 테스트

각각의 예제 별로 데이터를 수집하기 위해, 각 버튼을 3~4초간 누르면서 반복적으로 음성을 제공합니다. 각 레이블 별로 150개 정도의 예제가 필요합니다. 예를 들어, `left`는 손가락 스냅소리, 휘파람은 `right`, 그 외의 침묵이나 대화 소리는 `Noise`로 할 수 있을 것입니다.

예제 데이터를 모은다면, 페이지 상단에 카운터가 뜰 것입니다. console.log()를 활용해 examples에 어떤 변수들이 담기는지 살펴보세요. 이 시점에서 목표는, 데이터 수집 프로세스를 테스트 하는 것입니다. 나중에, 전체 앱을 테스트 할 때 이 데이터를 다시 볼 것입니다.

## 8. 모델 훈련시키기

1. `index.html`에 `Noise` 버튼 하단에 아래 버튼을 추가하세요.

```html
<br /><br />
<button id="train" onclick="train()">Train</button>
```

2. 아래 코드를 index.js에 추가하세요.

```javascript
const INPUT_SHAPE = [NUM_FRAMES, 232, 1]
let model

async function train() {
  toggleButtons(false)
  const ys = tf.oneHot(
    examples.map(e => e.label),
    3
  )
  const xsShape = [examples.length, ...INPUT_SHAPE]
  const xs = tf.tensor(flatten(examples.map(e => e.vals)), xsShape)

  await model.fit(xs, ys, {
    batchSize: 16,
    epochs: 10,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        document.querySelector("#console").textContent = `Accuracy: ${(
          logs.acc * 100
        ).toFixed(1)}% Epoch: ${epoch + 1}`
      },
    },
  })
  tf.dispose([xs, ys])
  toggleButtons(true)
}

function buildModel() {
  model = tf.sequential()
  model.add(
    tf.layers.depthwiseConv2d({
      depthMultiplier: 8,
      kernelSize: [NUM_FRAMES, 3],
      activation: "relu",
      inputShape: INPUT_SHAPE,
    })
  )
  model.add(tf.layers.maxPooling2d({ poolSize: [1, 2], strides: [2, 2] }))
  model.add(tf.layers.flatten())
  model.add(tf.layers.dense({ units: 3, activation: "softmax" }))
  const optimizer = tf.train.adam(0.01)
  model.compile({
    optimizer,
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  })
}

function toggleButtons(enable) {
  document.querySelectorAll("button").forEach(b => (b.disabled = !enable))
}

function flatten(tensors) {
  const size = tensors[0].length
  const result = new Float32Array(tensors.length * size)
  tensors.forEach((arr, i) => result.set(arr, i * size))
  return result
}
```

3. 앱을 로드할 때 `buildModel()`을 호출하세요.

```javascript
async function app() {
  recognizer = speechCommands.create("BROWSER_FFT")
  await recognizer.ensureModelLoaded()
  // Add this line.
  buildModel()
}
```

앱을 새로고침 한다면, `Train` 버튼이 나타날 것입니다. 이 버튼을 클릭하면 데이터를 다시 수집해서 테스트하거나, 10 단계 까지 기다렸다가 예측과 함께 학습된 내용을 테스트 해볼 수 있습니다.

### 코드 살펴보기

여기에서는 크게 두가지 함수가 있습니다. `buildModel()`은 모델 아키텍쳐를 정의하고, `train()`은 수집한 데이터로 모델을 훈련 시킵니다.

#### 모델 아키텍쳐

이 모델에는 4개의 레이어가 있습니다. 음성데이터를 처리하기 위한 합성곱 레이어, max-pool layer, flatten layer, 그리고 3개의 레이어를 연결해주는 dense layer가 있습니다.

```javascript
model = tf.sequential()
model.add(
  tf.layers.depthwiseConv2d({
    depthMultiplier: 8,
    kernelSize: [NUM_FRAMES, 3],
    activation: "relu",
    inputShape: INPUT_SHAPE,
  })
)
model.add(tf.layers.maxPooling2d({ poolSize: [1, 2], strides: [2, 2] }))
model.add(tf.layers.flatten())
model.add(tf.layers.dense({ units: 3, activation: "softmax" }))
```



⚠️ 작성중
