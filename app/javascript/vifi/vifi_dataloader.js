/**
 * Data Loader Module
 * Handles asynchronous data loading from the backend API
 * 
 * @file vifi_dataloader.js
 * @author Jani Luukkanen <janiluuk@gmail.com>
 * 
 * @namespace Vifi.DataLoader
 * @description
 * This module manages:
 * - API request queuing and execution
 * - JSONP requests for cross-domain calls
 * - Callback handling
 * - Request prioritization
 */

/**
 *
 *  Vifi Engine Dataloader
 *
 *
 */

// Loads everything asynchronously, pretty simple ability to track
// incoming data.

Vifi.Engine.DataLoader = {
    _dataSets: [],
    _loaded: 0,
    _waterfalls: [],
    name: "Data Loader",

    addDataSet: function(set) {
        if (set.key == null) throw ("Trying to add Data item with no key, url: " + set.getUrl());
        this._dataSets.push(set);
    },
    // Takes multiple data items and loads them one at at time passing the data,
    // from each call back into the next call.
    addWaterfall: function(key, sets) {
        if (!key) throw ("Trying to add Waterfall with no key");
        this._waterfalls.push(new Vifi.Engine.DataLoader.Waterfall(key, sets));
    },


    init: function() {
        this._loaded = this._dataSets.length + this._waterfalls.length;
        var _this = this;
        this.trigger("dataloader:loading");

        if (this._dataSets.length == 0 && this._waterfalls.length == 0) {
            this.trigger("dataloader:loaded");
            return;
        }

        _.each(this._waterfalls, function(item) {
            item.bind("all", function() {
                this.loadedItem();
            }, _this);
            item.load();
        })
        _.each(this._dataSets, function(data) {
            $log(" Fetching data from url: " + data.getUrl() + " data type: " + data.dataType)
            $.ajax({
                url: data.getUrl(),
                dataType: data.dataType,
                data: data.getParams(),
                success: function(input) {
                    $log("<<< DATA LOADING SUCCESS >>>")
                    if (typeof input == "string") input = $.parseJSON(input)
                    Vifi.Engine.DataStore.set(data.key, data.parser(input));
                    _this.loadedItem();
                },
                error: function() {
                    $error("!!! ERROR LOADING DATA ITEM " + data.key + "!!!");
                    _this.loadedItem();
                }
            });
        });
    },

    loadedItem: function() {
        this._loaded--;
        if (this._loaded == 0) {
            this.trigger("dataloader:loaded");
        }
    },
}
Vifi.Engine.DataStore = {
    _data: {},
    set: function(key, data) {
        this._data[key] = data;
    },
    get: function(key) {
        return this._data[key]
    }
}
_.extend(Vifi.Engine.DataLoader, Backbone.Events);

Vifi.Engine.addModule('DataLoader', Vifi.Engine.DataLoader, {
    callbacks: ['dataloader:loaded']
});

Vifi.Engine.DataLoader.Waterfall = function(key, items) {
    this.datastoreKey = key;
    this.dataItems = items;
    this.currentData = null;
    _.extend(this, Backbone.Events);
}

Vifi.Engine.DataLoader.Waterfall.prototype.load = function() {
    this.currentIndex = 0;
    this.currentData = 0;
    this.loadNextItem();
}

Vifi.Engine.DataLoader.Waterfall.prototype.loadNextItem = function() {
    var dataItem = this.dataItems[this.currentIndex];
    // if(!dataItem) return;
    var _this = this;
    dataItem.startdata = this.currentData;
    $.ajax({
        url: dataItem.getUrl(),
        dataType: dataItem.dataType,
        data: dataItem.getParams(),
        success: function(input) {
            if (typeof input == "string" && data.dataType.toUpperCase() == "JSON") input = $.parseJSON(input);
            _this.currentData = dataItem.parser(input);
            _this.next();
        },
        error: function() {
            _this.error();
        }
    });
}
Vifi.Engine.DataLoader.Waterfall.prototype.next = function() {
    this.currentIndex++;
    if (this.currentIndex == this.dataItems.length) this.done();
    else this.loadNextItem();
}

Vifi.Engine.DataLoader.Waterfall.prototype.done = function() {
    Vifi.Engine.DataStore.set(this.datastoreKey, this.currentData);
    this.trigger("waterfall:done");
}
Vifi.Engine.DataLoader.Waterfall.prototype.error = function() {
    $error("Failed to load with depdencies");
    this.trigger("waterfall:error");
}



Vifi.Engine.DataLoader.Data = function() {
    this.method = "GET", this.dataType = "JSONP";
    this.key = null;
    // Can override these (make sure you return something);
    // once done we will parse the data then pass it to the data
    // handler

    this.parser = $noop;
}

// you can override this if you want to.
Vifi.Engine.DataLoader.Data.prototype.getUrl = function() {
    return this.url;
}

// Can Override.
Vifi.Engine.DataLoader.Data.prototype.getParams = function() {
    return this.params;
}