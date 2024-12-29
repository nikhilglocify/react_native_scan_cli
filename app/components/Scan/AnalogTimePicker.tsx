import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

const AnalogTimePicker = () => {
  const [time, setTime] = useState(new Date());

  const handleTimeSelect = (hour: number, minute: number) => {
    const selectedTime = new Date();
    selectedTime.setHours(hour, minute, 0);
    setTime(selectedTime);
  };

  const get12HourFormat = (date: Date) => date.getHours() % 12 || 12;
  const getAmPm = (date: Date) => (date.getHours() >= 12 ? 'PM' : 'AM');

  return (
    <View style={styles.container}>
      {/* Time Display */}
      <View style={styles.timeDisplayContainer}>
        <TimeDisplay
          label="Hour"
          value={get12HourFormat(time)}
          color="#8C46A9"
        />
        <TimeDisplay
          label="Min"
          value={time.getMinutes()}
          color="#8C46A9"
        />
        <TimeDisplay
          label={getAmPm(time)}
          value={getAmPm(time)}
          color="#8C46A9"
        />
      </View>

      {/* Analog Clock */}
      <AnalogClock
        initialTime={time}
        onTimeSelect={handleTimeSelect}
      />
    </View>
  );
};

const TimeDisplay = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) => (
  <View style={[styles.timeDisplay, { borderColor: `${color}/15` }]}>
    <Text style={[styles.timeValue, { color }]}>{value}</Text>
    <View style={styles.separator}></View>
    <Text style={styles.timeLabel}>{label}</Text>
  </View>
);

const AnalogClock = ({
  initialTime,
  onTimeSelect,
}: {
  initialTime: Date;
  onTimeSelect: (hour: number, minute: number) => void;
}) => {
  const [selectedHour, setSelectedHour] = useState(
    initialTime.getHours() % 12 || 12
  );
  const [selectedMinute, setSelectedMinute] = useState(initialTime.getMinutes());
  const center = { x: 150, y: 150 }; // Center of the clock

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const { dx, dy } = gestureState;

        // Calculate the angle and convert to time
        const angle = Math.atan2(dy, dx);
        const degree = (angle * 180) / Math.PI + 90; // Convert to degrees
        const adjustedDegree = degree < 0 ? degree + 360 : degree;

        if (gestureState.dx ** 2 + gestureState.dy ** 2 > 6400) {
          // Adjust for hour (shorter radius detection)
          const hour = Math.round((adjustedDegree / 360) * 12) % 12 || 12;
          setSelectedHour(hour);
          onTimeSelect(hour, selectedMinute);
        } else {
          // Adjust for minute (larger radius detection)
          const minute = Math.round((adjustedDegree / 360) * 60) % 60;
          setSelectedMinute(minute);
          onTimeSelect(selectedHour, minute);
        }
      },
    })
  ).current;

  return (
    <View {...panResponder.panHandlers}>
      <Svg width="300" height="300" viewBox="0 0 300 300">
        <Circle
          cx="150"
          cy="150"
          r="140"
          stroke="#8C46A9"
          strokeWidth="2"
          fill="none"
        />
        {/* Clock numbers */}
        {[...Array(12)].map((_, index) => {
          const angle = (index * Math.PI) / 6;
          const x = 150 + 120 * Math.sin(angle);
          const y = 150 - 120 * Math.cos(angle);
          return (
            <SvgText
              key={index}
              x={x}
              y={y}
              fontSize="14"
              textAnchor="middle"
              fill="#8C46A9"
            >
              {index === 0 ? 12 : index}
            </SvgText>
          );
        })}
        {/* Clock hands */}
        <Line
          x1="150"
          y1="150"
          x2={150 + 80 * Math.sin((selectedHour * Math.PI) / 6)}
          y2={150 - 80 * Math.cos((selectedHour * Math.PI) / 6)}
          stroke="#8C46A9"
          strokeWidth="3"
        />
        <Line
          x1="150"
          y1="150"
          x2={150 + 100 * Math.sin((selectedMinute * Math.PI) / 30)}
          y2={150 - 100 * Math.cos((selectedMinute * Math.PI) / 30)}
          stroke="#8C46A9"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeDisplay: {
    borderWidth: 1.5,
    borderRadius: 10,
    minWidth: 63,
    minHeight: 84,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#8C46A9',
    width: '80%',
    marginVertical: 5,
  },
  timeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#535353',
  },
});

export default AnalogTimePicker;
