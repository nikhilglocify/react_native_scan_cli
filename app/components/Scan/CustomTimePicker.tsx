import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { get12HourFormat, getAmPm } from '../../helpers/dateUtils';
import { fontFamily } from '../../constants/theme';

type CustomTimePickerProps = {
  onTimeChange?: (time: Date) => void;
};

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ onTimeChange }) => {
  const [time, setTime] = useState<Date>(new Date());

  const handleHourChange = (increment: boolean) => {
    const updatedTime = new Date(time);
    const currentHour = updatedTime.getHours();
    updatedTime.setHours((currentHour + (increment ? 1 : -1) + 24) % 24); // Ensures hour stays within 0-23
    setTime(updatedTime);
    if (onTimeChange) onTimeChange(updatedTime);
  };

  const handleMinuteChange = (increment: boolean) => {
    const updatedTime = new Date(time);
    const currentMinute = updatedTime.getMinutes();
    updatedTime.setMinutes((currentMinute + (increment ? 1 : -1) + 60) % 60); // Ensures minutes stay within 0-59
    setTime(updatedTime);
    if (onTimeChange) onTimeChange(updatedTime);
  };

  const handleAmPmToggle = () => {
    const updatedTime = new Date(time);
    const currentHours = updatedTime.getHours();
    updatedTime.setHours(currentHours >= 12 ? currentHours - 12 : currentHours + 12);
    setTime(updatedTime);
    if (onTimeChange) onTimeChange(updatedTime);
  };

  return (
    <Pressable>
      <View className="flex items-center gap-3 justify-center flex-row">
        {/* Hour Picker */}
        <View className="bg-[#8C46A9]/15 border-[1.5px] border-solid border-[#8C46A9]/15 rounded-lg min-w-[63px] min-h-[120px] max-h-[120px] text-center mx-auto">
          <Pressable onPress={() => handleHourChange(true)}>
            <Text className="text-lg text-[#8C46A9] text-center font-bold">▲</Text>
          </Pressable>
          <Text
            className="text-3xl text-[#535353] font-semibold leading-[48px] text-center"
            style={{ fontFamily: fontFamily.nunitoBold }}
          >
            {get12HourFormat(time)}
          </Text>
          <Pressable onPress={() => handleHourChange(false)}>
            <Text className="text-lg text-[#8C46A9] text-center font-bold">▼</Text>
          </Pressable>
          <Text
            className="text-[15px] text-[#535353] font-semibold leading-[16.5px] text-center py-1.5"
            style={{ fontFamily: fontFamily.nunitoBold }}
          >
            Hour
          </Text>
        </View>

        {/* Minute Picker */}
        <View className="bg-[#8C46A9]/15 border-[1.5px] border-solid border-[#8C46A9]/15 rounded-lg min-w-[63px] min-h-[120px] max-h-[120px] text-center mx-auto">
          <Pressable onPress={() => handleMinuteChange(true)}>
            <Text className="text-lg text-[#8C46A9] text-center font-bold">▲</Text>
          </Pressable>
          <Text
            className="text-3xl text-[#535353] font-semibold leading-[48px] text-center"
            style={{ fontFamily: fontFamily.nunitoBold }}
          >
            {String(time.getMinutes()).padStart(2, '0')}
          </Text>
          <Pressable onPress={() => handleMinuteChange(false)}>
            <Text className="text-lg text-[#8C46A9] text-center font-bold">▼</Text>
          </Pressable>
          <Text
            className="text-[15px] text-[#535353] font-semibold leading-[16.5px] text-center py-1.5"
            style={{ fontFamily: fontFamily.nunitoBold }}
          >
            Min
          </Text>
        </View>

        {/* AM/PM Toggle */}
        <View className="bg-[#8C46A9]/15 border-[1.5px] border-solid border-[#8C46A9]/15 rounded-lg min-w-[63px] min-h-[120px] max-h-[120px] text-center mx-auto">
          <Pressable onPress={handleAmPmToggle}>
            <Text
              className="text-3xl font-bold text-[#8C46A9] leading-[48px] text-center"
              style={{ fontFamily: fontFamily.nunitoBold }}
            >
              {getAmPm(time)}
            </Text>
          </Pressable>
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
