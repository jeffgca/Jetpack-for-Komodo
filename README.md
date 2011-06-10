#Mozilla Addons SDK extension for Komodo

*__Abstract__: An extension for Komodo IDE / Edit to enable users toquickly and
easily create, run, test and build Firefox extensions using the new Addons SDK.*

*__Minimum Viable Extension__*: implement basic commands and expose them via a JS
API, a custom menu and a set of default keybindings.

##Napkin spec

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
