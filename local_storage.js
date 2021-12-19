window.altStorage = {
    gamedata: {},

    setItem: function (id, val) {
        return this.gamedata[id] = String(val);
    },

    getItem: function (id) {
        return this.gamedata[id];
    },

    removeItem: function (id) {
        return delete this.gamedata[id];
    },

    clearData: function () {
        return this.gamedata = {};
    }
};


function LocalStorage(){
    this.highScore = "highScore";
    this.gameState = "gameState";

    var supported_storage = this.LocalStorageSupported();
    this.storage = supported_storage ? window.localStorage : window.altStorage;
}

LocalStorage.prototype.LocalStorageSupported = function () {
    try {
        var storage = window.localStorage;
        return true;
    } catch (error) {
        return false;
    }
};

LocalStorage.prototype.getHighScore = function () {
    return this.storage.getItem(this.highScore);
};

LocalStorage.prototype.setHighScore = function () {
    return this.storage.setItem(this.highScore, score);
};

LocalStorage.prototype.getGameState = function () {
    var stateJSON = this.storage.getItem(this.gameState);
    return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorage.prototype.setGameState = function (state) {
    this.storage.setItem(this.gameState, JSON.stringify(state));
};

