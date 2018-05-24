import * as application from "tns-core-modules/application";
import * as trace from "tns-core-modules/trace";
trace.enable();
trace.setCategories(trace.categories.concat(
    trace.categories.NativeLifecycle,
    trace.categories.Navigation,
    trace.categories.Transition
));
application.start({ moduleName: "main-page" });