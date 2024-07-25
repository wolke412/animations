class Animations {
  static VERSION = "0.1"

  /** @deprecated */
  static HIDDEN_CLASS = 'anim-hidden'


  // CLASS IDENTIFIERS
  static ANIM_CLASS = 'anim'
  static SHOW_CLASS = 'anim-show'
  static COUNTER_CLASS = 'anim-counter'


  // DATASET VARIABLES
  static ANIMATION_DELAY = 'animationDelay'
  static ANIMATION_DURATION = 'animationDuration'
  
  /**
   * @description threshhold for JS IntersectionObserver Native API
   */
  static INTERSECTION_THRESHOLD = 0.5

  constructor () {
    log("Class initialization began...")
    
    if ( typeof IntersectionObserver !==  'function') {
      log( "Browser does not support IntersectionObserver, disabling animations",  'error')
      this.EXIT()
    }

    log( "Class initialized", 'success' )
  }
  
  EXIT() {
    Animations.getAnimElements().forEach( this.setVisible )
    Animations.getCounterElements().forEach( this.setCount )

    throw Error("Unsupported feature")
  }

  /**
   * @description Returns the list of elements that contains this class idenftificator 
   * @returns { NodeList<Element> } 
   */
  static getAnimElements() {
    return document.querySelectorAll(`.${Animations.ANIM_CLASS}`)
  }

  /**
   * @deprecated There is no need for a "HIDDEN_CLASSS"; by default its hidden
   * @returns { NodeList<Element> } 
   */
  static getHiddenElements() {
    return document.querySelectorAll(`.${Animations.HIDDEN_CLASS}`) 
  }

  static getCounterElements() {
    return document.querySelectorAll(`.${Animations.COUNTER_CLASS}`) 
  }
  subscribeElements = ( elements = [], options = {} ) => {
    const triggerType = options.triggerType ?? 'onVisible'
    const animType = options.animType ?? 'show'

    switch ( triggerType ) {
      case 'onVisible': {
        const observer = new IntersectionObserver(
          (e, o) => this.onSeen(e, o, this.getAnimation(animType)), 
          { 
            threshold: Animations.INTERSECTION_THRESHOLD
          } 
        )
        elements.forEach(el => {
          observer.observe(el)
        })
        break;
      }
    }
  }

  getAnimation = (animType = "show") => {
    switch ( animType ) {
      case 'show': return this.setVisible
      case 'count': return this.setCount 
    }
  }

  onSeen = ( entries = [], observer = null, animationFunction = null ) => {
    if ( !observer ) return
    
    entries.forEach( ( entry, entryIndex ) => {
      const { target: element } = entry
      if ( entry.isIntersecting ) {
        observer.unobserve(element)
        const animationDelay = element.dataset[Animations.ANIMATION_DELAY] ?? 0
        const animationDuration = element.dataset[Animations.ANIMATION_DURATION] ?? null

        if ( animationDuration ) {
          element.style.animationDuration = animationDuration + 'ms'
        }
        
        if ( animationDelay ) {
          return setTimeout(() => {
            animationFunction && animationFunction(element)
          }, animationDelay)
        }

        animationFunction && animationFunction(element)
      }
    } )
  }

  setVisible(element) {
    element.classList.toggle(Animations.HIDDEN_CLASS, false)
    element.classList.toggle(Animations.SHOW_CLASS  , true)
  }

  setCount(element){
    const { dataset } = element
    const endCount = dataset.countEnd ?? 0

    element.style.setProperty('--COUNTER', endCount)
  }



}


// Just the logger, simple stuff

/**
 * @param { String } msg Message to print
 * @param { 'info' | 'warn' | 'error' | 'success' } type Type of log\
 */
function log( msg = "Loggger message.", type = 'info' ) {
  const color = {
     "info": 'grey',
     "warn": "#FF8D08",
     'error': '#CC1313',
     'success': '#44BB55'
  }[type];

  console.log(`%c[Animations][v${Animations.VERSION}]\t${msg}`,
    `color: ${color}; border-left: 2px solid currentColor; padding: 2px 4px`
  )
}