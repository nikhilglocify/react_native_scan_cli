import React, {useRef, useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {get12HourFormat, getAmPm} from '../../helpers/dateUtils';
import {fontFamily} from '../../constants/theme';

type CustomTimePickerProps = {
  onTimeChange?: (time: Date) => void;
};

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({onTimeChange}) => {
  const [time, setTime] = useState<Date>(new Date());
  const timeRef = useRef<Date>(time); 
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePressIn = (changeFunction: () => void) => {
    if (intervalRef.current) return; 
    changeFunction(); 
    intervalRef.current = setInterval(changeFunction, 200); 
  };

  const handlePressOut = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  const updateTime = (updatedTime: Date) => {
    timeRef.current = updatedTime;
    setTime(updatedTime);
    if (onTimeChange) onTimeChange(updatedTime);
  };

  const handleHourChange = (increment: boolean) => {
    const updatedTime = new Date(timeRef.current);
    const currentHour = updatedTime.getHours();
    updatedTime.setHours((currentHour + (increment ? 1 : -1) + 24) % 24);
    updateTime(updatedTime);
  };

  const handleMinuteChange = (increment: boolean) => {
    const updatedTime = new Date(timeRef.current);
    const currentMinute = updatedTime.getMinutes();
    updatedTime.setMinutes((currentMinute + (increment ? 1 : -1) + 60) % 60);
    updateTime(updatedTime);
  };

  const handleAmPmToggle = () => {
    const updatedTime = new Date(time);
    const currentHours = updatedTime.getHours();
    updatedTime.setHours(
      currentHours >= 12 ? currentHours - 12 : currentHours + 12,
    );
    setTime(updatedTime);
    if (onTimeChange) onTimeChange(updatedTime);
  };

  return (
    <Pressable>
      <View className="flex items-center gap-3 justify-center flex-row">
        {/* Hour Picker */}
        <View className="flex items-center justify-center border-[1.5px] border-solid border-[#8C46A9]/15 rounded-lg w-[70px] text-center">
          <Pressable
            className="pt-1 pb-2 w-full"
            
            onPressIn={() => handlePressIn(() => handleHourChange(true))}
            onPressOut={()=>handlePressOut()}
            // onPress={()=>handleHourChange(true)}
            >
            <Text className="text-lg  text-center font-bold">
              ▲
            </Text>
          </Pressable>
          <View className="bg-[#8C46A9]/15 flex items-center justify-center py-1  border-solid w-full text-center">
            <Text
              className="text-3xl text-[#8C46A9]  py-[6px] w-full mb-1 font-semibold text-center border-solid border-[#8C46A9]/15 border-b"
              style={{fontFamily: fontFamily.nunitoBold}}>
              {get12HourFormat(time)}
            </Text>

            <Text
              className="text-[12px] text-[#535353] leading-[16px] text-center pb-2"
              style={{fontFamily: fontFamily.nunitoBold}}>
              Hour
            </Text>
          </View>
          <Pressable
            className="pt-2 pb-1 w-full"
            onPressIn={() => handlePressIn(() => handleHourChange(false))}
            onPressOut={handlePressOut}
            
            >
            <Text className="text-lg  text-center font-bold">
              ▼
            </Text>
          </Pressable>
        </View>

        {/* Minute Picker */}
        <View className="flex items-center justify-center border-[1.5px] border-solid border-[#8C46A9]/15 rounded-lg w-[70px] text-center">
          <Pressable
            className="pt-1 pb-2 w-full"
            onPressIn={() => handlePressIn(() => handleMinuteChange(true))}
            onPressOut={handlePressOut}
            // onPress={()=>handleMinuteChange(true)}
            >
            <Text className="text-lg  text-center font-bold">
              ▲
            </Text>
          </Pressable>
          <View className="bg-[#8C46A9]/15 flex items-center justify-center py-1  border-solid w-full text-center">
            <Text
              className="text-3xl text-[#8C46A9]  py-[6px] w-full mb-1 font-semibold text-center border-solid border-[#8C46A9]/15 border-b"
              style={{fontFamily: fontFamily.nunitoBold}}>
              {String(time.getMinutes()).padStart(2, '0')}
            </Text>

            <Text
              className="text-[12px] text-[#535353] leading-[16px] text-center pb-2"
              style={{fontFamily: fontFamily.nunitoBold}}>
              Min
            </Text>
          </View>
          <Pressable
            className="pt-2 pb-1 w-full"
            onPressIn={() => handlePressIn(() => handleMinuteChange(false))}
            onPressOut={handlePressOut}
            >
            <Text className="text-lg  text-center font-bold">
              ▼
            </Text>
          </Pressable>
        </View>

        {/* AM/PM Toggle */}
        <View className="flex items-center justify-center border-[1.5px] border-solid border-[#8C46A9]/15 rounded-lg w-[70px] text-center">
          <Pressable  className="pt-1 pb-2 w-full " onPress={handleAmPmToggle}>
            <Text className="text-lg  text-center font-bold">
              ▲
            </Text>
          </Pressable>
          <View className="bg-[#8C46A9]/15 flex items-center justify-center py-1  border-solid w-full text-center">
            <Pressable onPress={handleAmPmToggle}>
              <Text
               className="text-3xl text-[#8C46A9]  py-[6px] w-full mb-1 font-semibold text-center border-solid border-[#8C46A9]/15 border-b"
                style={{fontFamily: fontFamily.nunitoBold}}>
                {getAmPm(time)}
              </Text>
            </Pressable>

            <Text
              className="text-[12px] text-[#535353] leading-[16px] text-center pb-2"
              style={{fontFamily: fontFamily.nunitoBold}}>
              {getAmPm(time) === 'AM' ? 'PM' : 'AM'}
            </Text>
          </View>
          <Pressable  className="pt-2 pb-1 w-full" onPress={handleAmPmToggle}>
            <Text className="text-lg  text-center font-bold">
              ▼
            </Text>
          </Pressable>
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
