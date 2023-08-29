

class BinaryQuestion {

    yes;
    no;
    container;
    current_choice = -1;
    moving_heart;
    fading_out = false;
    cb = () => {};

    constructor() {
        this.container = document.createElement("DIV");
        this.container.className = "BINARY_CHOICE_CONTAINER";

        this.yes = document.createElement("DIV");
        this.yes.innerHTML = "YES";
        this.yes.onmouseenter = () => {this.setChoice(true);}
        this.yes.onclick = () => {this.doneChoice(true);}

        this.no = document.createElement("DIV");
        this.no.innerHTML = "NO";
        this.no.onmouseenter = () => {this.setChoice(false);}
        this.no.onclick = () => {this.doneChoice(false);}

        var separator = document.createElement("DIV");
        separator.style.width = "100%";
        
        this.container.appendChild(this.yes);
        this.container.appendChild(separator);
        this.container.appendChild(this.no);

        document.body.appendChild(this.container);
        setTimeout(this.fadeIn.bind(this), 10);

        this.moving_heart = new MovingHeart(separator, true);
    }

    fadeIn() {
        this.container.classList.add("BINARY_CHOICE_CONTAINER_VISIBLE");
        this.moving_heart.fadeIn();
    }

    fadeOut() {
        this.container.classList.remove("BINARY_CHOICE_CONTAINER_VISIBLE");
        this.moving_heart.fadeOut();
        this.fading_out = true;
    }

    remove() {
        this.container.remove();
        this.moving_heart.remove();
    }

    setChoice(answerYes = true) {
        if (this.fading_out) {
            return;
        }
        if (this.current_choice == 0) {
            this.no.classList.remove("BINARY_CHOSEN");
        } else {
            this.yes.classList.remove("BINARY_CHOSEN");
        }
        this.current_choice = Number(answerYes);
        if (this.current_choice == 0) {
            this.no.classList.add("BINARY_CHOSEN");
            this.moving_heart.moveTo(this.no, true);
        } else {
            this.yes.classList.add("BINARY_CHOSEN");
            this.moving_heart.moveTo(this.yes, true);
        }
    }

    setOnChoose(/**@type {function} */ cb) {
        this.cb = cb;
    }

    doneChoice(answerYes = true) {
        if (this.fading_out) {
            return;
        }
        this.cb(answerYes);
    }

}