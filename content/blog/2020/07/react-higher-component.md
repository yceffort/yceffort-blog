---
title: "리액트 고차 컴포넌트 (React Higher Order Component)"
tags: [javascript, react]
published: true
date: 2020-07-03 19:06:10
---

[이 글](https://ko.reactjs.org/docs/higher-order-components.html)이 한글로 번역이 안되있어서 대충 번역해봅니다.

# Higher-Order Components

고차 컴포넌트 (이하 HOC)는 리액트에서 컴포넌트 로직을 재사용하기 위한 고오급 기술이다. HOC는 리액트 API의 일부분은 아니다. 이는 리액트의 컴포넌트 환경에서 자주 나타나는 일종의 패턴이다.

구체적으로, **HOC는 컴포넌트를 받아 새로운 컴포넌트를 반환하는 함수다**

```javascript
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

컴포넌트의 props가 ui를 바꾼다면, HOC는 컴포넌트를 다른 컴포넌트로 바꿔버린다.

이러한 HOC는 리액트 써드 파티 라이브러리에서 자주사용되는 패턴으로, Redux의 `connect`와 `Relay`의 `createFragmentContainer`에서 볼 수 있다. 

이 문서에서는 왜 HOC패턴이 유용한지, 그리고 어떻게 작성하는지 살펴본다.

## 공통적인 문제를 해결하기 위해 사용하는 HOC

컴포넌트는 리액트 내에서 코드를 재사용할 수 있는 가장 기본적인 유닛이다. 그러나, 일부 패턴은 이러한 전톡적인 컴포넌트로 해결할 수 없다는 것을 알게 된다.

예를 들어, 외부에서 데이터를 받아서 목록을 보여주는 `CommentList`라는 컴포넌트가 아래처럼 있다고 가정해보자.

```javascript
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" is some global data source
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Subscribe to changes
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Clean up listener
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Update component state whenever the data source changes
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

그리고 비슷한 패턴으로 블로그 포스트 하나를 보여주는 컴포넌트가 있다고 가정하자.

```javascript
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList`와 `BlogPost`는 동일하지 않다. 이 두 컴포넌트는 서로 다른 메소드에서 `DataSource`를 참조하고 있으며, 서로 다른 결과물을 렌더링한다. 하지만 이들은 공통적으로 구현할 수 있는게 있다.

- mount 시점에, DataSource에 `changeListener`를 단다
- 리스너 내부에서 변경된 데이터에 따라 `setState`를 호출한다.
- unmount 시점에 해당 listener를 해제한다.

만약 이 앱의 크기가 커진다면, 이와 비슷한 패턴이 반복해서 나타날 것이다. 우리는 여기서 이러한 로직을 추상화하여 한 요소에 두고, 서로다른 컴포넌트에서 사용하게 할 수 있다. 이것이 바로 HOC 컴포넌트의 기본 개념이다.

우리는 `CommentList`나 `BlogPost`등의 컴포넌트를 만드는 함수를 만들어, 여기에 공통적으로 `DataSource`를 달아 줄 수 있다. 이 함수는 자식 함수 하나를 argument로 넘겨 받아서, 넘겨받은 데이터를 prop으로 넘길 수 있다. 이러한 함수를 `withSubscription`이라고 해보자.

```javascript
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

첫번째 파라미터는 컴포넌트고, 두번째 파라미터는 데이터를 받아올 `DataSource`다.

`CommentListWithSubscription`와 `BlogPostWithSubscription`가 렌더링되면, `CommentList`와 `BlogPost`는 `DataSource`로 부터 받은 데이터를 prop으로 넘기게 된다.

```javascript
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

HOC는 파라미터로 넘어온 컴포넌트를 수정하지도, 복제하지도 않는 다는 것을 염두해 두어야 한다. 그 대신, HOC는 단순히 넘겨 받은 컴포넌트를 감싸는 역할을 하는 것이다. HOC는 순수 함수이며, 어떠한 부수효과도 만들지 않는다.

이게 끝이다. 감싸진 컴포넌트는 모든 props를 넘겨 받을 것이며, 새롭게 받은 prop, `data`를 바탕으로 결과물을 그릴 것이다. HOC는 이 데이터가 어떻게 왜 쓰이는지는 관여하지 않으며, 감싼 컴포넌트도 마찬가지로 이러한 데이터가 어디서 오는지 신경쓰지 않는다.

`withSubscription`은 단지 일반적인 함수이므로, 여기에 많은 arguments를 추가할 수 있다. 예를 들어, `data` prop를 설정가능하게 만들고 싶다면, 또다른 HOC를 만들어서 감쌀 수 있다. 또는 새로운 argument를 받아서 `shouldComponentUpdate`에서 수정할 수도 있다. 이는 모두 HOC가 컴포넌트가 어떻게 제어되는지 전체적으로 관리할 수 있기 때문에 가능하다.

컴포넌트와 마찬가지로, `withSubscription`와 감싸진 컴포넌트는 완전히 `prop`을 기반으로 움직인다. 이는 동일한 `prop`을 사용하는 다른 HOC로 교체하기 용이하게 만든다. 이는 데이터를 fetch하는 라이브러리 등을 바꿀때 유용하게 사용할 수 있다.

## 원본 컴포넌트를 바꾸지마라, 대신 Composition을 사용하라.