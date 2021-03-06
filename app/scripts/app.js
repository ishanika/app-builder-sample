/*jslint browser: true */
/*global app, kendo */
"use strict";

(function (win) {
    everliveImages.init("eyD4rLcMGB8J6ljO");

    win.app = (function () {

        
        // global error handling
        var showAlert = function (message, title, callback) {

            if (win.navigator.simulator) {
                win.alert(message);
            } else {
                navigator.notification.alert(message, callback, title, 'OK');
            }
        };

        var onDeviceReady = function () {
            win.addEventListener('erroring', function (e) {
                e.preventDefault();
                console.log("Error", e);
                var message = e.message + "' from " + e.filename + ":" + e.lineno;
                showAlert(message, 'Error occurred');
                return true;
            });
            win.app.storeStock.read();
            
            //Initialize the KendoUI app 
            var mobileApp = new kendo.mobile.Application(document.body, {
                skin: "flat",
                initial: win.navigator.simulator ? "views/menu.html" : "views/intro.html",
                init: function() {
                    // Increase the click threshold for responsiveness
                    // See http://www.telerik.com/forums/click-event-does-not-fire-reliably
                    kendo.UserEvents.defaultThreshold(50);
                }
            });
            
            win.app.mobileApp = mobileApp;
            
            if (!win.navigator.simulator) {
                navigator.splashscreen.hide();
            }
        };

        if (!win.navigator.simulator) {
            //seem to have issues if this isn't set to false
            win.navigator.simulator = false;
        }

        // Create a single list of products, and use filters rather than having seperate ones for favorites, menu, and shopping cart
        var storeStock = new kendo.data.extensions.LocalStorageDataSource({
                itemBase: 'items-kendo',
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            title: { type: "string"},
                            description: { type: "string"},
                            price: { type: "number"},
                            imgSrc: { type: "string"},
                            favorited: { type: "boolean", defaultValue: false},
                            incart: { type: "boolean", defaultValue: false},
                            qty: { type: "number"},
                            itemPrice: { type: "number", defaultValue: 0}
                        }
                    }
                },
                change: function (e) {
                    //console.log(e);
                },
                aggregate: [
                    { field: "id", aggregate: "count" },
                    { field: "itemPrice", aggregate: "sum" }
                ]
            });

        // this function is called by Cordova when the application is loaded by the device
        document.addEventListener("deviceready",  onDeviceReady);

        return {
            alert: showAlert,
            storeStock: storeStock,
            debug:  function () {
                //Helper function to run debug code on a device. 
            },
        };

    }());
}(window));
