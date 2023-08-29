


class MovingHeart {
    /**@type {HTMLCanvasElement} */
    heart = null;
    /**@type {HTMLElement} */
    parent = null;
    /**@type {Boolean} */
    parentCenter = false;
    /**@type {HTMLElement} */
    movingParent = null;
    /**@type {Boolean} */
    movingParentCenter = false;
    /**@type {Number} */
    static moveDuration = 500;
    /**@type {Number} */
    startMove = -1;
    /**@type {Number} */
    lastTime = -1;
    /**@type {Boolean} */
    removed = false;

    constructor(/**@type {HTMLElement} */ initialParent, /**@type {Boolean} */ initialParentCenter) {
        this.heart = document.createElement("CANVAS");
        this.heart.className = "MOVING_HEART";
        this.heart.width = heart_small.width;
        this.heart.height = heart_small.height;
        
        var ctx = this.heart.getContext("2d");
        ctx.drawImage(heart_small, 0, 0);
    
        document.body.appendChild(this.heart);
        //setTimeout(this.fadeIn.bind(this), 10);

        this.parent = initialParent;
        this.parentCenter = initialParentCenter;

        window.requestAnimationFrame((time) => {
            this.update(time);
        })
    }

    fadeIn() {
        this.heart.classList.add("MOVING_HEART_VISIBLE");
    }

    fadeOut() {
        this.heart.classList.remove("MOVING_HEART_VISIBLE");
    }

    remove() {
        this.heart.remove();
        this.removed = true;
    }

    moveTo(/**@type {HTMLElement} */ newParent, /**@type {Boolean} */ center = false) {
        this.movingParent = newParent;
        this.startMove = this.lastTime;
        this.movingParentCenter = center;
    }

    getRectangleFor(/**@type {HTMLElement} */ element, center = false) {
        var pos = element.getBoundingClientRect();
        return {
            top: pos.top + pos.height/2 - this.heart.height/2,
            left: pos.left + (center ? pos.width/2 : -this.heart.width/2 - 15) - this.heart.width/2
        };
    }

    getValue(start, end, time) {
        return start + (end-start)*Math.sin((time/MovingHeart.moveDuration)*Math.PI/2);
    }

    update(time) {
        if (this.removed) {
            return;
        }
        this.lastTime = time;
        if (this.startMove < 0) {
            var rect = this.getRectangleFor(this.parent, this.parentCenter);
            this.heart.style.top = rect.top + "px";
            this.heart.style.left = rect.left + "px";
            window.requestAnimationFrame(this.update.bind(this));
            return;
        }
        var timer = Math.min(time - this.startMove, MovingHeart.moveDuration);
        var startPos = this.getRectangleFor(this.parent, this.parentCenter);
        var endPos = this.getRectangleFor(this.movingParent, this.movingParentCenter);

        this.heart.style.top = this.getValue(startPos.top, endPos.top, timer) + "px";
        this.heart.style.left = this.getValue(startPos.left, endPos.left, timer) + "px";

        if (timer >= MovingHeart.moveDuration) {
            this.startMove = -1;
            this.parent = this.movingParent;
            this.parentCenter = this.movingParentCenter;
            this.movingParent = null;
        }
        
        window.requestAnimationFrame(this.update.bind(this));
    }

}