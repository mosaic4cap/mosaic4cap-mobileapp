package.json gehört zu NodeJs und muss die wichtigsten Dependencies beinhalten, also die Module die mit npm install installiert werden müssen.


    - Ausführen von "npm install" (Dependencies in **package.json**)
        -> dadurch werden alle module in den lokalen ordner installiert
    - Ausführen von grunt (configuration komplett in **Gruntfile.js**)
        -> grunt testet alle javascript module und führt bower install auf
    - Ausführen von bower install (durch grunt, dependencies in **bower.json**)
        -> Es werden css und js resourcen geladen und installiert die ressourcen sind dann im ordner /bower_components verfügbar

