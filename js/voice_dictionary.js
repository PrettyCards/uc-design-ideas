
class Voice {

    constructor() {
        this.sources = [];
    }

    AddSourceFast(name) {
        this.AddSource(`https://raw.githubusercontent.com/PrettyCards/shops/main/audio/voices/${name}.ogg`);
    }

    AddSource(src) {
        this.sources.push(src);
    }

    GetRandomSource() {
        //console.log(this.sources);
        return getRandomFromArray(this.sources);
    }

    Preload() {
        this.sources.forEach((src) => {
            // The error is usually just "yOu ShOuLd NoT pLaY aUdIo BeFoRe InTeRaCtInG wItH tHe PaGe"
            preloadAudio(src).catch(()=>{});
        })
    }

}

function randomInt(min=0, max=1) { // WILL ALWAYS BE SMALLER THAN THE MAX VALUE!
    return min + Math.floor(Math.random() * (max-min));
}

function getRandomFromArray(array) {
    if (array.length <= 0) {
        return undefined;
    }
    if (array.length == 1) {
        return array[0];
    }
    return array[randomInt(0, array.length)];
}

function preloadAudio(url) {
    return new Promise((resolve, reject) => {
        var audio = new Audio();
        audio.onload = function() {resolve(audio)};
        audio.onerror = reject;
        audio.src = url;
    })
}

class VoiceDictionary {

    static INSTANCE = new VoiceDictionary();
    #voices;

    constructor() {
        if (VoiceDictionary.INSTANCE != null) {
            throw "Only one instance of VoiceDictionary allowed! Use VoiceDictionary.INSTANCE instead!";
        }
        this.#voices = {};
    }

    AddVoice(name = "", sources = [], fast = true) {
        if (this.#voices[name]) {
            return;
        }
        var voice = new Voice();
        if (typeof(sources) == "string") {
            sources = [sources];
        }
        var fnc;
        if (fast) {
            fnc = (src) => {voice.AddSourceFast(src)};
        } else {
            fnc = (src) => {voice.AddSource(src)};
        }
        sources.forEach(fnc);
        this.#voices[name] = voice;
        voice.Preload();
        return voice;
    }

    GetVoice(name) {
        return this.voices[name];
    }

}