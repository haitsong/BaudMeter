/**
 * Created by chiwan on 7/28/2015.
 */
angular.module('eventLib', [])

    .service('eventService', function () {
    var subscribers = {};

    this.register = function (topic, callback) {
        var callbacks = subscribers[topic];
        if (!callbacks) {
            callbacks = [];
            subscribers[topic] = callbacks;
        }
        callbacks.push(callback);
    };

    this.publish = function (topic, message) {
        var callbacks = subscribers[topic];
        angular.forEach(callbacks, function (callback) {
            callback(message);
        })
    }
});

