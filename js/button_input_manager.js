
// Note: Make this better in the future . . . somehow
class ButtonInputManager {

    static INSTANCE = new ButtonInputManager();

    constructor() {
        if (ButtonInputManager.INSTANCE) {
            throw "Use the INSTANCE!";
        }
        this.acceptListeners = [];
        this.cancelListeners = [];
        this.upListeners = [];
        this.downListeners = [];
        this.leftListeners = [];
        this.rightListeners = [];
    }

    triggerEvent(list = []) {
        list.forEach((func) => {
            func();
        })
    }

}

bindKey(["z", "Enter"], {
    onPressed: () => {ButtonInputManager.INSTANCE.triggerEvent(acceptListeners);}
})

bindKey(["x", "Shift"], {
    onPressed: () => {ButtonInputManager.INSTANCE.triggerEvent(cancelListeners);}
})

bindKey("ArrowLeft", {
    onPressed: () => {ButtonInputManager.INSTANCE.triggerEvent(leftListeners);}
})

bindKey("ArrowRight", {
    onPressed: () => {ButtonInputManager.INSTANCE.triggerEvent(rightListeners);}
})

bindKey("ArrowUp", {
    onPressed: () => {ButtonInputManager.INSTANCE.triggerEvent(upListeners);}
})

bindKey("ArrowDown", {
    onPressed: () => {ButtonInputManager.INSTANCE.triggerEvent(downListeners);}
})