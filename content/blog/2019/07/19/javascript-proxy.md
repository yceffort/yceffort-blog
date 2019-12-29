---
title: "Javascript Proxy"
date: 2019-07-19 10:12:42
layout: post
tags: [javascript]
published: false
---

## Proxy

아래의 예제를 살펴보자.

```javascript
var obj = new Proxy(
  {},
  {
    get: function(target, key, receiver) {
      console.log(`getting ${key}!`);
      return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
      console.log(`setting ${key}!`);
      return Reflect.set(target, key, value, receiver);
    }
  }
);
```

```
> obj.count = 1;
    setting count!
> ++obj.count;
    getting count!
    setting count!
    2
```

`obj`에 `.`으로 접근하려는 시도가 중간에 가로채기 당했다.
