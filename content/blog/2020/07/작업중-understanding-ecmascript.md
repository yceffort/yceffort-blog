---
title: "ECMAScript 스펙 이해하기 (1)"
tags: [javascript, web]
published: false
date: 2020-07-04 18:23:12
---

[Understanding the ECMAScript spec, part 1](https://v8.dev/blog/understanding-ecmascript-part-1)을 번역했습니다. 

```toc
tight: true,
from-heading: 2
to-heading: 3
```

## 서문

자바스크립트에 대해 어느 정도 알고 있다고 하더라도, [ECMAScript 언어 명세 또는 ECMAScript spec 요약](https://tc39.es/ecma262/)을 읽는 것은 꽤 부담스러운 일이다. 적어도 나는 처음에 그럤다.

구체적인 예시에서 시작해서 스펙을 이해하도록 하자. 다음 코드는 [Object.prototype.hasOwnProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)의 사용을 보여준다.

```javascript
const o = { foo: 1 };
o.hasOwnProperty('foo'); // true
o.hasOwnProperty('bar'); // false
```

위 예제에서는 `o` 객체가 `hasOwnProperty`라는 프로퍼티를 가지고 있지 않다. 여기에서 prototype 체인을 통해서 찾게 된다. 여기에서 `o`의 프로토타입은 `object.prototype`임을 알 수 있다.

`Object.prototype.hasOwnproperty`가 어떻게 동작하는지 의사 코드를 작성해서 알아보자.

```
[object.prototype.hasownproperty](https://tc39.es/ecma262/#sec-object.prototype.hasownproperty)

`hasOwnProperty`가 `v`라는 인수와 함께 실행된다면, 아래와 같은 절차를 거치게 된다.

1. Let P be ? ToPropertyKey(V).
2. Let O be ? ToObject(this value).
3. Return ? HasOwnProperty(O, P).
```

그리고

```
[HasOwnProeprty(O, P)](https://tc39.es/ecma262#sec-hasownproperty)

abstract operation인 HasOwnProperty 는 Object가 명시된 속성 키를 가지고 있는지를 반환한다. 여기에서는 boolean이 리턴된다. 이 동작은 O, P와 함께 수행되는데, O는 객체, 그리고 P는 속성 키 값이다. 이 abstract operation은 다음 절차를 거친다.

1. Assert: Type(O) is Object.
2. Assert: IsPropertyKey(P) is true.
3. Let desc be ? O.[[GetOwnProperty]](P).
4. If desc is undefined, return false.
5. Return true.
```

`abstract operation`는 무엇일까? `[[]]` 안에 있는 것은 무엇을 의미하는 것일까? 함수 앞에 `a ? `는 무엇일까? `assert`의 의미는 무엇일까?

## 언어의 타입과 명세의 타입

익숙한 것 부터 알아가자. `undefined`, `true` `false`는 이미 자바스크립트로에서 이미 보던 것이다. 이들은 모두 [language value](https://tc39.es/ecma262/#sec-ecmascript-language-types) 이며, 언어 타입의 값 (values of language types) 이며 이는 스펙에도 명시되어 있다.

스펙에서 내부에서도 `language values`를 사용한다. 예를 들어, 내부 데이터 타입은 필드를 가지고 있으며, 이에 가능한 값으로 `true`와 `false`를 정해 둔다. 반대로 자바스크립트 엔진은 일반적으로, 내부에 language values를 사용하지 않는다. 예를 들어 자바스크립트 엔진이 C++로 쓰여진 경우, 일반적으로 C++의 참과 거짓을 사용한다. (이는 자바스크립트 내부에서 정의한 true false가 아닌, C++의 true false 다.)

언어의 타입 외에도, 스펙은 명세의 타입도 사용한다. 그러나 자바스크립트에서는 이를 사용하지 않는다. 자바스크립트 엔진은 이 것들을 구현할 필요가 없다. 이 글에서는, Record라고 하는 명세 타입에 대해서 알게 될 것이다.

## Abstract Operation

[Abstract Operation](https://tc39.es/ecma262/#sec-abstract-operations)이란 ECMA 스펙에서 정의한 함수다. 이들은 명세를 간결하게 작성할 목적으로 정의된다. 자바스크립트 엔진은 엔진 내부에 이들을 별도의 기능으로 구현할 필요가 없다. 이것들은 자바스크립트에서 직접 호출될 수 없다.

## 인터널 슬롯과 인터널 메소드