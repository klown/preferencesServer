/*!
GPII OAuth2 server

Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/* global document, fluid, gpii, jQuery, jqUnit */

(function ($) {
    "use strict";

    $(document).ready(function () {

        fluid.registerNamespace("gpii.tests.oauth2.selectionTree");

        gpii.tests.oauth2.selectionTree.sampleReqPrefs = {
            "a.d": true,
            "b.e": true,
            "b.f.g": true,
            "c.h": true,
            "c.i.j": true,
            "c.k.l": true,
            "c.k.m": true
        };

        gpii.tests.oauth2.selectionTree.sampleComponetModel = {
            value: "indeterminate",
            a: {
                value: "unchecked",
                d: {
                    value: "unchecked"
                }
            },
            b: {
                value: "checked",
                e: {
                    value: "checked"
                },
                f: {
                    value: "checked",
                    g: {
                        value: "checked"
                    }
                }
            },
            c: {
                value: "indeterminate",
                h: {
                    value: "unchecked"
                },
                i: {
                    value: "checked",
                    j: {
                        value: "checked"
                    }
                },
                k: {
                    value: "indeterminate",
                    l: {
                        value: "unchecked"
                    },
                    m: {
                        value: "checked"
                    }
                }
            }
        };

        jqUnit.test("gpii.oauth2.selectionTree.toServerModel", function () {

            var testPaths = {
                "a.d": {},
                "b.e": {"": true},
                "c.k": {"m": true},
                "a": {},
                "b": {"": true},
                "c": {"i": true, "k.m": true},
                "": {"b": true, "c.i": true, "c.k.m": true}
            };

            fluid.each(testPaths, function (expected, path) {
                var model = fluid.get(gpii.tests.oauth2.selectionTree.sampleComponetModel, path);
                var result = gpii.oauth2.selectionTree.toServerModel(model);
                jqUnit.assertDeepEq("The server model should be generated correctly for '" + path + "'", expected, result);
            });
        });

        jqUnit.test("gpii.oauth2.selectionTree.pathsToSegs", function () {
            var tests = [{
                paths: {},
                expected: []
            }, {
                paths: {"": true},
                expected: [[]]
            }, {
                paths: {"a": true},
                expected: [["a"]]
            }, {
                paths: {"a.b": true},
                expected: [["a", "b"]]
            }, {
                paths: {"a.b": true, "c.d": true},
                expected: [["a", "b"], ["c", "d"]]
            }];

            fluid.each(tests, function (testObj) {
                var result = gpii.oauth2.selectionTree.pathsToSegs(testObj.paths);
                jqUnit.assertDeepEq("The segs array for path '" + testObj.paths + "'", testObj.expected, result);
            });
        });

        jqUnit.test("gpii.oauth2.selectionTree.setAllDescendants", function () {
            var tests = {
                topLevel: {
                    model: {
                        value: "unset"
                    },
                    expected: {
                        value: "set"
                    }
                },
                singleLevel: {
                    model: {
                        value: "unset",
                        a: {
                            value: "unset"
                        }
                    },
                    expected: {
                        value: "set",
                        a: {
                            value: "set"
                        }
                    }
                },
                multiLevel: {
                    model: {
                        value: "unset",
                        a: {
                            value: "unset"
                        },
                        b: {
                            value: "unset",
                            c: {
                                value: "unset"
                            }
                        }
                    },
                    expected: {
                        value: "set",
                        a: {
                            value: "set"
                        },
                        b: {
                            value: "set",
                            c: {
                                value: "set"
                            }
                        }
                    }
                }
            };

            fluid.each(tests, function (testObj, testName) {
                gpii.oauth2.selectionTree.setAllDescendants(testObj.model, "set");
                jqUnit.assertDeepEq("The '" + testName + "' test object should be set correctly", testObj.expected, testObj.model);
            });
        });

        jqUnit.test("gpii.oauth2.selectionTree.setAncestors", function () {
            var tests = {
                topLevelChecked: {
                    model: {
                        value: "checked"
                    },
                    path: "",
                    expected: {
                        value: "checked"
                    }
                },
                topLevelUnChecked: {
                    model: {
                        value: "unchecked"
                    },
                    path: "",
                    expected: {
                        value: "unchecked"
                    }
                },
                topLevelIndeterminate: {
                    model: {
                        value: "indeterminate"
                    },
                    path: "",
                    expected: {
                        value: "indeterminate"
                    }
                },
                singleLevelChecked: {
                    model: {
                        value: "",
                        a: {
                            value: "checked"
                        }
                    },
                    path: "a",
                    expected: {
                        value: "checked",
                        a: {
                            value: "checked"
                        }
                    }
                },
                singleLevelUnchecked: {
                    model: {
                        value: "",
                        a: {
                            value: "unchecked"
                        }
                    },
                    path: "a",
                    expected: {
                        value: "unchecked",
                        a: {
                            value: "unchecked"
                        }
                    }
                },
                singleLevelIndeterminate: {
                    model: {
                        value: "",
                        a: {
                            value: "indeterminate"
                        }
                    },
                    path: "a",
                    expected: {
                        value: "indeterminate",
                        a: {
                            value: "indeterminate"
                        }
                    }
                },
                multiLevelChecked: {
                    model: {
                        value: "",
                        a: {
                            value: "checked"
                        },
                        b: {
                            value: "",
                            c: {
                                value: "checked"
                            }
                        }
                    },
                    path: "b.c",
                    expected: {
                        value: "checked",
                        a: {
                            value: "checked"
                        },
                        b: {
                            value: "checked",
                            c: {
                                value: "checked"
                            }
                        }
                    }
                },
                multiLevelUnChecked: {
                    model: {
                        value: "",
                        a: {
                            value: "unchecked"
                        },
                        b: {
                            value: "",
                            c: {
                                value: "unchecked"
                            }
                        }
                    },
                    path: "b.c",
                    expected: {
                        value: "unchecked",
                        a: {
                            value: "unchecked"
                        },
                        b: {
                            value: "unchecked",
                            c: {
                                value: "unchecked"
                            }
                        }
                    }
                },
                multiLevelIndeterminate: {
                    model: {
                        value: "",
                        a: {
                            value: "checked"
                        },
                        b: {
                            value: "",
                            c: {
                                value: "unchecked"
                            }
                        }
                    },
                    path: "b.c",
                    expected: {
                        value: "indeterminate",
                        a: {
                            value: "checked"
                        },
                        b: {
                            value: "unchecked",
                            c: {
                                value: "unchecked"
                            }
                        }
                    }
                }
            };

            fluid.each(tests, function (testObj, testName) {
                gpii.oauth2.selectionTree.setAncestors(testObj.model, testObj.path);
                jqUnit.assertDeepEq("The '" + testName + "' test object should be set correctly", testObj.expected, testObj.model);
            });
        });

        jqUnit.test("gpii.oauth2.selectionTree.setEachSeg", function () {
            var tests = {
                topLevel: {
                    model: {
                        value: "unset"
                    },
                    segs: [],
                    expected: {
                        value: "set"
                    }
                },
                singleLevel: {
                    model: {
                        value: "unset",
                        a: {
                            value: "unset"
                        }
                    },
                    segs: ["a"],
                    expected: {
                        value: "set",
                        a: {
                            value: "set"
                        }
                    }
                },
                multiLevel: {
                    model: {
                        value: "unset",
                        a: {
                            value: "unset"
                        },
                        b: {
                            value: "unset",
                            c: {
                                value: "unset"
                            }
                        }
                    },
                    segs: ["b", "c"],
                    expected: {
                        value: "set",
                        a: {
                            value: "unset"
                        },
                        b: {
                            value: "set",
                            c: {
                                value: "set"
                            }
                        }
                    }
                }
            };

            fluid.each(tests, function (testObj, testName) {
                gpii.oauth2.selectionTree.setEachSeg(testObj.model, testObj.segs, "set");
                jqUnit.assertDeepEq("The '" + testName + "' test object should be set correctly", testObj.expected, testObj.model);
            });
        });

        jqUnit.test("gpii.oauth2.selectionTree.toModel", function () {

            var tests = [{
                serverModel: {},
                expected: {
                    value: "unchecked",
                    a: {
                        value: "unchecked",
                        d: {
                            value: "unchecked"
                        }
                    },
                    b: {
                        value: "unchecked",
                        e: {
                            value: "unchecked"
                        },
                        f: {
                            value: "unchecked",
                            g: {
                                value: "unchecked"
                            }
                        }
                    },
                    c: {
                        value: "unchecked",
                        h: {
                            value: "unchecked"
                        },
                        i: {
                            value: "unchecked",
                            j: {
                                value: "unchecked"
                            }
                        },
                        k: {
                            value: "unchecked",
                            l: {
                                value: "unchecked"
                            },
                            m: {
                                value: "unchecked"
                            }
                        }
                    }
                }
            }, {
                serverModel: {"": true},
                expected: {
                    value: "checked",
                    a: {
                        value: "checked",
                        d: {
                            value: "checked"
                        }
                    },
                    b: {
                        value: "checked",
                        e: {
                            value: "checked"
                        },
                        f: {
                            value: "checked",
                            g: {
                                value: "checked"
                            }
                        }
                    },
                    c: {
                        value: "checked",
                        h: {
                            value: "checked"
                        },
                        i: {
                            value: "checked",
                            j: {
                                value: "checked"
                            }
                        },
                        k: {
                            value: "checked",
                            l: {
                                value: "checked"
                            },
                            m: {
                                value: "checked"
                            }
                        }
                    }
                }
            }, {
                serverModel: {"a": true},
                expected: {
                    value: "indeterminate",
                    a: {
                        value: "checked",
                        d: {
                            value: "checked"
                        }
                    },
                    b: {
                        value: "unchecked",
                        e: {
                            value: "unchecked"
                        },
                        f: {
                            value: "unchecked",
                            g: {
                                value: "unchecked"
                            }
                        }
                    },
                    c: {
                        value: "unchecked",
                        h: {
                            value: "unchecked"
                        },
                        i: {
                            value: "unchecked",
                            j: {
                                value: "unchecked"
                            }
                        },
                        k: {
                            value: "unchecked",
                            l: {
                                value: "unchecked"
                            },
                            m: {
                                value: "unchecked"
                            }
                        }
                    }
                }
            }, {
                serverModel: {"b.f": true},
                expected: {
                    value: "indeterminate",
                    a: {
                        value: "unchecked",
                        d: {
                            value: "unchecked"
                        }
                    },
                    b: {
                        value: "indeterminate",
                        e: {
                            value: "unchecked"
                        },
                        f: {
                            value: "checked",
                            g: {
                                value: "checked"
                            }
                        }
                    },
                    c: {
                        value: "unchecked",
                        h: {
                            value: "unchecked"
                        },
                        i: {
                            value: "unchecked",
                            j: {
                                value: "unchecked"
                            }
                        },
                        k: {
                            value: "unchecked",
                            l: {
                                value: "unchecked"
                            },
                            m: {
                                value: "unchecked"
                            }
                        }
                    }
                }
            }, {
                serverModel: {"a": true, "b.f": true, "c.i": true, "c.k.m": true},
                expected: {
                    value: "indeterminate",
                    a: {
                        value: "checked",
                        d: {
                            value: "checked"
                        }
                    },
                    b: {
                        value: "indeterminate",
                        e: {
                            value: "unchecked"
                        },
                        f: {
                            value: "checked",
                            g: {
                                value: "checked"
                            }
                        }
                    },
                    c: {
                        value: "indeterminate",
                        h: {
                            value: "unchecked"
                        },
                        i: {
                            value: "checked",
                            j: {
                                value: "checked"
                            }
                        },
                        k: {
                            value: "indeterminate",
                            l: {
                                value: "unchecked"
                            },
                            m: {
                                value: "checked"
                            }
                        }
                    }
                }
            }];

            fluid.each(tests, function (testObj) {
                var result = gpii.oauth2.selectionTree.toModel(testObj.serverModel, gpii.tests.oauth2.selectionTree.sampleReqPrefs);
                jqUnit.assertDeepEq("The component model should be generated correctly for '" + JSON.stringify(testObj.serverModel) + "'", testObj.expected, result);
            });

        });

        gpii.tests.oauth2.selectionTree.testRemoveLeaf = function (name, container) {
            container = $(container);
            var selectors = {
                removeElm: ".gpiic-ouath2-selectionTree-removeLeaf-removeElm",
                removed: ".gpiic-ouath2-selectionTree-removeLeaf-removed",
                preserved: ".gpiic-ouath2-selectionTree-removeLeaf-preserved"
            };

            var find = function (sel) {
                return container.find(selectors[sel]);
            };

            gpii.oauth2.selectionTree.removeLeaf(find("removeElm"), selectors.removed);

            jqUnit.assertTrue(name + ": the removeElm should no longer exist", find("removeElm").length === 0);
            jqUnit.assertTrue(name + ": the removed container should no longer exist", find("removed").length === 0);
            jqUnit.assertTrue(name + ": the preserved elm should still exist", find("preserved").length > 0);
        };

        jqUnit.test("gpii.oauth2.selectionTree.removeLeaf", function () {
            gpii.tests.oauth2.selectionTree.testRemoveLeaf("Top Level", ".gpiic-ouath2-selectionTree-removeLeaf-topLevel");
            gpii.tests.oauth2.selectionTree.testRemoveLeaf("Nested", ".gpiic-ouath2-selectionTree-removeLeaf-nested");
        });

        gpii.tests.oauth2.selectionTree.checkboxCleanup = function (checkbox) {
            checkbox.prop({
                "indeterminate": false,
                "checked": false
            });
        };

        jqUnit.test("gpii.oauth2.selectionTree.setCheckbox", function () {
            var checkbox = $(".gpiic-ouath2-selectionTree-testCheckbox");
            gpii.tests.oauth2.selectionTree.checkboxCleanup(checkbox);

            gpii.oauth2.selectionTree.setCheckbox(checkbox, "checked");
            jqUnit.assertTrue("The checkbox should be checked", checkbox.prop("checked"));
            jqUnit.assertFalse("The checkbox should not be indeterminate", checkbox.prop("indeterminate"));

            gpii.oauth2.selectionTree.setCheckbox(checkbox, "indeterminate");
            jqUnit.assertFalse("The checkbox should not be checked", checkbox.prop("checked"));
            jqUnit.assertTrue("The checkbox should be indeterminate", checkbox.prop("indeterminate"));

            gpii.oauth2.selectionTree.setCheckbox(checkbox, "unchecked");
            jqUnit.assertFalse("The checkbox should not be checked", checkbox.prop("checked"));
            jqUnit.assertFalse("The checkbox should not be indeterminate", checkbox.prop("indeterminate"));

            gpii.oauth2.selectionTree.setCheckbox(checkbox);
            jqUnit.assertFalse("The checkbox should not be checked", checkbox.prop("checked"));
            jqUnit.assertFalse("The checkbox should not be indeterminate", checkbox.prop("indeterminate"));

            gpii.tests.oauth2.selectionTree.checkboxCleanup(checkbox);
        });

        fluid.defaults("gpii.tests.oauth2.preferencesSelectionTree", {
            gradeNames: ["gpii.oauth2.preferencesSelectionTree", "autoInit"],
            model: {
                value: "unchecked",
                "increase-size": {
                    value: "unchecked",
                    appearance: {
                        value: "unchecked",
                        "text-size": {
                            value: "unchecked"
                        }
                    }
                },
                simplify: {
                    value: "unchecked",
                    "table-of-contents": {
                        value: "unchecked"
                    }
                },
                "universal-volume": {
                    value: "unchecked"
                },
                "universal-language": {
                    value: "unchecked"
                },
                "visual-alternatives": {
                    value: "unchecked",
                    "speak-text": {
                        value: "unchecked",
                        rate: {
                            value: "unchecked"
                        },
                        volume: {
                            value: "unchecked"
                        }
                    }
                },
                "visual-styling": {
                    value: "unchecked",
                    "change-contrast": {
                        value: "unchecked"
                    }
                }
            },
            requestedPrefs: {
                "increase-size": true,
                "increase-size.appearance": true,
                "increase-size.appearance.text-size": true,
                "simplify": true,
                "simplify.table-of-contents": true,
                "universal-volume": true,
                "universal-language": true,
                "visual-alternatives": true,
                "visual-alternatives.speak-text": true,
                "visual-alternatives.speak-text.rate": true,
                "visual-alternatives.speak-text.volume": true,
                "visual-styling": true,
                "visual-styling.change-contrast": true
            }
        });

        jqUnit.test("gpii.oauth2.preferencesSelectionTree", function () {
            var that = gpii.tests.oauth2.preferencesSelectionTree(".gpiic-oauth2-selectionTree");

            fluid.each(that.options.domMap, function (selector, selectorName) {
                var elm = that.container.find(selector);
                if (that.options.requestedPrefs[selectorName] || selectorName === "") {
                    jqUnit.exists("'" + selector + "' should exist", elm);
                } else {
                    jqUnit.notExists("'" + selector + "' should not exist", elm);
                }
            });
        });
    });
})(jQuery);
