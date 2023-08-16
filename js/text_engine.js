
var defaultVoice = VoiceDictionary.INSTANCE.AddVoice("default", "default");

class TypedText {

    constructor(text, parent, fullMute = false, animDispatcher = null) {
        this.removed = false;
        this.defaultSpeed = 33;
        this.speed = this.defaultSpeed; // The miliseconds between displaying letters.
        this.nextWait = this.speed;
        this.container = document.createElement("DIV");
        parent.appendChild(this.container);
        this.text = text;
        this.currentPage = -1;
        this.currentLetter = 0;
        this.instant = false;
        this.userInstant = false;
        this.noskip = false;
        this.defaultVoice = defaultVoice;
        this.voice = this.defaultVoice;
        this.audio = new Audio();
        this.novoice = false;
        this.alwaysMute = fullMute;
        this.animDispatcher = animDispatcher;
        this.isTalking = false;
        this.onremove = function() {};
        if (typeof(text) == "string") {
            this.text = [text];
        }
        this.InitTextCommands();
        this.NextPage();
    }

    ResetTextArea() {
        this.container.innerHTML = "";
        this.StartNewParagraph(true);
        this.currentLetter = 0;
    }

    SetHeight(sizeParent = true) {
        while (!this.IsPageDone()) {
            this.Progress();
        }
        var sizeElem = sizeParent ? this.container.parentElement : this.container;
        var copy = sizeElem.cloneNode(true);
        copy.style.height = "";
        copy.style.width = sizeElem.getBoundingClientRect().width + "px";
        copy.style.transition = "none";
        document.body.appendChild(copy);
        var height = copy.getBoundingClientRect().height;
        sizeElem.style.height = height + "px";
        copy.remove();
        this.ResetTextArea();
    }

    // This one is NOT called automatically! It may be called optionally when necessary!
    // Also does not take automatic line breaks into account, I think . . . ?
    SetWidth(sizeParent = false) {
        var savedOpacity = this.container.style.opacity;
        this.container.style.opacity = "0";
        while (!this.IsPageDone()) {
            this.Progress();
        }
        var sizeElem = sizeParent ? this.container.parentElement : this.container;
        setTimeout(() => {
            console.log("sizeElem BoundingClientRect in setTimeout: ", sizeElem.getBoundingClientRect());
            var width = sizeElem.getBoundingClientRect().width;
            sizeElem.style.width = (width * 1.15) + "px";
            this.container.style.opacity = savedOpacity;
            this.ResetTextArea();
        }, 1);
        
        //copy.remove();
        //this.ResetTextArea();
    }

    NextPage() {
        if (this.animDispatcher) {
            this.animDispatcher.ChangeExpression("default");
        }
        this.instant = false;
        this.userInstant = false;
        this.ResetTextArea();
        this.currentPage++;
        this.voice = this.defaultVoice;
        if (this.currentPage >= this.text.length) {
            this.Remove("END_OF_TEXT");
            return;
        }
        this._AnimMouthOpen();
        this.SetHeight();
        this.Progress();
        this.TimeLoop();
    }

    InitTextCommands() {
        // Returns true if a new iteration of the Progress function should be called immediately after.
        this.textCommands = {
            style: (className) => {
                this.StartNewSpan(className);
                return true;
            },
            speed: (ms) => {
                if (ms === "default" || ms === "reset") {
                    this.speed = this.defaultSpeed;
                } else {
                    this.speed = Number(ms);
                }
                return false;
            },
            w: (ms) => {
                this.nextWait = Number(ms) || 0;
                return false;
            },
            instant: (arg) => {
                this.instant = arg === "" || arg === "on" || arg === "true";
                /*
                if (this.instant) {
                    clearTimeout(this.lastTimeout);
                } else {
                    this.TimeLoop();
                }
                */
                return false;
            },
            noskip: (arg) => {
                this.noskip = arg === "" || arg === "on" || arg === "true";
                if (this.noskip) {
                    this.userInstant = false;
                }
                return true;
            },
            novoice: (arg) => {
                this.novoice = true;
                return true;
            },
            voice: (arg) => {
                this.novoice = false;
                if (arg == "") {
                    return true;
                }
                // Insert Voice changing part here
                return true;
            },
            face: (arg) => {
                if (this.animDispatcher) {
                    this.animDispatcher.ChangeExpression(arg);
                }
                return true;
            }
        }

        this.textCommands.expression = this.textCommands.face; // Alias. IDK why.
    }

    UserSkip() {
        if (!this.noskip) {
            this.userInstant = true;
            this.Progress();
            return true;
        }
        return false;
    }

