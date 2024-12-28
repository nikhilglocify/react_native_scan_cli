import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { get12HourFormat, getAmPm } from '../../helpers/dateUtils';
import { fontFamily } from '../../constants/theme';

type CustomTimePickerProps = {
  // fontFamily: {
  //   nunitoBold: string;
  // };
  // get12HourFormat: (hours: number) => number;
  // getAmPm: (date: Date) => string;
  onTimeChange?: (time: Date) => void;
};

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({onTimeChange}) => {
  const [time, setTime] = useState<Date>(new Date());

  const handleHourChange = (hour: number) => {
    console.log("Running  handleHourChange",handleHourChange)
    const updatedTime = new Date(time);
    updatedTime.setHours(hour);
    setTime(updatedTime);
    if (onTimeChange) onTimeChange(updatedTime);
  };

  const handleMinuteChange = (minute: number) => {
    console.log("Running  handleMinuteChange",handleHourChange)
    const updatedTime = new Date(time);
    updatedTime.setMinutes(minute);
    setTime(updatedTime);
    if (onTimeChange) onTimeChange(updatedTime);
  };

  const handleAmPmToggle = () => {
    const updatedTime = new Date(time);
    const currentHours = time.getHours();
    updatedTime.setHours(currentHours >= 12 ? currentHours - 12 : currentHours + 12);
    setTime(updatedTime);
    // if (onTimeChange) onTimeChange(updatedTime);
  };

  const renderScrollOptions = (
    range: number[],
    selectedValue: number,
    onChange: (value: number) => void
  ) => {
    const itemHeight = 48; // Height of each item, adjust this as per your design
    const handleScrollEnd = (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / itemHeight);
      const selected = range[index];
      console.log("selected",selected)
      if (selected !== selectedValue) {
        onChange(selected);
      }
    };
  
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight} // Ensures smooth snapping to each item
        decelerationRate="fast"
        contentContainerStyle={styles.scrollViewContent}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {range.map((value) => (
          <Pressable key={value} onPress={() => onChange(value)}>
            <Text
              style={[
                styles.scrollOption,
                selectedValue === value && styles.selectedOption,
              ]}
            >
              {value}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <Pressable>
      <View className="flex items-center gap-3 justify-center flex-row">
        <View className="bg-[#8C46A9]/15 border-[1.5px] border-solid border-[#8C46A9]/15 rounded-lg min-w-[63px] min-h-[84px] max-h-[84px] text-center mx-auto">
          {renderScrollOptions(
            hours,
            get12HourFormat(time),
            handleHourChange
          )}
          <View className="border-b-[1.5px] border-solid border-[#8C46A9]/15"></View>
          <Text
            className="text-[15px] text-[#535353] font-semibold leading-[16.5px] text-center py-1.5"
            style={{ fontFamily: fontFamily.nunitoBold }}
          >
            Hour
          </Text>
        </View>

        <View className="bg-[#8C46A9]/15 border-[1.5px] border-solid border-[#8C46A9]/15 rounded-lg min-w-[63px] min-h-[84px] max-h-[84px] text-center mx-auto">
          {renderScrollOptions(
            minutes,
            time.getMinutes(),
            handleMinuteChange
          )}
          <View className="border-b-[1.5px] border-solid border-[#8C46A9]/15"></View>
          <Text
            className="text-[15px] text-[#535353] font-semibold leading-[16.5px] text-center py-1.5"
            style={{ fontFamily: fontFamily.nunitoBold }}
          >
            Min
          </Text>
        </View>

        <View className="bg-[#8C46A9]/15 border-[1.5px] border-solid border-[#8C46A9]/15 rounded-lg min-w-[63px] min-h-[84px] max-h-[84px] text-center mx-auto">
          <Pressable onPress={handleAmPmToggle}>
            <Text
              className="text-3xl font-bold text-[#8C46A9] leading-[48px] text-center"
              style={{ fontFamily: fontFamily.nunitoBold }}
            >
              {getAmPm(time)}
            </Text>
          </Pressable>
          <View className="border-b-[1.5px] border-solid border-[#8C46A9]/15"></View>
          <Text
            className="text-[15px] text-[#535353] font-semibold leading-[16.5px] text-center py-1.5"
            style={{ fontFamily: fontFamily.nunitoBold }}
          >
            {getAmPm(time) === 'AM' ? 'PM' : 'AM'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    alignItems: 'center',
  },
  scrollOption: {
    fontSize: 24,
    padding: 8,
    color: '#535353',
  },
  selectedOption: {
    color: '#8C46A9',
    fontWeight: 'bold',
  },
});

export default CustomTimePicker;
