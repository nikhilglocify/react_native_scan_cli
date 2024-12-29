import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg'; // Text as SvgText for SVG

const AnalogTimePicker = () => {
  const [time, setTime] = useState(new Date());

  const get12HourFormat = (date: Date) => date.getHours() % 12 || 12;

  const getAmPm = (date: Date) => (date.getHours() >= 12 ? 'PM' : 'AM');

  const handleTimeSelect = (hour: number, minute: number) => {
    const selectedTime = new Date();
    selectedTime.setHours(hour, minute, 0);
    setTime(selectedTime);
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeDisplayContainer}>
        <TimeDisplay
          label="Hour"
          value={get12HourFormat(time)}
          color="#8C46A9"
        />
        <TimeDisplay label="Min" value={time.getMinutes()} color="#8C46A9" />
        <TimeDisplay label={getAmPm(time)} value={getAmPm(time)} color="#8C46A9" />
      </View>
      <AnalogClock
        onTimeSelect={handleTimeSelect}
        initialTime={time}
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
  onTimeSelect,
  initialTime,
}: {
  onTimeSelect: (hour: number, minute: number) => void;
  initialTime: Date;
}) => {
  const [selectedHour, setSelectedHour] = useState(
    initialTime.getHours() % 12 || 12
  );
  const [selectedMinute, setSelectedMinute] = useState(initialTime.getMinutes());

  const handleClockPress = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    onTimeSelect(hour, minute);
  };

  const createInteractiveCircles = (
    count: number,
    radius: number,
    isHour: boolean
  ) =>
    [...Array(count)].map((_, index) => {
      const angle = (index * 2 * Math.PI) / count;
      const x = 150 + radius * Math.sin(angle);
      const y = 150 - radius * Math.cos(angle);
      const value = isHour ? (index === 0 ? 12 : index) : index;
      return (
        <Circle
          key={index}
          cx={x}
          cy={y}
          r="10"
          fill="transparent"
          onPressIn={() =>
            isHour
              ? handleClockPress(value, selectedMinute)
              : handleClockPress(selectedHour, value)
          }
        />
      );
    });

  return (
    <Svg width="300" height="300" viewBox="0 0 300 300">
      <Circle cx="150" cy="150" r="140" stroke="#8C46A9" strokeWidth="2" fill="none" />
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
      {/* Interactable regions for hour selection */}
      {createInteractiveCircles(12, 120, true)}
      {/* Interactable regions for minute selection */}
      {createInteractiveCircles(60, 100, false)}
    </Svg>
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
