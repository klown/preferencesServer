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

    fluid.defaults("gpii.oauth2.privacySettingsDialog", {
        gradeNames: ["fluid.rendererRelayComponent", "autoInit"],
        requestInfos: {
            fetchAvailableAuthorizedPrefs: {
                url: "/available-authorized-preferences/%clientId",
                type: "get"
            }
        },
        dialogOptions: {
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 500,
            close: function () {
                // To restore the dialog container to the initial state for the next render.
                $(this).dialog("destroy");
            }
        },
        selectors: {
            title: ".gpiic-oauth2-privacySettings-editDecision-title",
            description: ".gpiic-oauth2-privacySettings-editDecision-description",
            selection: ".gpiic-oauth2-privacySettings-editDecision-selection",
            cancel: ".gpiic-oauth2-privacySettings-editDecision-cancel",
            done: ".gpiic-oauth2-privacySettings-editDecision-done"
        },
        selectorsToIgnore: ["selection", "cancel", "done"],
        styles: {
            dialogCss: "gpii-oauth2-privacySettings-editDecision-dialog"
        },
        strings: {
            description: "To allow access, please select one or more preferences to share:",
            done: "done",
            cancel: "cancel"
        },
        renderOnInit: true,
        protoTree: {
            title: "${{that}.model.clientData.serviceName}",
            description: {
                markup: {
                    messagekey: "description"
                }
            }
        },
        events: {
            afterInitialSelectedPrefsSet: null,
            afterAuthorizedPrefsSet: null,
            onCreateSelectionTree: {
                events: {
                    "afterInitialSelectedPrefsSet": "afterInitialSelectedPrefsSet",
                    "afterAuthorizedPrefsSet": "afterAuthorizedPrefsSet",
                    "afterRender": "afterRender"
                },
                args: ["{that}"]
            },
            onDone: null,
            onClose: null
        },
        listeners: {
            "onCreate.fetchAuthPrefs": "{that}.fetchAvailableAuthorizedPrefs",
            "afterRender.setCancelButtonText": {
                "this": "{that}.dom.cancel",
                method: "text",
                args: "{that}.options.strings.cancel"
            },
            "afterRender.setDoneButtonText": {
                "this": "{that}.dom.done",
                method: "text",
                args: "{that}.options.strings.done"
            },
            "afterRender.openDialog": {
                listener: "gpii.oauth2.privacySettingsDialog.openDialog",
                args: ["{that}"]
            },
            "afterRender.bindCancel": {
                "this": "{that}.dom.cancel",
                method: "click",
                args: "{that}.closeDialog"
            },
            "afterRender.bindDone": {
                "this": "{that}.dom.done",
                method: "click",
                args: "{that}.fireDone"
            }
        },
        invokers: {
            closeDialog: {
                funcName: "gpii.oauth2.privacySettingsDialog.closeDialog",
                args: ["{that}.dialog", "{that}.events.onClose"]
            },
            fetchAvailableAuthorizedPrefs: {
                funcName: "gpii.oauth2.ajax",
                args: ["{that}.options.requestInfos.fetchAvailableAuthorizedPrefs.url", {
                    clientID: "{that}.model.clientData.oauth2ClientId"
                }, {
                    //TODO: Handle errors
                    dataType: "json",
                    success: "{that}.setAvailableAuthorizedPrefs"
                }]
            },
            setAvailableAuthorizedPrefs: {
                changePath: "availableAuthorizedPrefs",
                value: "{arguments}.0"
            },
            composeRequestURL: {
                funcName: "fluid.stringTemplate",
                args: ["{arguments}.0", {
                    authDecisionId: "{that}.model.clientData.authDecisionId"
                }]
            },
            setInitialSelectedPrefs: {
                changePath: "initialSelectedPrefs",
                value: "{arguments}.0"
            },
            fireDone: {
                "this": "{that}.events.onDone",
                method: "fire"
            }
        },
        model: {
            // clientData is in a structure of:
            // {
            //     serviceName: xx,
            //     authDecisionId: xx,
            //     oauth2ClientId: xx
            // }
            clientData: null,
            availableAuthorizedPrefs: null,
            initialSelectedPrefs: null,
            doneButtonEnabled: false
        },
        modelListeners: {
            "availableAuthorizedPrefs": {
                listener: "{that}.events.afterAuthorizedPrefsSet",
                excludeSource: "init"
            },
            "initialSelectedPrefs": {
                listener: "{that}.events.afterInitialSelectedPrefsSet",
                excludeSource: "init"
            },
            "doneButtonEnabled": {
                listener: "gpii.oauth2.setEnabled",
                args: ["{that}.dom.done", "{that}.model.doneButtonEnabled"]
            }
        },
        components: {
            selectionTree: {
                type: "gpii.oauth2.preferencesSelectionTree",
                container: "{that}.dom.selection",
                createOnEvent: "onCreateSelectionTree",
                options: {
                    availablePrefs: "{privacySettingsDialog}.model.availableAuthorizedPrefs",
                    model: {
                        selections: {
                            expander: {
                                funcName: "gpii.oauth2.selectionTree.toSelectionsModel",
                                args: ["{privacySettingsDialog}.model.initialSelectedPrefs", "{privacySettingsDialog}.model.availableAuthorizedPrefs"]
                            }
                        }
                    },
                    modelRelay: {
                        source: "{selectionTree}.model.hasSelection",
                        target: "{privacySettingsDialog}.model.doneButtonEnabled",
                        backward: "never",
                        singleTransform: {
                            type: "fluid.transforms.identity"
                        }
                    }
                }
            }
        }
    });

    gpii.oauth2.privacySettingsDialog.openDialog = function (that) {
        var dialogOptions = {
            dialogClass: that.options.styles.dialogCss
        };
        var fullDialogOptions = $.extend(true, {}, dialogOptions, that.options.dialogOptions);
        that.dialog = that.container.dialog(fullDialogOptions);
        that.dialog.dialog("open");
    };

    gpii.oauth2.privacySettingsDialog.closeDialog = function (dialog, onCloseEvt) {
        dialog.dialog("close");
        onCloseEvt.fire();
    };

})(jQuery, fluid);
