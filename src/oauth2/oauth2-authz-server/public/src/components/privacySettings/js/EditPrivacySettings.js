/*!
GPII OAuth2 server

Copyright 2014-2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


// Declare dependencies
/* global fluid, jQuery */

var gpii = gpii || {};

(function ($, fluid) {
    "use strict";

    fluid.defaults("gpii.oauth2.editPrivacySettings", {
        gradeNames: ["gpii.oauth2.privacySettingsDialog", "autoInit"],
        requestInfos: {
            fetchDecisionPrefs: {
                url: "/authorizations/%authDecisionId/preferences",
                type: "get"
            },
            saveDecisionPrefs: {
                url: "/authorizations/%authDecisionId/preferences",
                type: "put"
            }
        },
        listeners: {
            "onCreate.fetchDecisionPrefs": "{that}.fetchDecisionPrefs",
            onDone: {
                listener: "{that}.savePrefsAndExit"
            }
        },
        invokers: {
            fetchDecisionPrefs: {
                funcName: "gpii.oauth2.ajax",
                args: ["{that}.options.requestInfos.fetchDecisionPrefs.url", {
                    authDecisionId: "{that}.model.clientData.authDecisionId"
                }, {
                    type: "{that}.options.requestInfos.fetchDecisionPrefs.type",
                    dataType: "json",
                    success: "{that}.setInitialSelectedPrefs"
                }]
            },
            savePrefsAndExit: {
                funcName: "gpii.oauth2.editPrivacySettings.savePrefsAndExit",
                args: ["{that}"]
            },
            saveDecisionPrefs: {
                funcName: "gpii.oauth2.ajax",
                args: ["{that}.options.requestInfos.saveDecisionPrefs.url", {
                    authDecisionId: "{that}.model.clientData.authDecisionId"
                }, {
                    type: "{that}.options.requestInfos.saveDecisionPrefs.type",
                    contentType: "application/json",
                    data: {
                        expander: {
                            funcName: "JSON.stringify",
                            args: [{
                                expander: {
                                    func: "{selectionTree}.toServerModel",
                                    args: "{selectionTree}.model.selections"
                                }
                            }]
                        }
                    }
                }]
            }
        }
    });

    gpii.oauth2.editPrivacySettings.savePrefsAndExit = function (that) {
        that.saveDecisionPrefs();
        that.closeDialog();
    };

})(jQuery, fluid);
