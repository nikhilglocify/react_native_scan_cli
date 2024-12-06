import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const RunScan = () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>URL Builder</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          .hyperlink {
            background: #ccc;
            padding: 5px;
            border-radius: 5px;
            margin: 10px;
            line-height: 35px;
            display: block;
          }
        </style>
      </head>
      <body>
        <script>
          const webUrls = [];
          for (let i = 0; i < 10; i++) {
            let randomNumber = Math.floor((Math.random() * 10)); // Generate indices for arrayOfUrls
            webUrls.push(randomNumber);
          }

          const urlBuilder = async () => {
            try {
              console.log("Loading...");
              let arrayOfUrls = [
                "https://www.facebook.com",
                "https://fonts.googleapis.com",
                "https://twitter.com",
                "https://google.com",
                "https://youtube.com",
                "https://instagram.com",
                "https://s.w.org",
                "https://googletagmanager.com",
                "https://linkedin.com",
                "https://gmpg.org"
              ];
              let openedWindow;
              let k = 0;
              for (let i = 0; i < 5; i++) {
                let randomLink = document.createElement('a');
                randomLink.href = arrayOfUrls[webUrls[i]];
                randomLink.innerText = randomLink.href;
                randomLink.classList.add("hyperlink");
                document.body.appendChild(randomLink);

                const openWindow = () => {
                  openedWindow = window.open(arrayOfUrls[webUrls[i]]);
                };
                const closeOpenedWindow = () => {
                  if (openedWindow) openedWindow.close();
                };

                setTimeout(openWindow, 0 + k);
                setTimeout(closeOpenedWindow, 1900 + k);
                k = k + 2000;
              }
            } catch (error) {
              console.log("It didn't work", error);
            }
          };
          urlBuilder();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
      />
    </View>
  );
};

export default RunScan;
