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

function grabSettings(context, setting_name, default_value) {
    settings = settingsCache[context];

    return (settings[setting_name] == null || settings[setting_name] == "") ? default_value : settings[setting_name]
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

        switch(event) {
            case "keyDown":
                break;
            case "keyUp":
                switch(action) {
                    case "dev.voidscape.tsh.teamonescoreup":
                        ScoreUpAction.onKeyUp(context, 1);
                        break;
                    case "dev.voidscape.tsh.teamtwoscoreup":
                        ScoreUpAction.onKeyUp(context, 2);
                        break;
                    case "dev.voidscape.tsh.teamonescoredown":
                        ScoreDownAction.onKeyUp(context, 1);
                        break;
                    case "dev.voidscape.tsh.teamtwoscoredown":
                        ScoreDownAction.onKeyUp(context, 2);
                        break;
                    case "dev.voidscape.tsh.swap":
                        SwapAction.onKeyUp(context);
                        break;
                    case "dev.voidscape.tsh.reset":
                        ResetAction.onKeyUp(context);
                        break;
                    case "dev.voidscape.tsh.setselector":
                        SetSelectorAction.onKeyUp(context);
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
                    case "dev.voidscape.tsh.player":
                        PlayerAmountAction.onKeyUp(context);
                        break;
                    case "dev.voidscape.tsh.character":
                        CharacterAmountAction.onKeyUp(context);
                        break;
                }
                break;
            case "willAppear":
            case "didReceiveSettings":
                switch(action) {
                    case "dev.voidscape.tsh.teamonescoreup":
                        ScoreUpAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.teamtwoscoreup":
                        ScoreUpAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.teamonescoredown":
                        ScoreDownAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.teamtwoscoredown":
                        ScoreDownAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.swap":
                        SwapAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.reset":
                        ResetAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.setselector":
                        SetSelectorAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.bestof":
                        BestOfAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.match":
                        MatchAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.phase":
                        PhaseAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.player":
                        PlayerAmountAction.SetSettings(context, jsonPayload['settings']);
                        break;
                    case "dev.voidscape.tsh.character":
                        CharacterAmountAction.SetSettings(context, jsonPayload['settings']);
                        break;
                }
                break;
            case "willDisappear":
                break;
            case "sendToPlugin":
                console.log("[TSH] sendToPlugin Received: ", jsonPayload);
                break;
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
        ip_address = grabSettings(context, "ip-address", "127.0.0.1");
        fetch("http://" + ip_address + ":5000/team" + teamNumber + "-scoreup", {
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

var ScoreDownAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context, teamNumber) {
        ip_address = grabSettings(context, "ip-address", "127.0.0.1");
        fetch("http://" + ip_address + ":5000/team" + teamNumber + "-scoredown", {
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

var ResetAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context) {
        settings = settingsCache[context];
        choice = grabSettings(context, "reset-choice", "reset-scores");
        ip_address = grabSettings(context, "ip-address", "127.0.0.1");
        fetch("http://" + ip_address + ":5000/" + choice, {
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
        ip_address = grabSettings(context, "ip-address", "127.0.0.1");
        fetch("http://" + ip_address + ":5000/swap-teams", {
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

var SetSelectorAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context) {
        ip_address = grabSettings(context, "ip-address", "127.0.0.1");
        fetch("http://" + ip_address + ":5000/open-set", {
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

var BestOfAction = {
    onKeyDown: function (context) {
        console.log("keydown");
    },
    onKeyUp: function (context) {
        choice = grabSettings(context, "bestOf", "1");
        ip_address = grabSettings(context, "ip-address", "127.0.0.1");
        fetch("http://" + ip_address + ":5000/set?best-of=" + choice, {
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
        choice = grabSettings(context, "phase-title", "");
        ip_address = grabSettings(context, "ip-address", "127.0.0.1");
        fetch("http://" + ip_address + ":5000/set?phase=" + choice, {
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
        choice = grabSettings(context, "match-title", "");
        ip_address = grabSettings(context, "ip-address", "127.0.0.1");
        fetch("http://" + ip_address + ":5000/set?match=" + choice, {
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
        choice = grabSettings(context, "player-amount", "1");
        ip_address = grabSettings(context, "ip-address", "127.0.0.1");
        fetch("http://" + ip_address + ":5000/set?players=" + choice, {
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
        choice = grabSettings(context, "character-amount", "1");
        ip_address = grabSettings(context, "ip-address", "127.0.0.1");
        fetch("http://" + ip_address + ":5000/set?characters=" + choice, {
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