    Remove(source = "AUTO") {
        this.removed = true;
        clearTimeout(this.lastTimeout);
        this.container.remove();
        this.onremove(source);
    }

    StartNewParagraph(reset = false) {
        this.currentParagraph = document.createElement("DIV"); // Bootstrap and other stuff mess with paragraphs, so I had to change this.
        this.currentParagraph.className = "PrettyCards_UTTextParagraph";
        this.container.appendChild(this.currentParagraph);
        this.StartNewSpan((this.currentSpan && !reset) ? this.currentSpan.className : "");
        //this.StartNewSpan("");
        return this.currentParagraph;
    }

    StartNewSpan(className) {
        this.currentSpan = document.createElement("SPAN");
        //this.currentSpan.style.display = "inline";
        this.currentSpan.className = className;
        this.currentParagraph.appendChild(this.currentSpan);
        return this.currentSpan;
    }

    _AnimMouthOpen() {
        if (this.animDispatcher && this.animDispatcher.stage && !this.isTalking) {
            this.isTalking = true;
            this.animDispatcher.OnMouthOpenStart();
        }
    }

    _AnimMouthClose() {
        if (this.animDispatcher && this.animDispatcher.stage && this.isTalking) {
            this.isTalking = false;
            this.animDispatcher.OnMouthOpenFinish(); // Let's try putting this here . . . Oh, god, the code is looking unorganized already. Why must this be so complicated?!
        }
    }

    Progress() {
        if (this.IsPageDone()) {
            this._AnimMouthClose();
            return;
        }
        var currStr = this.text[this.currentPage];
        var isSkipped = this.currentLetter > 0 && currStr.charAt(this.currentLetter-1) === "\\";
        var nextChar = currStr.charAt(this.currentLetter);
        // "[" indicated the beginning of a command UNLESS skipped, therefore should be redirected to the outer if's "else" part.
        // "\\" indicates the skipping of a character (unless skipped), but it should not be displayed, therefore nothing should happen in that case.
        if (nextChar !== "[" || isSkipped) {
            if (nextChar !== "\\" || isSkipped) {
                if (nextChar === "\n") {
                    this.StartNewParagraph();
                } else if (nextChar === "\r") {
                    this.currentSpan.innerHTML += "<br>";
                } else {
                    this.currentSpan.innerHTML += nextChar;
                    if ((!this.instant) && (!this.userInstant) && (!this.novoice) && (!(nextChar === " "))) {
                        if (!this.alwaysMute) {
                            this.audio = new Audio(this.voice.GetRandomSource());
                            this.audio.play();
                        }
                        if (this.animDispatcher) {
                            this.animDispatcher.OnMouthOpenLetter();
                        }
                    }
                }
            }
            this.currentLetter++;
        } else {
            // Command Code. Buckle up, cuz this will be a wild ride!
            var commandEnd = currStr.indexOf("]", this.currentLetter);
            if (commandEnd < 0) {
                throw "Error in command parsing for string: " + currStr;
            }
            var commandStr = currStr.substring(this.currentLetter, commandEnd + 1);
            var argSepPos = commandStr.indexOf(":");
            var cmdName;
            var cmdArg = "";
            if (argSepPos < 0) {
                cmdName = commandStr.substring(1, commandStr.length-1);
            } else {
                cmdName = commandStr.substring(1, argSepPos);
                cmdArg = commandStr.substring(argSepPos + 1, commandStr.length-1);
            }

            this.currentLetter = commandEnd + 1;

            var cmdFunc = this.textCommands[cmdName];
            if (!cmdFunc) {
                throw `Invalid command name "${cmdName}" in string: ${currStr}`;
            }
            if (cmdFunc(cmdArg)) {
                this.Progress();
            }
        }
        if ( (this.instant || this.userInstant) && !this.IsPageDone()) {
            this.Progress();
        }

        /*
        if (this.IsPageDone() && !this.removed) {
            if (this.animDispatcher) {
                this.animDispatcher.OnMouthOpenFinish(); // Let's try putting this here . . . Oh, god, the code is looking unorganized already. Why must this be so complicated?!
            }
        }
        */
    }

    IsPageDone() {
        return this.currentLetter >= this.text[this.currentPage].length;
    }

    TimeLoop() {
        if (!this.IsPageDone()) {
            this.lastTimeout = setTimeout(function() {
                this.nextWait = this.speed;
                this.Progress();
                this.TimeLoop();
            }.bind(this), this.nextWait);
        } else {
            this._AnimMouthClose();
        }
    }

}