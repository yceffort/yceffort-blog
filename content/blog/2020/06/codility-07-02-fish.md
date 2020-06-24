---
title: "Codility - Fish"
tags: [algorithm, javascript]
published: true
date: 2020-06-25 03:25:19
---

## Fish

### 문제

길이 N으로 이루어진 비어있지 않은 배열 A, B가 주어진다. 배열 A는 물고기의 크기를, B는 물고기의 움직임을 나타내는데, 0일 경우 위로, 1일 경우 아래로 간다. 만약 두마리의 물고기가 만날 경우, 더 사이즈가 큰 물고기가 잡아먹어버린다. 이 때 살아남는 물고기의 수를 구하라.

```
A[0] = 4    B[0] = 0
A[1] = 3    B[1] = 1
A[2] = 2    B[2] = 0
A[3] = 1    B[3] = 0
A[4] = 5    B[4] = 0

0번 물고기는 위로 간다
1번 물고기는 밑으로 가는데, 2번 물고기는 위로 간다. 이 때 1번 물고기는 2번 물고기를 먹는다
마찬가지로 3번 물고기도 먹고, 
그러나 4번물고기는 5로 1번 물고기보다 덩치가 크므로 4번 물고기가 1번물고기를 먹는다

이때 그래서 살아남는 물고기는 2마리다.
```

### 풀이

```javascript
function solution(A, B) {
    
    // 하류로 가는 물고기를 쌓는 스택
    const stack = []
    let count = 0
    
    for (let i=0; i < A.length; i++) {
        // 물고기가 하류로 가면 그 물고기의 크기를 스택에 쌓는다
        if (B[i] === 1) {
            stack.push(A[i])
        } 
        // 물고기가 상류로 갈경우
        else {
            // 하류행 물고기가 있는지 계속해서 확인한다
            while (stack.length > 0) {
                // 하류행 물고기가 있으면 한마리 씩 맞짱 뜬다
                // 하류행 물고기가 더 크면 패배
                if (stack[stack.length - 1] > A[i]) {
                    break
                } 
                // 상류행 물고기가 더 크면 하류행 물고기 하나의 숨통을 끊는다
                else {
                    stack.pop()
                }
            }   
            
            // 그렇게 상류행 물고기를 다 이겨야 생존 카운트를 올릴 수 있다.
            if (stack.length === 0) {
                count += 1    
            }
        }
    }
    
    // 최종 생존 명단은 하류로 가는 물고기 중 살아남은 물고기 + 상류로 갔는데 살아남은 물고기다.
    return stack.length + count
}
```