#Mozilla Addons SDK extension for Komodo

*__Abstract__: An extension for Komodo IDE / Edit to enable users toquickly and
easily create, run, test and build Firefox extensions using the new Addons SDK.*

*__Minimum Viable Extension__*: implement basic commands and expose them via a JS
API, a custom menu and a set of default keybindings.

#####Minimum Viable Extension

* __prefs__: expose preferences for setting two key variables:
    * Firefox applicaation location
    * Addons SDK location
    * need to unpack and poach Dafi's prefs integration code
* __run__: implement `cfx run`
    * do-able as basic run command
* __test__: implement `cfx test`
    * do-able as basic run command
* __build__: implement `cfx xpi`
    * do-able as basic run command
* __docs__: implement `cfx docs`
    * best implemented as run in new terminal, it's a persitent process.
    * another approach might be to just launch the index.html in a new browser window?
* default key bindings for these commands?
    
####Bonus Points / 2.0:

* codeintel API catalog generation?
    * scrape the docs?
    * *__todo__*: pester Todd about the cix command-line build
    * __also__: the scraping script should generate ctags for vim et al

##### Project creation:

* single argument: project name
    * create extension-safe version ( limit chars, lower-case, etc )
    * create directory with safe name
    * programmatically create project - required
    * in directory, run cfx init
    * bam!

__Tasks__

* Simple Macro that creates a new Jetpack project DONE
    * hard-coded paths for cfx, etc
    * fire & forget
* Prefs for SDK path and Firefox path DONE
    * poached shamelessly from Morekomodo
* Implement the base commands as an API
* figure out how to best make the functionality available to the user.
    * main methods are init but more importantly test and run
    * key bindings!
