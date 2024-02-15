/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./modules/Keyboard.js":
/*!*****************************!*\
  !*** ./modules/Keyboard.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ buildKeyboard)\n/* harmony export */ });\nconst keys = ['Q','W','E','R','T','Y','U','I','O','P','Backspace','A','S','D','F','G','H','J','K','L','Enter','Z','X','C','V','B','N','M']\nfunction handleKeyPress(key){\n    document.body.dispatchEvent(new KeyboardEvent('keydown', {key: key}))\n}\n\nfunction buildKeyboard(){\n    const keyboard = document.createElement('div')\n    keyboard.classList.add('keyboard')\n    keys.forEach((key) => {\n        const keyBtn = document.createElement('button')\n        keyBtn.classList.add('key')\n        keyBtn.textContent = key\n        keyBtn.addEventListener('click', () => handleKeyPress(key))\n        keyboard.appendChild(keyBtn)\n    })\n    return keyboard\n}\n\n//# sourceURL=webpack://lexcade/./modules/Keyboard.js?");

/***/ }),

/***/ "./script.js":
/*!*******************!*\
  !*** ./script.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_Keyboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/Keyboard */ \"./modules/Keyboard.js\");\n\n\nconst alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',\n'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']\n\nlet currentWordCoord = 3\nlet gameState = 'active'\nlet currentLetterCoord = 0\nlet requiredLetters = ['O', 'T']\nlet currentLetters = []\nlet freebieUsed = false\n\n//DOM manipulation\n\nconst placeLetterInDOM = (wordCoord, letterCoord, letterToPlace) => {\n    const box = document.getElementById(`word-${wordCoord}-letter-${letterCoord}`)\n    box.textContent = letterToPlace\n}\n\nconst removeLetterFromDOM = (wordCoord, letterCoord) => {\n    const box = document.getElementById(`word-${wordCoord}-letter-${letterCoord}`)\n    box.textContent = ''\n}\n\nconst deleteWord = (wordCoord) => {\n    const wordToDelete = document.getElementById(`word${wordCoord}`)\n    const wordToDeleteChildNodes = wordToDelete.childNodes\n    wordToDeleteChildNodes.forEach((node) => {\n        node.textContent = ''\n    })\n}\n\nconst disableBtn = (btn) => {\n    btn.disabled = true\n}\n\nconst displayError = (errorText) => {\n    const errorDisplay = document.createElement('div')\n    errorDisplay.classList.add('error')\n    const errorMsg = document.createElement('div')\n    errorMsg.textContent = errorText\n    errorMsg.classList.add('error-text')\n    errorDisplay.append(errorMsg)\n    document.body.append(errorDisplay)\n    setTimeout(() => errorDisplay.remove(), 1600)\n}\n\nconst postRequiredLettersToDOM = () => {\n    const requiredLettersElement = document.getElementById('required')\n    const currentLettersElements = document.querySelectorAll('.required-letter')\n    if (currentLettersElements.length !== requiredLetters.length){\n        currentLettersElements.forEach((element) => {\n            element.remove()\n        })\n        requiredLetters.forEach((letter) => {\n            const requiredLetter = document.createElement('li')\n            requiredLetter.classList.add('required-letter')\n            requiredLetter.textContent = letter\n            requiredLettersElement.append(requiredLetter)\n        })\n    }\n}\n//State management\n\nconst setCoords = (wordCoord, letterCoord) => {   \n    currentWordCoord = wordCoord\n    currentLetterCoord = letterCoord\n}\n\nconst updateCurrentLetters = (updateArray, letter) => {\n    if (letter){\n        updateArray.push(letter)\n        return\n    }\n    updateArray.pop()\n}\n\nconst updateRequiredLetters = (arrayToUpdate, wordArray) => {\n    const uniqueLetter = wordArray.filter(letter => !arrayToUpdate.includes(letter))\n    requiredLetters = requiredLetters.concat(uniqueLetter)\n}\n\nconst useFreebie = () => {\n    if (currentWordCoord === 3 || freebieUsed === true){\n        return\n    }\n    else if (currentWordCoord === 4 && requiredLetters.length > 2){\n        freebieUsed = true\n        deleteWord(currentWordCoord)\n        setCoords(currentWordCoord - 1, 0)\n        deleteWord(currentWordCoord)\n        requiredLetters.pop()\n        postRequiredLettersToDOM()\n        disableBtn(document.getElementById('freebie'))\n        return\n    }\n    freebieUsed = true\n    deleteWord(currentWordCoord)\n    setCoords(currentWordCoord - 1, 0)\n    deleteWord(currentWordCoord)\n    const previousWordChildren = document.getElementById(`word${currentWordCoord - 1}`).children\n    const previousWordLetters = Array.from(previousWordChildren, (element) => element.innerText)\n    requiredLetters = previousWordLetters.filter((letter, index) => previousWordLetters.indexOf(letter) === index)\n    postRequiredLettersToDOM()\n    disableBtn(document.getElementById('freebie'))\n}\n\n//Utility Functions\nconst verifyRequiredLetterUsage = (requiredLetters, lettersToCheck) => {\n    return requiredLetters.every(letter => lettersToCheck.includes(letter))\n}\n\nconst checkNewUniqueLetter = (requiredLetters, submittedWord) => {\n    const uniqueLetters = submittedWord.filter(letter => !requiredLetters.includes(letter))\n    return uniqueLetters.length <= 1\n}\n\nasync function checkDictionaryForWord(word){\n    const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)\n    return result\n}\n\nconst validKeyCheck = (pressedKey) => {\n    setTimeout(1000)\n    const uppercaseKey = pressedKey.key.toUpperCase()\n    if (alphabet.includes(uppercaseKey)){\n        if (currentLetterCoord < currentWordCoord){\n            updateCurrentLetters(currentLetters, uppercaseKey)\n            placeLetterInDOM(currentWordCoord, currentLetterCoord, uppercaseKey)\n            setCoords(currentWordCoord, currentLetterCoord + 1)\n        }\n    } else if (pressedKey.key == 'Enter' && currentLetterCoord >= currentWordCoord){\n        const wordToCheck = currentLetters.join('')\n        //Need to verify if all rules have been met\n        if(!verifyRequiredLetterUsage(requiredLetters, currentLetters)){\n            displayError('Must use all required letters')\n            return\n        }\n        if(!checkNewUniqueLetter(requiredLetters, currentLetters)){\n            displayError('Maximum of one new unique letter per word')\n            return\n        }\n        checkDictionaryForWord(wordToCheck).then((response) => {\n            const status = response.status\n            if(status == 200){\n                if(currentWordCoord == 7){\n                    return\n                }\n                updateRequiredLetters(requiredLetters, currentLetters)\n                postRequiredLettersToDOM()\n                currentLetters = []\n                setCoords(currentWordCoord + 1, 0)\n            }\n            else if(status == 404){\n                displayError('Couldn\\'t find a valid word matching that spelling')\n            } else console.log(status)\n        })\n    } else if (pressedKey.key == 'Backspace' && currentLetterCoord !== 0){\n        updateCurrentLetters(currentLetters)\n        removeLetterFromDOM(currentWordCoord, currentLetterCoord - 1)\n        setCoords(currentWordCoord, currentLetterCoord - 1)\n    }\n}\n\nconst body = document.querySelector('body')\nconst freebieBtn = document.getElementById('freebie')\nconst keyboard = (0,_modules_Keyboard__WEBPACK_IMPORTED_MODULE_0__[\"default\"])()\ndocument.getElementById('keyboard-holder').appendChild(keyboard)\npostRequiredLettersToDOM()\nbody.addEventListener('keydown', validKeyCheck)\nfreebieBtn.addEventListener('click', useFreebie)\n\n\n\n//# sourceURL=webpack://lexcade/./script.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./script.js");
/******/ 	
/******/ })()
;