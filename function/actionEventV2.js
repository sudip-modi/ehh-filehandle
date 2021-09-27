
//console.log("app", app)
class ActionEvent {
    constructor(activeListerners) {
       // console.log(activeListerners)
        this._activeListners = [activeListerners];
      //  console.log(this._activeListners);
        this._events = {};
        console.log("events ",this._events);
        
        //  this.on('click', e => this.handleEvent(e));
         this.createListeners(activeListerners);
        //  console.log(elements4Event)

        // this.on('selection', e => this.onSelection(e));
        // //  this.on('mouseenter', e => this.onMouseEnter(e));
        // //   this.on('mouseleave', e => this.onMouseLeave(e));
        // this.on('change', e => this.onSelection(e));
        // // this.on('keypress', e => this.onKeyPress(e));
        // //this.on('keyup', e => this.onKeyUp(e));
        // this.on('handleEvent', e => this.handleEvent(e));
        // this.on('insertText', e => this.insertText(e));
        // this.on('delButtonClicked', e => this.del(e));

    }

    createListeners(entity) {
      //  console.log(entity)
        let events = operate.find(entity, 'on', 'keys')
        //let events = operate.find(window, 'on', 'keys')
        //  console.log(events)
        events.forEach((evt) => {
            //  console.log("adding Event listern",evt.substring(2))
            this.on(evt.substring(2), e => this.handleEvent(e));
            //window[evt] = this.handleEvent
        })
        //  console.clear()
    }
    addListener(eventName, fn) {
    console.log("add listner",eventName, fn);
        this._events[eventName] = this._events[eventName] || [];
        this._events[eventName].push(fn);
     //   console.log(this._events);
        return this;
    }
    on(eventName, fn) {
        return this.addListener(eventName, fn);
    }
    emit(eventName, ...args) {
        let fns = this._events[eventName];
        //  console.log("Emitted",eventName)
        if (!fns) return false;
        fns.forEach((f) => {
            f(...args);
        });
        return true;
    }
    handleEvent(e) {
        console.log("event Happened",e.type,e.target);
    }

}