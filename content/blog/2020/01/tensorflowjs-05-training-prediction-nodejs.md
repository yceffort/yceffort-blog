---
title: "Tensorflow.js - 05. Training and Prediction in Node.js"
tags: [machine-learning, ai, tensorflow, javascript]
published: true
date: 2020-01-15 16:41:50
---

```toc
tight: true,
from-heading: 1
to-heading: 3
```

# Training and Prediction in Node.js

본 튜토리얼에서는 MLBAM에서 제공하는 피쳐 센서 데이터를 바탕으로, 야구의 칭 유형을 추측하는 모델을 만들어볼 예정입니다. 이 튜토리얼은 서버사이드 어플리케이션인 Node.js에서 진행될 예정입니다.

이 튜토리얼에서는 `tfjs-node`를 서버사이드에서 npm package로 설치하고, 모델을 만든 다음, 실제로 피치 센서 데이터로 훈련까지 진행해 볼 것입니다. 또한 학습 진행 상태를 클라이언트에 제공하고, 훈련된 모델을 바탕으로 예측하는 서버/클라이언트 아키텍쳐도 만들어 볼 것입니다.

## 1. 소개

이 시간에는 강력하고 유연한 자바스크립트 머신러닝 라이브러리인 Tensorflow.js를 활용하여, 서버에서 야구 피치 유형을 학습하고 분류하는 방법을 배우게 됩니다. 피치 센서 데이터에서 미치 유형을 예측하고, 웹 클라이언트에서 예측을 호출하는 모델을 가진 웹 어플리케이션을 만들어볼 것입니다. 이 코드의 완전 버전은 [Github Repo](https://github.com/tensorflow/tfjs-examples/tree/master/baseball-node)에 있습니다.

배우게 될 것

- Nodejs를 활용하여 npm package로 tensorflow.js를 설치하는 법
- Nodejs 환경에서 데이터를 학습시키고 테스트 하는법
- Nodejs 서버에서 Tensorflowjs에서 모델을 훈련시키는 법
- 학습된 모델을 배포해서 클라이언트/서버 어플리케이션에서 작동시키는 법

## 2. 요구 사항

본 튜토리얼을 완료하기 위해서는

- 최신버전의 크롬 또는 다른 모던 브라우저
- 텍스트 에디터와 로컬 머신에서 실행하기 위한 커맨드 터미널
- HTML, CSS, Javascript, Chrome Devtool에 대한 기본적인 지식
- 신경망에 대한 높은 수준의 개념적 이해. 혹시 학습이 필요하다면, 이 두 비디오 [1](https://www.youtube.com/watch?v=aircAruvnKk) [2](https://www.youtube.com/watch?v=SV-cgdobtTA)를 보는 것을 추천합니다.

## 3. Nodejs.app 설치

Nodejs와 npm을 설치합니다. 지원하는 플랫폼과 디펜던시를 확인하기 위해서는, [tfjs-node 설치가이드](https://github.com/tensorflow/tfjs-node/blob/master/README.md)를 참고해주세요.

Nodejs app을 설치하기 위한`./baseball` 폴더를 만듭니다. 이 두개의 링크 [package.json](https://github.com/tensorflow/tfjs-examples/blob/master/baseball-node/package.json) [webpack.config.js](https://github.com/tensorflow/tfjs-examples/blob/master/baseball-node/webpack.config.js) 를 다운받고 해당 폴더에 복사하여
npm package dependency를 설정해주세요. 그리고 `npm install` 명령어를 이용하여 디펜던시를 설치합니다.

> tfjs-node의 링크가 [여기](https://github.com/tensorflow/tfjs/tree/master/tfjs-node) 로 변경되었습니다.

```shell
$ cd baseball
$ ls
package.json  webpack.config.js
$ npm install
...
$ ls
node_modules  package.json  package-lock.json  webpack.config.js
```

이제 코드를 작성하고 모델을 훈련시킬 준비가 되었습니다.

## 4. 학습/테스트용 데이터 설치하기

아래 하단에 있는 두 링크의 데이터를 활용해 학습과 테스트를 할 거십니다. 두 파일을 다운받아서 살펴보세요.

[pitch_type_training_data.csv](https://storage.googleapis.com/mlb-pitch-data/pitch_type_training_data.csv)

[https://storage.googleapis.com/mlb-pitch-data/pitch_type_test_data.csv](https://storage.googleapis.com/mlb-pitch-data/pitch_type_test_data.csv)

학습용 데이터를 살펴봅시다.

```csv
vx0,vy0,vz0,ax,ay,az,start_speed,left_handed_pitcher,pitch_code
7.69914900671662,-132.225686405648,-6.58357157666866,-22.5082591074995,28.3119270826735,-16.5850095967027,91.1,0,0
6.68052308575228,-134.215511616881,-6.35565979491619,-19.6602769147989,26.7031848314466,-14.3430602022656,92.4,0,0
2.56546504690782,-135.398673977074,-2.91657310799559,-14.7849950586111,27.8083916890792,-21.5737737390901,93.1,0,0
```

이 데이터에는 8개의 정보가 있습니다.

- 공의 속도 (vx0, vy0, vz0)
- 공의 가속 (ax, ay, az)
- 시구 속도 (starting speed of pitch) (이게 정확한 번역이 맞나...)
- 투수가 좌투인지 여부

그리고 결과 정보엔 아래와 같이 나옵니다.

- 7개의 구질 중 하나의 값

```
Fastball (2-seam), Fastball (4-seam), Fastball (sinker), Fastball (cutter), Slider, Changeup, Curveball
```

우리의 목표는 주어진 투구 센서 데이터로 어떤 구질인지 맞추는 모델을 만드는 것입니다.

모델을 만들기전에, 학습 데이터와 테스트 데이터를 준비해야 합니다. `./baseball` 에 `pitch_type.js` 파일을 생성한 후, 아래의 코드를 복사해서 넣어주셋요. 이 코드는 [tf.data.csv](https://js.tensorflow.org/api/latest/#data.csv)를 활용하여 데이터를 로딩합니다. 또한 데이터를 min-maxn normalization을 통해 정규화합니다. (항상 하기를 추천합니다)

```javascript
const tf = require("@tensorflow/tfjs")

// 주어진 값 사이로 정규화 하는 함수
function normalize(value, min, max) {
  if (min === undefined || max === undefined) {
    return value
  }
  return (value - min) / (max - min)
}

// 데이터는 URL또는 로컬 파일로 로딩가능
const TRAIN_DATA_PATH =
  "https://storage.googleapis.com/mlb-pitch-data/pitch_type_training_data.csv"
const TEST_DATA_PATH =
  "https://storage.googleapis.com/mlb-pitch-data/pitch_type_test_data.csv"

// 데이터 학습을 위한 상수
const VX0_MIN = -18.885
const VX0_MAX = 18.065
const VY0_MIN = -152.463
const VY0_MAX = -86.374
const VZ0_MIN = -15.5146078412997
const VZ0_MAX = 9.974
const AX_MIN = -48.0287647107959
const AX_MAX = 30.592
const AY_MIN = 9.397
const AY_MAX = 49.18
const AZ_MIN = -49.339
const AZ_MAX = 2.95522851438373
const START_SPEED_MIN = 59
const START_SPEED_MAX = 104.4

const NUM_PITCH_CLASSES = 7
const TRAINING_DATA_LENGTH = 7000
const TEST_DATA_LENGTH = 700

// csv 데이터를 features와 labels로 변환함
// 각 feature 필드는 위에서 선언한 상수를 기반으로 정규화 됨
const csvTransform = ({ xs, ys }) => {
  const values = [
    normalize(xs.vx0, VX0_MIN, VX0_MAX),
    normalize(xs.vy0, VY0_MIN, VY0_MAX),
    normalize(xs.vz0, VZ0_MIN, VZ0_MAX),
    normalize(xs.ax, AX_MIN, AX_MAX),
    normalize(xs.ay, AY_MIN, AY_MAX),
    normalize(xs.az, AZ_MIN, AZ_MAX),
    normalize(xs.start_speed, START_SPEED_MIN, START_SPEED_MAX),
    xs.left_handed_pitcher,
  ]
  return { xs: values, ys: ys.pitch_code }
}

const trainingData = tf.data
  .csv(TRAIN_DATA_PATH, { columnConfigs: { pitch_code: { isLabel: true } } })
  .map(csvTransform)
  .shuffle(TRAINING_DATA_LENGTH)
  .batch(100)

// evaluation을 위해 학습용 데이터를 한 배치로 모두 로딩함
const trainingValidationData = tf.data
  .csv(TRAIN_DATA_PATH, { columnConfigs: { pitch_code: { isLabel: true } } })
  .map(csvTransform)
  .batch(TRAINING_DATA_LENGTH)

// evaluation을 위해 테스트용 데이터를 한 배치로 모두 로딩함
const testValidationData = tf.data
  .csv(TEST_DATA_PATH, { columnConfigs: { pitch_code: { isLabel: true } } })
  .map(csvTransform)
  .batch(TEST_DATA_LENGTH)
```

## 5. 구질을 구별하는 모델 만들기

이제 모델을 만들 준비를 마쳤습니다. [tf.layers](https://js.tensorflow.org/api/latest/#layers.dense)를 활용하여 input 데이터 (8개의 array로 이루어진)를 ReLU를 활성화 유닛으로 구성된 3개의 hidden fully-connected 레이어를 활용하여 연결하고, 이어서 7개의 유닛으로 구성된 1개의 softmax 출력 레이어를 활용하여 각 구질 유형 중 하나를 나타내도록 합니다.

모델을 학습 할 때는 adam 옵티마이저를 활용하고, 손실함수로는 sparseCategoricalCrossentroy를 활용합니다. 이러한 선택의 이유가 궁금하다면, [모델 훈련 가이드](https://www.tensorflow.org/js/guide/train_models)를 참고하세요.

아래의 코드를 `pitch_type.js`에 추가해주세요.

```javascript
const model = tf.sequential()
model.add(tf.layers.dense({ units: 250, activation: "relu", inputShape: [8] }))
model.add(tf.layers.dense({ units: 175, activation: "relu" }))
model.add(tf.layers.dense({ units: 150, activation: "relu" }))
model.add(tf.layers.dense({ units: NUM_PITCH_CLASSES, activation: "softmax" }))

model.compile({
  optimizer: tf.train.adam(),
  loss: "sparseCategoricalCrossentropy",
  metrics: ["accuracy"],
})
```

학습을 메인서버에서 실행시키는 코드는 나중에 작성합니다.

`pitch_type.js`를 완성하기 위해, 검증 및 테스트 데이터 세트를 평가하고, 단일 표본의 구질을 예측하고, 정확도 메트릭을 계산하는 함수를 작성해봅시다. `pitch_type.js`의 끝에 아래의 코드를 추가해주세요.
\

```javascript
// 학습용 데이터에서 도출한 각 구질별 확률을 리턴합니다.
async function evaluate(useTestData) {
  let results = {}
  await trainingValidationData.forEachAsync(pitchTypeBatch => {
    const values = model.predict(pitchTypeBatch.xs).dataSync()
    const classSize = TRAINING_DATA_LENGTH / NUM_PITCH_CLASSES
    for (let i = 0; i < NUM_PITCH_CLASSES; i++) {
      results[pitchFromClassNum(i)] = {
        training: calcPitchClassEval(i, classSize, values),
      }
    }
  })

  if (useTestData) {
    await testValidationData.forEachAsync(pitchTypeBatch => {
      const values = model.predict(pitchTypeBatch.xs).dataSync()
      const classSize = TEST_DATA_LENGTH / NUM_PITCH_CLASSES
      for (let i = 0; i < NUM_PITCH_CLASSES; i++) {
        results[pitchFromClassNum(i)].validation = calcPitchClassEval(
          i,
          classSize,
          values
        )
      }
    })
  }
  return results
}

async function predictSample(sample) {
  let result = model.predict(tf.tensor(sample, [1, sample.length])).arraySync()
  var maxValue = 0
  var predictedPitch = 7
  for (var i = 0; i < NUM_PITCH_CLASSES; i++) {
    if (result[0][i] > maxValue) {
      predictedPitch = i
      maxValue = result[0][i]
    }
  }
  return pitchFromClassNum(predictedPitch)
}

// 각 구질을 예측한 것에 대해서 정확도를 계산합니다.
function calcPitchClassEval(pitchIndex, classSize, values) {
  // 결과는 7개의 서로다른 구질로 구성되어 있습니다.
  let index = pitchIndex * classSize * NUM_PITCH_CLASSES + pitchIndex
  let total = 0
  for (let i = 0; i < classSize; i++) {
    total += values[index]
    index += NUM_PITCH_CLASSES
  }
  return total / classSize
}

// Returns the string value for Baseball pitch labels
function pitchFromClassNum(classNum) {
  switch (classNum) {
    case 0:
      return "Fastball (2-seam)"
    case 1:
      return "Fastball (4-seam)"
    case 2:
      return "Fastball (sinker)"
    case 3:
      return "Fastball (cutter)"
    case 4:
      return "Slider"
    case 5:
      return "Changeup"
    case 6:
      return "Curveball"
    default:
      return "Unknown"
  }
}

module.exports = {
  evaluate,
  model,
  pitchFromClassNum,
  predictSample,
  testValidationData,
  trainingData,
  TEST_DATA_LENGTH,
}
```

🚧작성중🚧
