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

    this.sdk_location_pref_name = 'addons-sdk-location';
    this.prefSvc = Components.classes['@activestate.com/koPrefService;1'].getService(Components.interfaces.koIPrefService).prefs;
        
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
    _run_cfx('docs');
}

/* get our prefs instance */
this._prefBranch = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService)
        .getBranch("canuckistani.jetpack.");

/**
 * set the SDK location
 */
this.setSdkLocation = function() {

    var sdk_dir = ko.filepicker.getFolder(false, 'Please select the root directory');
    var arr = [sdk_dir, 'bin', 'cfx'];
    var cfx_path =  this.os.path.joinlist(arr.length, arr)
    if (!this.os.path.exists(sdk_dir)) {
        alert('The selected path does not exist.');
        return;
    }

    if (!this.os.path.isfile(cfx_path)) {
        alert('The selected path does not appear to contain an Addons SDK.');
        return;
    }

    document.getElementById('sdk-location-txt').value = sdk_dir;
    this._prefBranch.setCharPref('sdk_directory', sdk_dir);
}

/**
 * Load our prefs
 */
this.loadPrefs = function() {
    document.getElementById('sdk-location-txt').value = this._prefBranch.getCharPref('sdk_directory');
    document.getElementById('firefox-location-txt').value = this._prefBranch.getCharPref('firefox_app');
}

/**
 * set the location of Firefox.
 */
this.setFirefoxLocation = function() {
    try {
        var ff_name = 'Firefox.app';
        if (this.appInfo.OS == 'WINNT') {
            ff_name = 'Firefox.exe';
        }
        
        var ff_path = ko.filepicker.browseForExeFile(this.os.path.dirname(this.koDirs.installDir), ff_name);
    
        alert(ff_path);
        if (!this.os.path.exists(ff_path)) {
            alert('The selected Firefox installation does not exist.');
            return;
        }
        
        document.getElementById('firefox-location-txt').value = ff_path;
        this._prefBranch.setCharPref('firefox_app', ff_path);
        
    } catch (e) {
        alert(e);
    }
}

this._get_cfx_path = function() {
    var sdk_dir = this.prefSvc.getCharPref('sdk_directory');
    var app = 'cfx';
    if (appInfo.OS == 'WINNT') { app += '.bat' };
    return this.os.path.join(sdk_dir, app);
}

/**
 * Low-level function for actually running the commands.
 * Should support both running in output, as well as running in a separate
 * terminal ( might need this for the docs server? ).
 */
this._run_cfx = function(arg) {

    var sdk_dir = this.prefSvc.getCharPref('sdk_directory');
    var app = 'cfx';
    if (appInfo.OS == 'WINNT') { app += '.bat' };
    var cfx = this.os.path.join(sdk_dir, app);
    
    var ff = this._prefBranch.getCharPref('firefox_app');
    
    var cmd = cfx + ' -b ' + ff + ' ' + arg;
    
    ko.run.runEncodedCommand(window, cmd, function() {
        ko.statusBar.AddMessage('cfx ' + args +' complete', 'projects', 5000, true);
    }); 
}

}).apply(Jetpack);



