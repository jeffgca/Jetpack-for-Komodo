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
    
    this.PREF_BRANCH = 'canuckistani.jetpack.';
    this.SDK_PREF_NAME = 'sdk_directory';
    this.FF_PREF_NAME = 'firefox_app';
    this.ext_Id ='jetpackforkomodo@canuckistani.ca';
    
    this.mozDirSvc = Components.classes["@mozilla.org/file/directory_service;1"]
           .getService(Components.interfaces.nsIProperties);
    
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
    
    /* get our prefs instance */
    this._prefBranch = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService)
            .getBranch(this.PREF_BRANCH);
            
    
    
} catch (e) {
    alert(e);
}

this.getExtDir = function() {
    var extDir = this.mozDirSvc.get("ProfD", Components.interfaces.nsILocalFile).target;
    var pieces = [extDir, 'extensions', this.ext_Id];
    return os.path.joinlist(pieces.length, pieces);
}

this.sanitize_name = function(s) {
    return s.replace(/[\s\.]*/g, '').toLowerCase();
}

this.vars = {};

this.init = function() {
    try {
        this.vars.project_root = ko.filepicker.getFolder(this.os.getcwd(), "Choose a directory to create your new project in.");
        this.vars.name = ko.dialogs.prompt('Addon name', 'What do you want to call your new extension?');
        this.vars.safe_name = this.sanitize_name(this.vars.name);
        this.vars.curdir = this.os.path.join(this.vars.project_root, this.vars.safe_name);
        this.os.mkdir(this.vars.curdir);
        this._run_cfx('init', Jetpack.create_project);
        
    }
    catch(e) {
        ko.dialogs.internalError(e, e);
    }
}

this.create_project = function() {    
    try {
        var projectName = Jetpack.vars.safe_name + '.komodoproject';
        var url = ko.uriparse.localPathToURI(Jetpack.os.path.join(Jetpack.vars.curdir, projectName));
        var project = Components.classes["@activestate.com/koProject;1"]
            .createInstance(Components.interfaces.koIProject);
        project.create();
        project.url = url;
        project.save();
        ko.projects.open(url);
        
    } catch (e) {
        alert(e);
    }
}

/**
 * run the extension's tests.
 */
this.test = function() {
    try {
        this._run_cfx('test', function () {
            ko.statusBar.AddMessage('Addon testing?', 'Jetpack', 5000, true);
        });
    } catch (e) {
        alert(e);
    }
}

/**
 * run the extension
 */
this.run = function() {
    try {
        this._run_cfx('run', function () {
            ko.statusBar.AddMessage('Addon Runnin?', 'Jetpack', 5000, true);
        });
    } catch (e) {
        alert(e);
    }
}

/**
 * build an xpi for this extension
 */
this.build = function() {
    try {
        this._run_cfx('xpi', function () {
            ko.statusBar.AddMessage('Addon Building?', 'Jetpack', 5000, true);
        });
    } catch (e) {
        alert(e);
    }
}

/**
 * open the docs in a Komodo tab, or (? pref ?) in a new browser tab
 */
this.docs = function() {
    try {
        this._run_cfx('docs', function () {
            ko.statusBar.AddMessage('Got docs?', 'Jetpack', 5000, true);
        });
    } catch (e) {
        alert(e);
    }
}

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
    this._prefBranch.setCharPref(this.SDK_PREF_NAME, sdk_dir);
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
        /* attempt to guess what the app name will probably be. */
        var ff_name;
        switch(this.appInfo.OS) {
            case 'WINNT':
                ff_name = 'Firefox.exe';
                break;
            case 'Darwin':
                ff_name = 'Firefox.app';
                break;
            default:
                ff_name = 'firefox';
                break;
        }
        
        var ff_path = ko.filepicker.browseForExeFile(this.os.path.dirname(this.koDirs.installDir), ff_name);
        if (!this.os.path.exists(ff_path)) {
            alert('The selected Firefox installation does not exist.');
            return;
        }
        
        document.getElementById('firefox-location-txt').value = ff_path;
        this._prefBranch.setCharPref(this.FF_PREF_NAME, ff_path);
        
    } catch (e) {
        alert(e);
    }
}

this._get_cfx_path = function() {
    var sdk_dir = this._prefBranch.getCharPref('sdk_directory');
    var app = 'cfx';
    if (this.appInfo.OS == 'WINNT') { app += '.bat' };
    var l = [sdk_dir, 'bin', app];
    return this.os.path.joinlist(l.length, l);
}

/**
 * Low-level function for actually running the commands.
 * Should support both running in output, as well as running in a separate
 * terminal ( might need this for the docs server? ).
 */
this._run_cfx = function(arg, callback) {
    
    try {
        var curdir = false;
        
        if (typeof(Jetpack.vars.curdir) !== 'undefined') {
            curdir = Jetpack.vars.curdir;
        }
        else {
            curdir = ko.interpolate.interpolateString('%p');
        }

        var cfx = this._get_cfx_path();
        var ff = this._prefBranch.getCharPref('firefox_app');
        var cmd = cfx + ' -b ' + ff + ' ' + arg;
        cmd += " {'cwd': u'"+ curdir +"'}";
    
        ko.run.runEncodedCommand(window, cmd, callback);
            
        } catch (e) {
            alert(e);
        }
    }

}).apply(Jetpack);
