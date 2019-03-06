
export class SmartImageFactory {
  constructor(observer) {
    this.subscribeToEvents();
    this.observer = observer;
  }

  /**
   * 
   *
   * @param {*} data
   * @memberof SmartImageFactory
   */
  createNewSmartImageObjects(data) {
    const SMART_IMAGES = data.querySelectorAll(SEL_SMART_IMAGE);
    Array.prototype.forEach.call(SMART_IMAGES, element => {
      const newSmartImage = new SmartImage(element, this.observer);
    });
  }

  displaySmartImages() {
    
  }

  subscribeToEvents() {
    // On a content change, the newly-added elements are passed as parameters to a function
    // that finds any smartImages and instantiates controlling objects for each
    PubSub.subscribe(Events.messages.contentChange, (topic, data) => {
      this.createNewSmartImageObjects(data);
    });

    PubSub.subscribe(Events.messages.contentDisplayed, (topic, data) => {
      this.displaySmartImages(data);
    });
  }
}