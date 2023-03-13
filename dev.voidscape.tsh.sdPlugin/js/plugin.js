DestinationEnum = Object.freeze({'HARDWARE_AND_SOFTWARE': 0, 'HARDWARE_ONLY': 1, 'SOFTWARE_ONLY': 2});

var websocket = null;
var settingsCache = {};

function SetTitle(context, titleText) {
    var json = {
        "event": "setTitle",
        "context": context,
        "payload": {
            "title": "" + titleText,
            "target": DestinationEnum.HARDWARE_AND_SOFTWARE
        }
    };

    websocket.send(JSON.stringify(json));
}

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
    pluginUUID = inPluginUUID

    websocket = new WebSocket("ws://127.0.0.1:" + inPort);

    function registerPlugin(inPluginUUID) {
        var json = {
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        };
        websocket.send(JSON.stringify(json));
    };

    websocket.onopen = function () {
        registerPlugin(pluginUUID);
    };

    websocket.onmessage = function (evt) {
        var jsonObj = JSON.parse(evt.data);
        console.log("[TSH] OnMessage Event Received: ", jsonObj);
        var event = jsonObj['event'];
        var action = jsonObj['action'];
        var context = jsonObj['context'];
        var jsonPayload = jsonObj['payload'] || {};

        if (event == "keyDown") {
        }
        else if (event == "keyUp") {
            switch(action){
                case "dev.voidscape.tsh.teamonescoreup":
                    ScoreUpAction.onKeyUp(context, 1);
                    break;
                case "dev.voidscape.tsh.teamonescoredown":
                    ScoreDownAction.onKeyUp(context, 1);
                    break;
                case "dev.voidscape.tsh.teamtwoscoreup":
                    ScoreUpAction.onKeyUp(context, 2);
                    break;
                case "dev.voidscape.tsh.teamtwoscoredown":
                    ScoreDownAction.onKeyUp(context, 2);
                    break;
                case "dev.voidscape.tsh.swap":
                    SwapAction.onKeyUp(context);
                    break;
                case "dev.voidscape.tsh.bestof":
                    BestOfAction.onKeyUp(context);
                    break;
                case "dev.voidscape.tsh.match":
                    MatchAction.onKeyUp(context);
                    break;
                case "dev.voidscape.tsh.phase":
                    PhaseAction.onKeyUp(context);
                    break;
                case "dev.voidscape.tsh.reset":
                    ResetAction.onKeyUp(context);
                    break;
                case "dev.voidscape.tsh.setselector":
                    SetSelectorAction.onKeyUp(context);
                    break;
            }
        }
        else if (event == "willAppear") {
            switch(action){
                case "dev.voidscape.tsh.bestof":
                    BestOfAction.SetSettings(context, jsonPayload['settings']);
                    break;
                case "dev.voidscape.tsh.match":
                    MatchAction.SetSettings(context, jsonPayload['settings']);
                    break;
                case "dev.voidscape.tsh.phase":
                    PhaseAction.SetSettings(context, jsonPayload['settings']);
                    break;
                case "dev.voidscape.tsh.reset":
                    ResetAction.SetSettings(context, jsonPayload['settings']);
                    break;
                case "dev.voidscape.tsh.player":
                    PlayerAmountAction.SetSettings(context, jsonPayload['settings']);
                    break;
            }
        }
        else if (event == "willDisappear") {
        }
        else if (event == "sendToPlugin") {
            console.log("[TSH] sendToPlugin Received: ", jsonPayload);
        }
        else if (event == "didReceiveSettings") {
            console.log("[TSH] Received Settings Payload: ", jsonPayload);
            if (jsonPayload != null && jsonPayload['settings'] != null) {
                switch(action){
                    case "dev.voidscape.tsh.bestof":
                        BestOfAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.phase":
                        PhaseAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.match":
                        MatchAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.reset":
                        ResetAction.SetSettings(context, jsonPayload['settings']);
                        break;
                }
            }
        }
    };

    websocket.onclose = function () {
        // Websocket is closed
    };
};

var ScoreUpAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context, teamNumber) {
        fetch("http://127.0.0.1:5000/team" + teamNumber + "-scoreup", {
                method: "GET"
        });
    },
    LogMessage: function (message) {
        var json = {
            "event": "logMessage",
            "payload": {
                "message": message
            }
        };

        websocket.send(JSON.stringify(json));
        console.log("Log: ", message);
    }
};

var ScoreDownAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context, teamNumber) {
        fetch("http://127.0.0.1:5000/team" + teamNumber + "-scoredown", {
                method: "GET"
        });
    },
    LogMessage: function (message) {
        var json = {
            "event": "logMessage",
            "payload": {
                "message": message
            }
        };

        websocket.send(JSON.stringify(json));
        console.log("Log: ", message);
    }
};

var ResetAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context) {
        settings = settingsCache[context];
        choice = settings['reset-choice'] == null ? "reset-scores" : settings['reset-choice'];
        fetch("http://127.0.0.1:5000/" + choice, {
                method: "GET"
        });
    },
    SetSettings: function (context, settings) {
        var json = {
            "event": "setSettings",
            "context": context,
            "payload": settings
        };
        websocket.send(JSON.stringify(json));
        console.log(JSON.stringify(json));
        settingsCache[context] = settings;
    },
    LogMessage: function (message) {
        var json = {
            "event": "logMessage",
            "payload": {
                "message": message
            }
        };

        websocket.send(JSON.stringify(json));
        console.log("Log: ", message);
    }
};

var SwapAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context) {
        settings = settingsCache[context];
        fetch("http://127.0.0.1:5000/swap-teams", {
                method: "GET"
        });
    },
    SetSettings: function (context, settings) {
        var json = {
            "event": "setSettings",
            "context": context,
            "payload": settings
        };
        websocket.send(JSON.stringify(json));
        settingsCache[context] = settings['settings'];
    },
    LogMessage: function (message) {
        var json = {
            "event": "logMessage",
            "payload": {
                "message": message
            }
        };

        websocket.send(JSON.stringify(json));
        console.log("Log: ", message);
    }
};

var SetSelectorAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context) {
        settings = settingsCache[context];
        fetch("http://127.0.0.1:5000/sets", {
                method: "GET"
        });
    },
    SetSettings: function (context, settings) {
        var json = {
            "event": "setSettings",
            "context": context,
            "payload": settings
        };
        websocket.send(JSON.stringify(json));
        settingsCache[context] = settings['settings'];
    },
    LogMessage: function (message) {
        var json = {
            "event": "logMessage",
            "payload": {
                "message": message
            }
        };

        websocket.send(JSON.stringify(json));
        console.log("Log: ", message);
    }
};

var BestOfAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context) {
        settings = settingsCache[context];
        choice = settings['bestOf'] == null ? "1" : settings['bestOf'];
        fetch("http://127.0.0.1:5000/set?best-of=" + choice, {
                method: "GET"
        });
    },
    SetSettings: function (context, settings) {
        var json = {
            "event": "setSettings",
            "context": context,
            "payload": settings
        };
        websocket.send(JSON.stringify(json));
        settingsCache[context] = settings;
    },
    LogMessage: function (message) {
        var json = {
            "event": "logMessage",
            "payload": {
                "message": message
            }
        };
        websocket.send(JSON.stringify(json));
        console.log("Log: ", message);
    }
};

var PhaseAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context) {
        settings = settingsCache[context];
        choice = settings['phase-title'] == null ? "" : settings['phase-title'];
        fetch("http://127.0.0.1:5000/set?phase=" + choice, {
                method: "GET"
        });
    },
    SetSettings: function (context, settings) {
        var json = {
            "event": "setSettings",
            "context": context,
            "payload": settings
        };
        websocket.send(JSON.stringify(json));
        settingsCache[context] = settings;
    },
    LogMessage: function (message) {
        var json = {
            "event": "logMessage",
            "payload": {
                "message": message
            }
        };
        websocket.send(JSON.stringify(json));
        console.log("Log: ", message);
    }
};

var MatchAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context) {
        settings = settingsCache[context];
        choice = settings['match-title'] == null ? "" : settings['match-title'];
        fetch("http://127.0.0.1:5000/set?match=" + settings['match-title'], {
                method: "GET"
        });
    },
    SetSettings: function (context, settings) {
        var json = {
            "event": "setSettings",
            "context": context,
            "payload": settings
        };
        websocket.send(JSON.stringify(json));
        settingsCache[context] = settings;
    },
    LogMessage: function (message) {
        var json = {
            "event": "logMessage",
            "payload": {
                "message": message
            }
        };
        websocket.send(JSON.stringify(json));
        console.log("Log: ", message);
    }
};

var PlayerAmountAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context) {
        settings = settingsCache[context];
        choice = settings['player-amount'] == null ? "1" : settings['player-amount'];
        fetch("http://127.0.0.1:5000/set?players=" + choice, {
                method: "GET"
        });
    },
    SetSettings: function (context, settings) {
        var json = {
            "event": "setSettings",
            "context": context,
            "payload": settings
        };
        websocket.send(JSON.stringify(json));
        settingsCache[context] = settings;
    },
    LogMessage: function (message) {
        var json = {
            "event": "logMessage",
            "payload": {
                "message": message
            }
        };
        websocket.send(JSON.stringify(json));
        console.log("Log: ", message);
    }
};

var CharacterAmountAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context) {
        settings = settingsCache[context];
        choice = settings['character-amount'] == null ? "1" : settings['character-amount'];
        fetch("http://127.0.0.1:5000/set?characters=" + choice, {
                method: "GET"
        });
    },
    SetSettings: function (context, settings) {
        var json = {
            "event": "setSettings",
            "context": context,
            "payload": settings
        };
        websocket.send(JSON.stringify(json));
        settingsCache[context] = settings;
    },
    LogMessage: function (message) {
        var json = {
            "event": "logMessage",
            "payload": {
                "message": message
            }
        };
        websocket.send(JSON.stringify(json));
        console.log("Log: ", message);
    }
};