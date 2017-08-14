const css = require('./styles.scss') // eslint-disable-line

/******************************************/
/*         Constants and functions        */
/******************************************/

function $ (selector) {
  /*
  Description: Function that returns all elements that match with a CSS selector

  Parameters:
    selector: A css selector in a string.

  Return:
    A NodeList containing all matched elements matched elements, if any.
  */
  return document.querySelectorAll(selector)
}

/******************************************/
/*               DOM Elements             */
/******************************************/

const [mainDisplay] = $('.timer h1')
const [timeSetDisplay] = $('.timer-set span')
const [breakSetDisplay] = $('.break-set span')
const [mainButton] = $('.info-set h2')
const breakButtons = $('.break-set img')
const setButtons = $('.timer-set img')
const allButtons = [...setButtons, ...breakButtons]
const [errHandler] = $('.err-handler')

let idTimer, leftTime, isBreak
isBreak = false

function showError (message) {
  /*
    Description:
      Function that shows an error message to the user

    Parameters:
      message: string with the message

    Return:
      none
  */
  errHandler.innerHTML = message
  errHandler.classList.add('active')

  setTimeout(function () {
    errHandler.classList.remove('active')
  }, 2000)
}

function changeValue (element, change) {
  /*
    Description:
      Function that change the values of the setters

    Parameters:
      element: DOMElement to change it's innerHTML
      change: to decide if add or substract

    Return:
      none
  */
  if (change === 'up') {
    if (element.innerHTML === '99') {
      showError('Max. number')
      return
    }
    element.innerHTML = parseInt(element.innerHTML) + 1
  } else {
    if (element.innerHTML === '1') {
      showError('Min. number')
      return
    }
    element.innerHTML = parseInt(element.innerHTML) - 1
  }
}

function handleClick () {
  /*
    Description:
      Handler for the buttons

    Parameters:
      none

    Return:
      none
  */
  if (mainButton.innerHTML === 'RESET') return
  this.classList.add('active')
  if (this.parentNode.className === 'break-set') {
    changeValue(breakSetDisplay, this.dataset['key'])
  } else {
    changeValue(timeSetDisplay, this.dataset['key'])
    mainDisplay.innerHTML = formatTime(parseInt(timeSetDisplay.innerHTML) * 60)
  }
}

function transitionEnd () {
  this.classList.remove('active')
}

function formatTime (seconds) {
  /*
    Description:
      Format the seconds to HH:MM:SS

    Parameters:
      none

    Return:
      A string that have the formatted time
  */
  const hours = Math.floor(seconds / 3600)
  seconds %= 3600
  let minutes = Math.floor(seconds / 60)
  seconds %= 60
  if (seconds < 10) seconds = `0${seconds}`
  if (minutes < 10) minutes = `0${minutes}`
  return hours > 0
    ? `${hours}:${minutes}:${seconds}`
    : `${minutes}:${seconds}`
}

function changeMainDisplay () {
  /*
    Description:
      Function that every second change the time.

    Parameters:
      none

    Return:
      none
  */
  mainDisplay.innerHTML = formatTime(leftTime)
  leftTime--
  if (mainDisplay.innerHTML === '0:00') {
    if (isBreak) {
      isBreak = false
      document.body.classList.remove('break')
      mainButton.classList.add('break')
      document.body.classList.add('time')
      mainButton.classList.add('time')
      leftTime = parseInt(timeSetDisplay.innerHTML) * 60
    } else {
      isBreak = true
      document.body.classList.remove('time')
      mainButton.classList.add('time')
      document.body.classList.add('break')
      mainButton.classList.add('break')
      leftTime = parseInt(breakSetDisplay.innerHTML) * 60
    }
  }
}

allButtons.forEach(button => {
  button.addEventListener('click', handleClick)
  button.addEventListener('transitionend', transitionEnd)
})

mainButton.addEventListener('click', function () {
  if (this.innerHTML === 'START') {
    this.innerHTML = 'RESET'
    leftTime = parseInt(timeSetDisplay.innerHTML) * 60
    document.body.classList.add('time')
    mainButton.classList.add('time')
    idTimer = setInterval(changeMainDisplay, 1000)
  } else {
    clearInterval(idTimer)
    this.innerHTML = 'START'
    leftTime = parseInt(timeSetDisplay.innerHTML) * 60
    mainDisplay.innerHTML = formatTime(leftTime)
    document.body.classList.remove('time', 'break')
    mainButton.classList.remove('time', 'break')
  }
})
