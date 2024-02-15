const keys = ['Q','W','E','R','T','Y','U','I','O','P','Backspace','A','S','D','F','G','H','J','K','L','Enter','Z','X','C','V','B','N','M']
function handleKeyPress(key){
    document.body.dispatchEvent(new KeyboardEvent('keydown', {key: key}))
}

export default function buildKeyboard(){
    const keyboard = document.createElement('div')
    keyboard.classList.add('keyboard')
    keys.forEach((key) => {
        const keyBtn = document.createElement('button')
        keyBtn.classList.add('key')
        keyBtn.textContent = key
        keyBtn.addEventListener('click', () => handleKeyPress(key))
        keyboard.appendChild(keyBtn)
    })
    return keyboard
}