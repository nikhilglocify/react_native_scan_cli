import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import urlData from '../../scripts/scanScript/compilation_array2.json';
import uuid from 'react-native-uuid';
import {useScanContext} from '../../../context/ScanContext';
import {getRandomURLs} from '../../helpers';
import {ScheduledScan} from '../../constants/Interface';
import BrowserTabIcon from '../ui/svgIcons/BrowserTabIcon';
import CrossIcon from '../ui/svgIcons/CrossIcon';
import {
  createNotificationChannel,
  scheduleNotification,
} from '../../services/PushNotificationConfig';

type scannedWebView = {
  webView: JSX.Element;
  url: string;
  id: string;
};
const RunScan = ({navigation}: any) => {
  const isFocused = useIsFocused();
  const [activeWebView, setActiveWebView] = useState<number | null>(null);
  const [showScannedUrls, setShowScannedUrls] = useState<boolean>(false);
  const [webViews, setWebViews] = useState<scannedWebView[]>([]);
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string | null>();
  const [isScanCompleted, setIsScanCompleted] = useState<boolean>(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>();

  const {addScan, initNewScan, setInitNewScan, checkForScan} = useScanContext();

  const selectedUrls = getRandomURLs(urlData.term);
  useEffect(() => {
    console.log('useEffect 1 RUnning');
    if (initNewScan && isFocused) {
      console.log('RUN SCAN AGAIN');
      
      runScan(selectedUrls);
    }
  }, [initNewScan, checkForScan]);
  
  const reset = () => {
    console.log('reset State');
    setScannedUrls([]);
    setWebViews([]);
    setCurrentUrl(null);
    setIsScanCompleted(false);
    setSelectedUrl(null);
    setInitNewScan(true);
  };

  const getRenderActiveTab = (url: string) => {
    const defaultWebview = {
      webView: (
        <WebView
          key={url}
          source={{uri: url}}
          style={{flex: 1}}
          startInLoadingState
          onError={e =>
            console.log(`Error loading WebView for URL ${url}:`, e.nativeEvent)
          }
        />
      ),
      url: url,
    };
    const activeTab = webViews.filter(tab => tab.url === url).length
      ? webViews.filter(tab => tab.url === url)[0]
      : defaultWebview;

    return activeTab.webView;
  };

  const runScan = async (selectedUrls: string[]) => {
    // console.log("Scanning", selectedUrls.length);
    let k = 0;
    setInitNewScan(false);

    const visitUrl = async (url: string, index: number) => {
      // console.log("visit url running", index, k);
      setTimeout(() => {
        const webView = (
          <WebView
            key={index}
            source={{uri: url}}
            style={{flex: 1}}
            startInLoadingState
            onLoad={() => {
              console.log(`Page loaded: ${url}`);
            }}
            onError={e =>
              console.log(
                `Error loading WebView for URL ${url}:`,
                e.nativeEvent,
              )
            }
          />
        );
        setCurrentUrl(url);
        // setActiveWebView(index);
        setScannedUrls(prev => [...prev, url]);
        setWebViews(prev => [...prev, {webView, url, id: uuid.v4()}]);
      }, k);
      // console.log("addToScanHistory", index, selectedUrls.length - 1);

      setTimeout(() => {
        // setCurrentUrl(null); // Set the WebView to null, effectively "closing" it
        console.log(`Closed: ${url}`);
        if (index == selectedUrls.length - 1) {
          console.log('SCAN COMPLETED');
          const addToScanHistory: ScheduledScan = {
            id: uuid.v4(),
            time: new Date().toISOString(),
            date: new Date(),
            scanDuration: selectedUrls.length,
            isCompleted: true,
            visitedSites: selectedUrls,
          };

          setIsScanCompleted(true);

          addScan(addToScanHistory);
        }
      }, k + 2000); // Close after 2 seconds
    };

    // Visit each URL with a delay
    for (let i = 0; i < selectedUrls.length; i++) {
      const url = selectedUrls[i];
      visitUrl(url, i);

      k += 2200;
    }
  };

  const closeTabUrl = (id: string) => {
    const filteredWebViews = webViews.filter(tab => tab.url !== id);
    const updatedUrls = scannedUrls.filter(url => url !== id);
    setWebViews(filteredWebViews);
    setScannedUrls(updatedUrls);

    if (selectedUrl || currentUrl == id) {
      if (updatedUrls.length) {
        setCurrentUrl(updatedUrls[0]);
        setSelectedUrl(updatedUrls[0]);
      } else {
        setShowScannedUrls(false);
        navigation.goBack();
        reset();
      }
    }
  };

  return (
    <View className="flex-1 h-screen mt-[40px] px-4">
      <View className="flex items-center justify-between flex-row mb-4 relative">
        <Pressable
          onPress={() => {
            navigation.goBack();
            reset();
          }}>
          <Text> Back</Text>
        </Pressable>
        <Text className="text-2xl font-medium flex-grow text-center pr-6">
          Run Scan
        </Text>
        <TouchableOpacity
          className="absolute right-0 p-2 px-2 rounded-lg"
          onPress={() => {
            console.log('onPress...', showScannedUrls);

            if (scannedUrls.length) {
              setShowScannedUrls(!showScannedUrls);
            }
          }}>
          <BrowserTabIcon />
        </TouchableOpacity>
      </View>

      <View className="flex-1 mt-4">
        {currentUrl ? (
          getRenderActiveTab(selectedUrl ? selectedUrl : currentUrl!)
        ) : (
          <>
            <View className="flex items-center justify-center flex-1">
              <Text className="text-lg text-gray-600">
                Select a Tab to view site
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Modal to Select Scanned URL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={scannedUrls.length ? showScannedUrls : false}
        onRequestClose={() => setShowScannedUrls(false)}>
        <TouchableWithoutFeedback onPress={() => setShowScannedUrls(false)}>
          <View className="flex justify-start pt-28 items-end h-[100vh] bg-black/30">
            <TouchableWithoutFeedback>
              <View className="bg-gray-100 p-6 rounded-lg w-[200px] max-h-[70vh] min-h-[300px] overflow-y-auto">
                <Text className="text-md font-semibold mb-4">Scanned URLs</Text>
                <ScrollView>
                  {scannedUrls.map((url, index) => {
                    const cleanedUrl = url
                      .replace(/^https?:\/\//, '')
                      .replace(/^www\./, '');

                    const shortenedUrl =
                      cleanedUrl.length > 30
                        ? `${cleanedUrl.slice(0, 27)}...`
                        : cleanedUrl;

                    return (
                      <View key={index} className="flex relative">
                        <Pressable
                          onPress={() => {
                            console.log('url', url);
                            setSelectedUrl(url);
                            setCurrentUrl(url);
                            setActiveWebView(index); // Set active WebView
                            setShowScannedUrls(false);
                          }}
                          className="py-2 border-b border-gray-200">
                          <Text className="text-base text-blue-500 pr-2 mr-4">
                            {shortenedUrl}
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() => closeTabUrl(url)}
                          className="absolute top-3 right-1">
                          <CrossIcon />
                        </Pressable>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    marginRight: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  activeTabButton: {
    backgroundColor: '#6200EE',
    color: '#fff',
  },
  visibleTabButton: {
    backgroundColor: '#4CAF50',
  },
});

export default RunScan;
