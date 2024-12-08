const webUrls = []
for (let i = 0; i < 10; i++) {
	let randomNumber = Math.floor((Math.random() * 6480) + 1)
	webUrls.push(randomNumber)
}

const urlBuilder = async() => {
	try {
		console.log("Loading")
		// let req = await fetch("compilation_array2.json")
		// let res = await req.json()
		let arrayOfUrls = [
			"https://www.facebook.com",
			"https://www.fonts.googleapis.com",
			"https://www.twitter.com",
			"https://www.google.com",
			"https://www.youtube.com",
			"https://www.instagram.com",
			"https://www.s.w.org",
			"https://www.googletagmanager.com",
			"https://www.linkedin.com",
			"https://www.gmpg.org",]
        let openedWindow
        let k = 0;
        for(let i = 0; i < 5; i++){
    		let randomLink = document.createElement('a')
    		randomLink.href = arrayOfUrls[webUrls[i]]
    		randomLink.innerText = randomLink.href
    		randomLink.classList.add("hyperlink")
    		document.body.appendChild(randomLink)
            const openWindow = () => {
            	openedWindow = window.open(arrayOfUrls[webUrls[i]])
            }
            const closeOpenedWindow = () => {
            	openedWindow.close()
            }
            setTimeout(openWindow, 0 + k)
            setTimeout(closeOpenedWindow, 1900 + k)
            k = k + 2000
        }		
	} catch (error) {
		console.log("it didn't work",error)
	}
}
urlBuilder()