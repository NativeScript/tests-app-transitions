import application = require("application");
import * as trace from "trace";
trace.enable();
trace.setCategories(trace.categories.concat(
    trace.categories.NativeLifecycle,
    trace.categories.Navigation,
    trace.categories.Transition,
    trace.categories.ViewHierarchy,
    trace.categories.VisualTreeEvents
));
application.start({ moduleName: "main-page" });
