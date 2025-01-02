import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions, Platform, PixelRatio } from 'react-native';
import { get12HourFormat, getAmPm } from '../../helpers/dateUtils';
import { fontFamily } from '../../constants/theme';
import { combineTransition } from 'react-native-reanimated';

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
    console.log("Running  handleHourChange",hour)
    const updatedTime = new Date(time);
    updatedTime.setHours(hour);
    setTime(updatedTime);
    if (onTimeChange) onTimeChange(updatedTime);
  };

  const handleMinuteChange = (minute: number) => {
    console.log("Running  handleMinuteChange",minute)
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
    if (onTimeChange) onTimeChange(updatedTime);
  };
  const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');


  const renderScrollOptions = (
    range: number[],
    selectedValue: number,
    onChange: (value: number) => void,
    type?:"hour"|"minute"
  ) => {
    const baseScreenHeight = 830; // Example baseline for scaling
    // const calculateItemHeight = () => {
    //   const aspectRatio = deviceHeight / deviceWidth;
    //   const minItemHeight = 45;
    //   const maxItemHeight = 55;
      
    
    //   // Base height: 6% of screen height, adjusted for aspect ratio and font scaling
    //   let dynamicHeight = Math.round((deviceHeight * 0.05 / PixelRatio.getFontScale()) * (aspectRatio > 2 ? 1.1 : 1));
    //   console.log("dynamicHeight",{dynamicHeight,deviceHeight,aspectRatio,deviceWidth})
    //   return Math.min(Math.max(dynamicHeight, minItemHeight), maxItemHeight);
    // };
    const baseItemHeightPercentage = 0.09; // Use around 7% of the screen height

// Calculate itemHeight with min and max bounds
// Define a base factor to calculate itemHeight dynamically
const baseItemHeightFactor = 0.05; // Start with 7% of the screen height
const aspectRatioFactor = deviceWidth / deviceHeight; // Account for screen aspect ratio
const densityFactor = PixelRatio.get(); // Account for pixel density

// Calculate itemHeight with dynamic scaling and bounds
const calculateItemHeight = () => {
  // Adjust the base factor by combining screen height, aspect ratio, and density
  const dynamicHeightFactor = baseItemHeightFactor * (1 + aspectRatioFactor / 2);

  // Calculate scaled height
  const scaledHeight = Math.round(deviceHeight * dynamicHeightFactor);

  // Normalize the height based on screen density
  const normalizedHeight = Math.round(scaledHeight / densityFactor);

  // Define reasonable bounds for the item height
  const minHeight = Math.round(deviceHeight * 0.05); // Minimum item height: 5% of screen height
  const maxHeight = Math.round(deviceHeight * 0.1);  // Maximum item height: 10% of screen height

  // Ensure the height stays within bounds
  return Math.min(Math.max(normalizedHeight, minHeight), maxHeight);
};

    
    const itemHeight = calculateItemHeight(); // Adjusted dynamically/ Height of each item, adjust this as per your design
console.log("itemHeight",itemHeight,Platform.OS,deviceHeight )    
const handleScrollEnd = (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / itemHeight);
      console.log("index",index)
      const selected = range[index];
      console.log("selected",selected)
      if (selected !== selectedValue) {
        onChange(selected);
      }
    };
  
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        // snapToInterval={itemHeight} // Ensures smooth snapping to each item
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
              allowFontScaling={false}
            >
              {type=="minute"&& value<10? `0${value}`:value}
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
            handleHourChange,
            "hour"
            
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
            Number(time.getMinutes()),
            handleMinuteChange,
            "minute"
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
