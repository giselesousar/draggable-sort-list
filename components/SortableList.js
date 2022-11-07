import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  scrollTo,
  withTiming,
  useSharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';

const Item = ({
  children,
  positions,
  id,
  scrollView,
  scrollY,
  rowSize,
  onDragEnd,
}) => {
  const containerHeight = Dimensions.get('window').height;
  const contentHeight = Object.keys(positions.value).length * rowSize;
  const isLongPressed = useSharedValue(false);
  const ctxY = useSharedValue(0);

  const position = positions.value[id] * rowSize;
  const translateY = useSharedValue(position);

  useAnimatedReaction(
    () => positions.value[id],
    () => {
      if (!isLongPressed.value) {
        const pos = positions.value[id] * rowSize;
        translateY.value = withTiming(pos, {
          easing: Easing.inOut(Easing.ease),
          duration: 350,
        });
      }
    },
  );

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: rowSize,
    transform: [{translateY: translateY.value}],
    ...(isLongPressed.value ? {zIndex: 100} : null),
  }));

  const longPress = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      isLongPressed.value = true;
    });

  const panGesture = Gesture.Pan()
    .manualActivation(true)
    .onStart(() => {
      ctxY.value = translateY.value;
    })
    .onTouchesMove((_, stateManager) => {
      if (isLongPressed.value) {
        stateManager.activate();
      } else {
        stateManager.fail();
      }
    })
    .onEnd(() => {
      isLongPressed.value = false;
      const newPosition = positions.value[id] * rowSize;
      runOnJS(onDragEnd)(positions.value);
      translateY.value = withTiming(newPosition, {
        easing: Easing.inOut(Easing.ease),
        duration: 350,
      });
    })
    .onUpdate(({translationY}) => {
      translateY.value = ctxY.value + translationY;
      const newOrder = ~~(translateY.value / rowSize);
      const oldOlder = positions.value[id];
      if (newOrder !== oldOlder) {
        const idToSwap = Object.keys(positions.value).find(
          key => positions.value[key] === newOrder,
        );
        if (idToSwap) {
          const newPositions = JSON.parse(JSON.stringify(positions.value));
          newPositions[id] = newOrder;
          newPositions[idToSwap] = oldOlder;
          positions.value = newPositions;
        }
      }

      const lowerBound = scrollY.value;
      const upperBound = lowerBound + containerHeight;
      const maxScroll = contentHeight - containerHeight;
      const leftToScrollDown = maxScroll - scrollY.value;
      if (translateY.value < lowerBound) {
        const diff = Math.min(lowerBound - translateY.value, lowerBound);
        scrollY.value -= diff;
        scrollTo(scrollView, 0, scrollY.value, false);
        ctxY.value -= diff;
        translateY.value = ctxY.value + translationY;
      }
      if (translateY.value > upperBound) {
        const diff = Math.min(translateY.value - upperBound, leftToScrollDown);
        scrollY.value += diff;
        scrollTo(scrollView, 0, scrollY.value, false);
        ctxY.value += diff;
        translateY.value = ctxY.value + translationY;
      }
    });

  const composed = Gesture.Simultaneous(longPress, panGesture);

  return (
    <Animated.View style={style}>
      <GestureDetector gesture={composed}>
        <Animated.View style={{flex: 1}}>{children}</Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

export default function SortableList({children, style, rowSize, onDragEnd}) {
  const scrollY = useSharedValue(0);
  const scrollView = useAnimatedRef();
  const positions = useSharedValue(
    Object.assign(
      {},
      ...children.map(child => ({[child.props.id]: child.props.order})),
    ),
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: ({contentOffset: {y}}) => {
      scrollY.value = y;
    },
  });

  useEffect(() => {
    positions.value = Object.assign(
      {},
      ...children.map(child => ({[child.props.id]: child.props.order})),
    );
  }, [children]);

  return (
    <Animated.ScrollView
      ref={scrollView}
      onScroll={onScroll}
      contentContainerStyle={[
        style,
        {
          height: children.length * rowSize,
        },
      ]}
      showsVerticalScrollIndicator={false}
      bounces={false}
      scrollEventThrottle={16}>
      {children.map(child => (
        <Item
          key={child.props.id}
          positions={positions}
          id={child.props.id}
          scrollView={scrollView}
          scrollY={scrollY}
          rowSize={rowSize}
          onDragEnd={onDragEnd}>
          {child}
        </Item>
      ))}
    </Animated.ScrollView>
  );
}
