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
/* global fluid, jQuery, window */

var gpii = gpii || {};

(function ($, fluid) {
    "use strict";

    fluid.defaults("gpii.oauth2.privacySettingsWithPrefs", {
        gradeNames: ["fluid.rendererRelayComponent", "autoInit"],
        requestInfos: {
            removeDecision: {
                url: "/authorizations",
                type: "DELETE"
            },
            fetchDecisionPrefs: {
                url: "/authorizations/%authDecisionId/preferences",
                type: "get"
            },
            saveDecisionPrefs: {
                url: "/authorizations/%authDecisionId/preferences",
                type: "put"
            },
            fetchAvailableAuthorizedPrefs: {
                url: "src/core/available-authorized-preferences/%clientID.json"
            }
        },
        components: {
            editPrivacySettings: {
                type: "gpii.oauth2.editPrivacySettings",
                container: "{privacySettingsWithPrefs}.dom.editDecisionDialog",
                createOnEvent: "onRenderEditDialog",
                options: {
                    requestInfos: "{privacySettingsWithPrefs}.options.requestInfos",
                    model: {
                        clientData: "{privacySettingsWithPrefs}.model.currentClientData"
                    }
                }
            },
            addAuthorizationDialog: {
                type: "gpii.oauth2.addAuthorizationDialog",
                container: "{privacySettingsWithPrefs}.dom.addAuthorizationDialog",
                createOnEvent: "onRenderAddAuthorizationDialog",
                options: {
                    requestInfos: "{privacySettingsWithPrefs}.options.requestInfos",
                    model: {
                        clientData: "{privacySettingsWithPrefs}.model.currentClientData"
                    },
                    listeners: {
                        "authorizationAdded.reload": {
                            listener: "gpii.oauth2.privacySettingsWithPrefs.reload"
                        },
                        "onClose.closeAddServiceMenu": {
                            "this": "{addServiceMenu}",
                            method: "close"
                        }
                    }
                }
            },
            dialogForRemoval: {
                type: "gpii.OKCancelDialog",
                container: "{privacySettingsWithPrefs}.dom.removeDecisionDialog",
                options: {
                    selectors: {
                        dialogContent: "{privacySettingsWithPrefs}.options.selectors.removeDecisionContent"
                    },
                    styles: {
                        dialogClass: "{privacySettingsWithPrefs}.options.styles.dialogForRemovalClass",
                        cancelButtonClass: "{privacySettingsWithPrefs}.options.styles.cancelButtonClass",
                        okButtonClass: "{privacySettingsWithPrefs}.options.styles.okButtonClass"
                    },
                    model: {
                        authDecisionId: null
                    },
                    listeners: {
                        "clickOK.removeDecision": {
                            funcName: "gpii.oauth2.privacySettingsWithPrefs.removeDecision",
                            args: [
                                "{that}",
                                "{privacySettingsWithPrefs}.options.requestInfos.removeDecision.url",
                                "{privacySettingsWithPrefs}.options.requestInfos.removeDecision.type",
                                "{that}.model.authDecisionId"
                            ]
                        }
                    }
                }
            },
            addServiceMenu: {
                type: "gpii.oauth2.servicesMenu",
                container: "{privacySettingsWithPrefs}.dom.addServiceMenu",
                createOnEvent: "afterRender",
                options: {
                    listeners: {
                        "onServiceSelected.addService": {
                            funcName: "gpii.oauth2.privacySettingsWithPrefs.addService",
                            args: ["{privacySettingsWithPrefs}", "{addServiceMenu}", "{arguments}.0", "{arguments}.1"]
                        },
                        "onClose.setFocus": {
                            funcName: "fluid.focus",
                            args: ["{privacySettingsWithPrefs}.dom.addServiceButton"]
                        }
                    },
                    modelListeners: {
                        isMenuOpen: {
                            "this": "{privacySettingsWithPrefs}.dom.addService",
                            method: "toggleClass",
                            args: ["{privacySettingsWithPrefs}.options.styles.addServiceSelected"]
                        }
                    }
                }
            }
        },
        selectors: {
            user: ".gpiic-oauth2-privacySettings-user",
            logout: ".gpiic-oauth2-privacySettings-logout",
            header: ".gpiic-oauth2-privacySettings-header",
            description: ".gpiic-oauth2-privacySettings-description",
            directions: ".gpiic-oauth2-privacySettings-directions",
            removeServiceLabel: ".gpiic-oauth2-privacySettings-removeServiceLabel",
            editButton: ".gpiic-oauth2-privacySettings-edit",
            removeButton: ".gpiic-oauth2-privacySettings-removeService",
            // TODO Rather than ids for serviceName, authDecisionId, and oauth2ClientId, can't we just use their names?
            // If we use ids, then we have multiple elements with the same id (one per authorized service).
            serviceName: "#gpiic-oauth2-privacySettings-serviceName",
            authDecisionId: "#gpiic-oauth2-privacySettings-authDecisionId",
            oauth2ClientId: "#gpiic-oauth2-privacySettings-oauth2ClientId",
            removeDecisionDialog: ".gpiic-oauth2-privacySettings-removeDecision-dialog",
            removeDecisionContent: ".gpiic-oauth2-privacySettings-removeDecision-content",
            editDecisionDialog: ".gpiic-oauth2-privacySettings-editDecision-dialog",
            addService: ".gpiic-oauth2-privacySettings-addService",
            addServiceButton: ".gpiic-oauth2-privacySettings-addServiceButton",
            addServiceMenu: ".gpiic-oauth2-privacySettings-addServiceMenu",
            addAuthorizationDialog: ".gpiic-oauth2-privacySettings-addAuthorizationDialog"
        },
        styles: {
            dialogForRemovalClass: "gpii-oauth2-privacySettings-dialogForRemoval",
            okButtonClass: "gpii-oauth2-privacySettings-removeDecision-ok",
            cancelButtonClass: "gpii-oauth2-privacySettings-removeDecision-cancel",
            addServiceSelected: "gpii-oauth2-privacySettings-addService-selected"
        },
        selectorsToIgnore: ["editButton", "removeButton", "serviceName", "authDecisionId", "oauth2ClientId", "removeDecisionDialog", "removeDecisionContent", "editDecisionDialog", "addService", "addServiceButton", "addServiceMenu", "addAuthorizationDialog"],
        strings: {
            logout: "Log Out",
            header: "Privacy",
            description: "<p>Services listed here will be able to access your " +
                         "GPII preferences. For services which do not appear " +
                         "in this list, you will be given the option to allow " +
                         "or deny access when first encountering each service.</p>" +
                         "<p>Services may include things like a social media web " +
                         "application or an online banking website.</p>",
            directions: "Allow the following services to access my preferences:",
            removeServiceLabel: "remove",
            editLabel: "edit",
            removeLabel: "delete",
            removeDecisionContent: "Remove %serviceName from your list of allowed services?",
            ok: "OK",
            cancel: "cancel"
        },
        model: {
            user: "username"
        },
        renderOnInit: true,
        protoTree: {
            user: "${{that}.model.user}",
            logout: {messagekey: "logout"},
            header: {messagekey: "header"},
            description: {
                markup: {
                    messagekey: "description"
                }
            },
            directions: {messagekey: "directions"}
        },
        tooltipOptions: {
            delay: 0,
            duration: 0,
            position: {
                my: "left+35 bottom-10"
            }
        },
        events: {
            onRenderEditDialog: null,
            onRenderAddAuthorizationDialog: null
        },
        listeners: {
            "afterRender.createTooltips": {
                listener: "gpii.oauth2.privacySettingsWithPrefs.createTooltips",
                args: ["{that}"]
            },
            "afterRender.bindRemove": {
                "this": "{that}.dom.removeButton",
                method: "click",
                args: "{that}.popupDialogForRemoval"
            },
            "afterRender.bindEdit": {
                "this": "{that}.dom.editButton",
                method: "click",
                args: "{that}.renderDialogForEdit"
            },
            "afterRender.bindAddService": {
                "this": "{that}.dom.addServiceButton",
                method: "click",
                args: "{that}.openAddServiceMenu"
            }
        },
        invokers: {
            getClientData: {
                funcName: "gpii.oauth2.privacySettingsWithPrefs.getClientData",
                args: ["{arguments}.0", "{arguments}.1", "{that}.options.selectors.serviceName", "{that}.options.selectors.authDecisionId", "{that}.options.selectors.oauth2ClientId"]
            },
            popupDialogForRemoval: {
                funcName: "gpii.oauth2.privacySettingsWithPrefs.popupDialogForRemoval",
                args: ["{arguments}.0", "{that}"]
            },
            renderDialogForEdit: {
                funcName: "gpii.oauth2.privacySettingsWithPrefs.renderDialogForEdit",
                args: ["{arguments}.0", "{that}"]
            },
            openAddServiceMenu: {
                funcName: "gpii.oauth2.privacySettingsWithPrefs.openAddServiceMenu",
                args: ["{addServiceMenu}", "{arguments}.0"] // event
            }
        }
    });

    gpii.oauth2.privacySettingsWithPrefs.getClientData = function (element, buttonSelector, serviceNameSelector, authDecisionIdSelector, oauth2ClientIdSelector) {
        element = $(element).closest(buttonSelector);
        return {
            serviceName: element.siblings(serviceNameSelector).attr("value"),
            authDecisionId: element.siblings(authDecisionIdSelector).attr("value"),
            oauth2ClientId: element.siblings(oauth2ClientIdSelector).attr("value")
        };
    };

    gpii.oauth2.privacySettingsWithPrefs.createTooltips = function (that) {
        var editButtons = that.locate("editButton");
        var removeButtons = that.locate("removeButton");

        var tooltipOptionsForEdit = $.extend(true, {}, that.options.tooltipOptions, {content: that.options.strings.editLabel});
        var tooltipOptionsForRemove = $.extend(true, {}, that.options.tooltipOptions, {content: that.options.strings.removeLabel});

        fluid.each(editButtons, function (thisEditButton) {
            fluid.tooltip(thisEditButton, tooltipOptionsForEdit);
        });
        fluid.each(removeButtons, function (thisRemoveButton) {
            fluid.tooltip(thisRemoveButton, tooltipOptionsForRemove);
        });
    };

    gpii.oauth2.privacySettingsWithPrefs.popupDialogForRemoval = function (evt, that) {
        var clientData = that.getClientData(evt.target, that.options.selectors.removeButton);
        var dialogContent = fluid.stringTemplate(that.options.strings.removeDecisionContent, {serviceName: clientData.serviceName});

        var dialogForRemoval = that.dialogForRemoval;
        dialogForRemoval.applier.change("dialogContent", dialogContent);
        dialogForRemoval.applier.change("authDecisionId", clientData.authDecisionId);

        dialogForRemoval.open();
    };

    gpii.oauth2.privacySettingsWithPrefs.removeDecision = function (dialog, url, type, authDecisionId) {
        $.ajax({
            url: url + "/" + authDecisionId,
            type: type,
            success: function () {
                window.location.reload(true);
            }
        });
        dialog.close();
    };

    gpii.oauth2.privacySettingsWithPrefs.renderDialogForEdit = function (evt, that) {
        that.applier.change("currentClientData", that.getClientData(evt.target, that.options.selectors.editButton));
        that.events.onRenderEditDialog.fire();
    };

    gpii.oauth2.privacySettingsWithPrefs.openAddServiceMenu = function (menu, event) {
        event.stopPropagation();
        menu.open();
    };

    gpii.oauth2.privacySettingsWithPrefs.addService = function (that, menu, serviceName, oauth2ClientId) {
        menu.keepOpen();
        var clientDataForAdd = {
            serviceName: serviceName,
            oauth2ClientId: oauth2ClientId
        };
        that.applier.change("currentClientData", clientDataForAdd);
        that.events.onRenderAddAuthorizationDialog.fire();
    };

    // The use of this function is not made declaratively on the component tree is to work around
    // an IE issue - https://issues.gpii.net/browse/GPII-1522
    gpii.oauth2.privacySettingsWithPrefs.reload = function () {
        window.location.reload(true);
    };

    fluid.defaults("gpii.oauth2.selectionTreeTemplate", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        selectionTreeTemplate: "../../selectionTree/html/SelectionTreeTemplate.html",
        distributeOptions: {
            source: "{that}.options.selectionTreeTemplate",
            target: "{that selectionTree}.options.resources.template.href"
        }
    });
})(jQuery, fluid);
