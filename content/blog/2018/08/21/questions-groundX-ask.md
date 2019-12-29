---
title: "그라운드X 가 던진 채용을 위해 던진 질문들"
date: 2018-08-21 03:00:00
layout: post
tags: [blockchain]
published: false
---

[출처](https://careers.kakao.com/jobs/S-420?keyword=ground&page=1)

## 이더리움 트랜잭션 데이터에 포함되어 있는 nonce는 무엇이고 왜 필요한가요?

[출처: stackoverflow 1](https://ethereum.stackexchange.com/questions/27432/what-is-nonce-in-ethereum-how-does-it-prevent-double-spending)
[출처: stackoverflow 2](https://ethereum.stackexchange.com/questions/1172/how-does-the-ethereum-eth-accounting-system-work-and-prevent-double-spends)
[출처: Ethereum Github](https://github.com/ethereum/wiki/wiki/Glossary)

- Account nonce: 각 어카운트에 있는 트랜잭션 카운터. 이는 거래 전송시 발생할 수 있는 리플레이 어택(중복 출금 공격) 을 방지 해준다. (예: A의 20개의 이더리움 코인이 B에게 반복적으로 이체 되면서 A의 잔고가 계속 빠져나가는 현상) 

> a transaction counter in each account. This prevents replay attacks where a transaction sending eg. 20 coins from A to B can be replayed by B over and over to continually drain A's balance.

> 다음과 같은 사황을 가정해보자. A는 총 1이더를 가지고 있고, B에게 1 이더를 보내려고 한다. 이 거래는 A0라고 불리는데 여기서 A는 사인한 사람, 그리고 0은 account nonce다. 근데 A가 만약 이 1 이더를 다른 사람에게 보내려고 한다면, 여기서 NONCE가 카운터처럼 증가하여 A1이 될것이다. 그리고 A1은 즉각 거부된다. 그 이유는 A1는 A0다음에 와야 하는데, A0를 실행 한 뒤에 는 A1을 실행할 잔고가 A에게 없기 때문이다.
 
- Proof of work nonce: 작업 증명 조건을 만족 시키기 위해 조정하라 수 있는 블록에 있는 무의미한 값 
  
> a meaningless value in a block which can be adjusted in order to try to satisfy the proof of work condition

## 블록체인에서 Finality란 무엇인가요? 그리고 Finality가 왜 중요한가요?

Finality란 과거 거래가 절대로 변할 수 없다는 것을 보장하는 것, 즉 블록체인에서 가장 긴 체인의 완전성을 보장하는 것이다.

## UTXO 기반의 블록체인과 어카운트 기반의 블록체인은 어떻게 다른가요? 

## UTXO 기반의 블록체인이 어카운트 기반의 블록체인과 비교했을 때 가지는 장점은 무엇인가? 

## 어카운트 기반 블록체인의 장점은 무엇인가요?

## 비트코인에서 사용하는 머클 트리와 이더리움에서 사용하는 머클 패트리샤 트리의 차이점은 무엇이고, 왜 다른 자료구조를 사용할까요?

## 대용량의 traffic을 처리하는 P2P 네트워크를 구성할 때 고려해야 하는 사항과 구현상의 어려움은 무엇이 있을까요?

## 이더리움 트랜잭션 데이터에 포함되어 있는 nonce는 무엇이고 왜 필요한가요?

## EVM이란 무엇인가요? 왜 필요한가요? 장단점은 무엇인가요?

## PoW, PBFT, DPOS에 대해서 원리를 설명하고 각 장단점은 무엇일까요?

## 블록체인은 검열(censorship)로부터 안전한가요? 블록체인에서 발생할 수 있는 검열은 어떤 것인가요?

## Permissioned network와 permissionless network란 무엇인가요? 그리고 어느 경우에 각각이 필요할까요?

## 블록체인의 성능 문제란 무엇인가? 블록체인의 성능을 개선하기 위해서 무엇을 할 수 있을까요?

## 블록체인에서 Finality란 무엇인가요? 그리고 Finality가 왜 중요한가요?

## 블록체인은 확장성에 문제가 있는지 있다면 어떻게 해결할 수 있을까요?

## P2P 네트워크 노드 간 데이터를 공유한 사실을 cryptographic 하게 증명할 수 있는가요?

## On-chain governance와 Off-chain governance 의 예를 들고 예상되는 장/단점은 무엇일까요?

## 인터체인/사이드체인이란 무엇이고 어떤 특징을 가지고 있나요?

## 비트코인에서 사용하는 머클 트리와 이더리움에서 사용하는 머클 패트리샤 트리의 차이점은 무엇이고, 왜 다른 자료구조를 사용할까요?

## 블록체인에서 TPS가 늘어나면 문제점들은 무엇이 있을까? 이 문제에 대한 생각하신 솔루션이 있는가요?