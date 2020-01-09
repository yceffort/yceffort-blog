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

## 3. Load the Data

본 튜토리얼에서는 아래 이미지의 숫자를 인식하는 방법을 학습하기 위한 모델을 만들어 볼 것입니다. 여기에서 말하는 이미지는 28x28px 사이즈의 흑백이미지이며, [MNIST](http://yann.lecun.com/exdb/mnist/)라고 불리웁니다.

![MNIST](https://codelabs.developers.google.com/codelabs/tfjs-training-classfication/img/19dce81db67e1136.png)

이 이미지들로 부터 만든 [sprite file](https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png)도 있습니다.

`data.js`를 통해서 어떻게 데이터가 로딩되는지 확인해보세요. 이 튜토리얼을 한번 하고 나면, 스스로 데이터를 로딩하는 스크립트를 만들어보는 것도 좋습니다.

위 파일에는 `MnistData` 클래스가 있으며, 두 개의 public methods가 있습니다.

- `nextTrainBatch(batchSize)`: 무작위 배치 이미지와 라벨을 학습용 세트에서 리턴합니다.
- `nextTestBatch(batchSize)`: 무작위 배치 이미지와 라벨을 테스트용 세트에서 리턴합니다.

MnistData 클래스는 또한 데이터를 섞고 정규화하는 중요한 일도 담당합니다.

여기에는 65,000개의 이미지가 있으며, 55,000개의 이미지는 학습용으로 사용하고, 10,000개의 이미지는 나중에 모델의 성능을 측정하기 위한 테스트용으로 둘 것입니다. 그리고 이러한 모든 것들이 브라우저에서 이루어집니다.

> 만약 Node.js가 익숙하시다면, 파일시스템에서 바로 이미지를 로딩해서, 픽셀데이터를 얻기 위한 native image processing을 활용해도 됩니다.

데이터를 로딩해보고, 테스트 해서 한번 제대로 되는지 확인해 봅시다.

```javascript
import { MnistData } from "./data.js"

async function showExamples(data) {
  // Create a container in the visor
  const surface = tfvis
    .visor()
    .surface({ name: "Input Data Examples", tab: "Input Data" })

  // Get the examples
  const examples = data.nextTestBatch(20)
  const numExamples = examples.xs.shape[0]

  // Create a canvas element to render each example
  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      // Reshape the image to 28x28 px
      return examples.xs
        .slice([i, 0], [1, examples.xs.shape[1]])
        .reshape([28, 28, 1])
    })

    const canvas = document.createElement("canvas")
    canvas.width = 28
    canvas.height = 28
    canvas.style = "margin: 4px;"
    await tf.browser.toPixels(imageTensor, canvas)
    surface.drawArea.appendChild(canvas)

    imageTensor.dispose()
  }
}

async function run() {
  const data = new MnistData()
  await data.load()
  await showExamples(data)
}

document.addEventListener("DOMContentLoaded", run)
```

페이지를 새로고침하면, 몇 초 뒤에 이미지가 있는 패널이 나타날 것입니다.

![](https://codelabs.developers.google.com/codelabs/tfjs-training-classfication/img/b675d1a8c09ddf78.png)

## 4. 작업의 개념화

우리의 Input 데이터는 아래와 같을 것 입니다.

![](https://codelabs.developers.google.com/codelabs/tfjs-training-classfication/img/b675d1a8c09ddf78.png)

우리의 목표는 학습된 모델이 이미지 하나를 받으면, 그 이미지가 0~9사이의 숫자중 어떤 숫자에 가장 가까운지 각각 점수를 매겨서 예측하는 것입니다.

각각의 이이미지는 28\*28 크기이며, color channel은 1입니다. (흑백) 따라서, 이미지의 형태를 데이터로 나타내면 `[28, 28, 1]`입니다.

하나의 이미지를 10개의 값으로 매핑하는 작업이라는점, 그리고 이미지의 데이터 형태를 명심하고 다음 섹션으로 넘어가겠습니다.

## 5. 모델 아키텍쳐 디자인

이 섹션에서는 모델 아키텍쳐를 묘사하는 코드를 작성할 것잉ㅂ니다. 모델 아키텍쳐란 "어떤 함수를 사용하여 모델이 실행되는 과정에서 학습하게 할것인지" 또는 "답을 계산하기 위하여 어떤 알고리즘을 모델에서 사용할 것인지" 를 간지나게 말하는 것입니다.

머신러닝에서, 아키텍쳐(알고리즘)을 정의할 것이고, 학습 과정에서 알고리즘의 파라미터를 학습하게 할 것입니다.

```javascript
function getModel() {
  const model = tf.sequential();

  const IMAGE_WIDTH = 28;
  const IMAGE_HEIGHT = 28;
  const IMAGE_CHANNELS = 1;

  // 첫번째 covolutional 신경망에서는 input 이미지의 형태를 넣어둔다.
  // 그 다음 합성곱 연산에 필요한 파라미터를 정의한다.
  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));


  // MaxPooling Layer는 평균값을 내는 것이 아니라, 영역의 최대값을 활용해서 다운샘플링을 진행한다.
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));


  // conv2d와 maxpooling을 반복한다.
  // 이 convolution에서 더 많은 필터가 있다는 것을 기억하자.
  model.add(tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

  // 2D형태의 필터를  1D 벡터 형태로 평평하게 하여, 마지막 layer에 인풋으로 넣을 수 있도록 한다.
  // 이는 고차원의 데이터를 마지막 분류 레이어에 전달할 때 하는 일반적인 과정이다.
  model.add(tf.layers.flatten());

  // 마지막 레이어는 10개의 값이 나오게 된다.
  // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9).
  const NUM_OUTPUT_CLASSES = 10;
  model.add(tf.layers.dense({
    units: NUM_OUTPUT_CLASSES,
    kernelInitializer: 'varianceScaling',
    activation: 'softmax'
  }));


  // optimizer, loss function, accuracy meetric을 고르고, 컴파일 후에 모델을 리턴한다.
  const optimizer = tf.train.adam();
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
```

### 합성곱

```javascript
model.add(
  tf.layers.conv2d({
    inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: "relu",
    kernelInitializer: "varianceScaling",
  })
)
```

여기에서는 sequential 모델을 사용한다.

우리는 dense layer 대시엔 `conv2d` layer를 사용한다. 여기에서는 합성곱이 어떻게 작동하는지까지 자세하게 설명할 수 없지만, 어떻게 작동하는지 설명해주는 좋은 아티클이 있습니다.

- [Image Kernels Explained Visually](http://setosa.io/ev/image-kernels/)
- [Convolutional Neural Network for Visual Recognition](http://cs231n.github.io/convolutional-networks/)

`conv2d` object를 구성하는 argument 들에 대해 하나씩 알아봅시다.

- `inputShape`: 모델의 첫번째 레이어에 들어가는 데이터의 형태입니다. 이번 예제에서는, 28\*28크기의 MNIST 흑백이미지를 사용하고 있습니다. 즉 `[row, column, depth]`, `[28, 28, 1]`로 넣을 수 있습니다. 가로 세로 각 28 픽셀이 자리잡고 있으며, color channel은 흑백이미지 이므로 1밖에 없습니다. 한가지 알아둬야 할 것은, input shape안에 batch size를 정의하지 않았다는 것입니다.
- `kernelSize`: input data에 적용할 합성곱 필터의 윈도우 크기 입니다. 여기에서는 5로 설정했기 때문에, 정사각형 형태의 5x5 합성곱 윈도우가 만들어집니다.
- `filters`: kernelSize에서 적용한 filter window의 개수입니다. 여기에서는 8로 설정했습니다.
- `strides`: 슬라이딩 윈도우의 step size 입니다. 이미지 위로 이동할 때마다 이동할 픽셀의 수를 의미합니다. 여기서 우리는 1을 지정하는데, 이는 필터가 1픽셀 단위로 이미지 위에서 이동한다는 것을 의미합니다.
- `activation`: 합성곱 연산이 끝난뒤에 적용할 [활성화 함수](https://developers.google.com/machine-learning/glossary/#activation_function)입니다. 여기에서는 머신러닝 모델에서 가장 흔히 사용되는 [ReLU](https://developers.google.com/machine-learning/glossary/#ReLU) 적용합니다.
- `kernelInitializer`: The method to use for randomly initializing the model weights, which is very important to training dynamics. We won't go into the details of initialization here, but VarianceScaling (used here) is generally a good initializer choice.

🚧 작성 중 🚧
