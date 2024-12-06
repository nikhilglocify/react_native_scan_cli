import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import { DateTime } from "luxon";
import { Picker } from "@react-native-picker/picker";
import "react-native-get-random-values";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "../ui/TabIcons";
import Svg, { Path, Rect, Mask, G } from "react-native-svg";
import { ScheduledScan } from "@/constants/Interface";
import { useScanContext } from "@/context/ScanContext";
import { v4 as uuidv4 } from "uuid";
import { get12HourFormat, getAmPm } from "@/helpers/dateUtils";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureProps } from "react-native-reanimated/lib/typescript/ConfigHelper";

// Define types for props
interface AddScanModalProps {
  visible: boolean;
  onClose: () => void;
}

// Define interface for event data
interface Event {
  id: string;
  time: string;
  eventData: string;
  isExecuted: boolean;
}

// Define interface for ScanData
interface ScanData {
  id: string;
  time: string; // ISO string representation of time
  urls: string[];
}

const AddScanModal: React.FC<AddScanModalProps> = ({ visible, onClose }) => {
  const [time, setTime] = useState<Date>(new Date());
  const [scanDuration, setScanDuration] = useState<number>(5);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const { scans, addScan, removeScan, updateScan } = useScanContext();
  const notificationListener = useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null>(null);
  const BACKGROUND_FETCH_TASK = "background-fetch-task";

  // Handler for time change
  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowPicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  // Background Fetch Task
 

  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
      console.log("RUNNING BACKGROUND TASK");
      // Fetch stored events from AsyncStorage
      const storedEventsJson = await AsyncStorage.getItem("events");
      const storedEvents: Event[] = storedEventsJson ? JSON.parse(storedEventsJson) : [];

      const currentTime = DateTime.local();
      console.log("storedEvents", storedEvents);

      // Check each event to see if it should be executed
      for (const event of storedEvents) {
        const eventTime = DateTime.fromISO(event.time);

        // If the scheduled time is before or equal to the current time and not executed yet
        if (eventTime <= currentTime && !event.isExecuted) {
          // Update isExecuted to true in AsyncStorage
          event.isExecuted = true;
          await AsyncStorage.setItem("events", JSON.stringify(storedEvents));

          // Execute the event (e.g., show a notification or perform any other task)
          console.log(`Executing event: ${event.id}`);
          // You could also show a notification here if you like
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Event Executed",
              body: `Event with ID ${event.id} executed.`,
            },
            trigger: null, // Execute immediately
          });
        }
      }
      const result = await BackgroundFetch.getStatusAsync();
      // Finish the background task
      return result;
    } catch (error) {
      console.error("Error in background fetch task", error);
    }
  });

  const saveEventToStorage = async (event: Event) => {
    const storedEvents: Event[] =
      JSON.parse((await AsyncStorage.getItem("events")) as string) || [];
    storedEvents.push(event);
    await AsyncStorage.setItem("events", JSON.stringify(storedEvents));
  };
  async function registerBackgroundFetchAsync() {
    console.log("registerBackgroundFetchAsync")
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }
  // Function to schedule a scan
  const scheduleScan = async (scanData: ScanData) => {
    const { id, time, urls } = scanData;
    const eventTime = DateTime.fromJSDate(new Date(time)); // Use Luxon to handle DateTime
    const currentTime = DateTime.local();
    await registerBackgroundFetchAsync()
    // if (eventTime > currentTime) {
    //   const event: Event = {
    //     id: Math.random().toString(36).substring(7), // Random ID for the event
    //     time: eventTime.toISO()!,
    //     eventData: "Some event data", // Add any data you want to store
    //     isExecuted: false,
    //   };

    //   await registerBackgroundFetchAsync()
    //   await saveEventToStorage(event);
    // } else {
    //   alert("Selected time is in the past!");
    // }

    const scheduledTime = new Date(time);

    const notificationId = await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title: `Scheduled Scan`,
        body: `Running scan for ID: ${id}`,
        data: { id, time, urls },
      },
      trigger: {
        type: "date",
        date: scheduledTime,
      },
    });

    console.log(`Scan scheduled with ID: ${id} at ${scheduledTime}`);
    return notificationId;
  };

  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      return {
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };
    },
  });

  Notifications.addNotificationReceivedListener((notification) => {
    const data = notification.request.content.data;
  });

  const scan_id = uuidv4();

  const handleAddScan = async () => {
    const obj: ScheduledScan = {
      id: scan_id,
      time: time.toISOString(),
      date: time,
      scanDuration,
      isCompleted: false,
    };

    await scheduleScan({
      id: scan_id,
      time: new Date(time).toISOString(),
      urls: [],
    });
    await addScan(obj);

    onClose();
  };

  return (
    <Modal
      transparent={false}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Select Time</Text>

          {Platform.OS == "android" && (
            <Pressable onPress={() => setShowPicker(true)}>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>{get12HourFormat(time)}</Text>
                  <View style={styles.border} />
                  <Text style={styles.timeLabel}>Hour</Text>
                </View>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>{time.getMinutes()}</Text>
                  <View style={styles.border} />
                  <Text style={styles.timeLabel}>Min</Text>
                </View>
                <View style={styles.timeBox}>
                  <Text style={styles.timeText}>{getAmPm(time)}</Text>
                  <View style={styles.border} />
                  <Text style={styles.timeLabel}>
                    {getAmPm(time) == "AM" ? "PM" : "AM"}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}

          {Platform.OS === "android" && showPicker && (
            <TouchableOpacity onPress={() => setTime(new Date())}>
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={false}
                display="clock"
                onChange={onChangeTime}
              />
            </TouchableOpacity>
          )}

          {Platform.OS === "ios" && (
            <View
              style={{
                height: 150,
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={onChangeTime}
              />
            </View>
          )}

          {/* Scan Duration Picker */}
          <View style={styles.durationContainer}>
            <Text style={styles.scanDurationText}>Scan Duration:</Text>
            <View style={styles.durationPicker}>
              <Text style={styles.durationText}>{scanDuration}</Text>
              <View style={styles.arrowContainer}>
                {/* up arrow */}
                <Pressable onPress={() => setScanDuration((prev) => prev + 1)}>
                  <Svg width="12" height="12" viewBox="0 0 5 4" fill="none">
                    <Path
                      d="M0.250151 4L4.75028 4C4.79584 3.99985 4.8405 3.98642 4.87945 3.96116C4.9184 3.93591 4.95017 3.89978 4.97133 3.85666C4.9925 3.81355 5.00211 3.76513 5.00041 3.71625C4.99871 3.66737 4.98506 3.62156 4.96058 3.58858L3.01878 1.33782L3.01888 1.33775C2.99428 1.29598 2.96265 1.27128 2.92271 1.26157C2.88276 1.25187 2.84194 1.25716 2.80491 1.27654C2.76788 1.29593 2.73655 1.32856 2.71388 1.36952C2.69121 1.41047 2.6788 1.45765 2.6788 1.50555C2.6788 1.55345 2.69115 1.60062 2.71375 1.64156L3.65072 2.90798H1.25016C1.22397 2.90798 1.20103 2.92763 1.18372 2.95156C1.16642 2.97548 1.15563 3.00162 1.15325 3.02793C1.15087 3.05425 1.15796 3.08044 1.17361 3.10394L4.17361 4.10394"
                      fill="#4C4C4C"
                    />
                  </Svg>
                </Pressable>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleAddScan} style={styles.addButton}>
            <Text style={styles.buttonText}>Add Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  timeBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 18,
  },
  timeLabel: {
    fontSize: 12,
    color: "#4C4C4C",
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#4C4C4C",
    width: "70%",
    marginVertical: 5,
  },
  durationContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  scanDurationText: {
    fontSize: 16,
    color: "#333",
  },
  durationPicker: {
    flexDirection: "row",
  },
  durationText: {
    fontSize: 16,
    color: "#333",
    marginRight: 5,
  },
  arrowContainer: {
    flexDirection: "row",
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#2D82B7",
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default AddScanModal;
