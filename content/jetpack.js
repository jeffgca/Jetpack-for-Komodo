/**
 * namespace Jetpack
 *
 * A JavaScript api for Komodo for driving the Firefox addons SDK command-line
   tool 'cfx'
 */
if(typeof(Jetpack) == 'undefined') {
    var Jetpack = {};
}

(function() {
    
try {
    this.os = Components.classes['@activestate.com/koOs;1']. 
      getService(Components.interfaces.koIOs); 
     
    this.koSysUtils = Components.classes["@activestate.com/koSysUtils;1"]. 
      getService(Components.interfaces.koISysUtils); 
     
    this.appInfo = Components.classes["@mozilla.org/xre/app-info;1"]. 
      getService(Components.interfaces.nsIXULRuntime); 
     
    this.koDirs = Components.classes['@activestate.com/koDirs;1']. 
      getService(Components.interfaces.koIDirs); 
    
    // this.projectDir = ko.interpolate.interpolateString('%p');
        
        
    this.windaz = false;
    
} catch (e) {
    alert(e);
}


this.new_project = function() {
    
    /* TODO localize */
    var project_root = ko.filepicker.getFolder(os.getcwd(), "Choose a directory to create your new project in.");
    
    try {
        var dir = os.path.join(project_root, safe_name);        
        os.mkdir(dir);

        _run_cfx('init');
    }
    catch(e) {
        ko.eggs.writeLine(e);
    }
}

/**
 * run the extension's tests.
 */
this.test = function() {
    try {
        alert('in test!!');
    } catch (e) {
        alert(e);
    }
}

/**
 * run the extension
 */
this.run = function() {
    _run_cfx('run');
}

/**
 * build an xpi for this extension
 */
this.build = function() {
    
}

/**
 * open the docs in a Komodo tab, or (? pref ?) in a new browser tab
 */
this.docs = function() {
    
}

this.setSdkLocation = function() {
    try {
        alert('got here');
        var sdk_dir = ko.filepicker.getFolder(false, 'Please select the root directory');
    } catch (e) {
        alert(e);
    }
}

/**
 * Low-level function for actually running the commands.
 * Should support both running in output, as well as running in a separate
 * terminal ( might need this for the docs server? ).
 */
function _run_cfx(arg) {
    var app = 'cfx', ffbin = '';
    
    // OS detection 
    appInfo.OS == 'WINNT' ? this.windaz = true : this.windaz = false;
    
    if (this.windaz) {
        app = 'cfx.bat'
    }
    
    /* will need to do some kind of work-around for Windaz. */
    
    // var cmd =
    var cmd = app + ' ' + arg ;
    
    ko.run.runEncodedCommand(window, cmd, function() {
      ko.statusBar.AddMessage('Build complete', 'projects', 5000, true);
      ko.projects.manager.saveProject(project);
    }); 
}

}).apply(Jetpack);



