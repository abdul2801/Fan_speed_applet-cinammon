const Lang = imports.lang;
const Applet = imports.ui.applet;
const GLib = imports.gi.GLib;
const Gettext = imports.gettext;
const Util = imports.misc.util;


function run(cmd) {
    try {
        let [result, stdout, stderr] = GLib.spawn_command_line_sync(cmd);
        if (stdout !== null) {
            return stdout.toString();
        }
    } catch (error) {
        global.logError(error.message);
    }
}

function MyApplet(metadata, orientation, panelHeight, instanceId) {
    this._init(metadata, orientation, panelHeight, instanceId);
}

MyApplet.prototype = {
    __proto__: Applet.TextApplet.prototype,

    _init: function(metadata, orientation, panelHeight, instanceId) {
        Applet.TextApplet.prototype._init.call(this, orientation, panelHeight, instanceId);
        
        try {
            this.set_applet_label ("Fan Speed");
            
            this.set_applet_tooltip(_("Fan Speed"));
            this._loopId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, Lang.bind(this, this._loop));
            
        }
        catch (e) {
            global.logError(e);
        }
    },

    _loop : function(event) {
        let output = run('sensors')
         
        let res = output.match(/\d+ RPM/g)
        global.log(res[0])
        this.set_applet_label(res[0])
        // output.split('\n').forEach(element => {
            
        //     if (element.includes('fan')) {
        //         global.log(element)
        //         this.set_applet_label(element)
        //     }
            
        // });    
        
        return true
        
        
    },
    on_applet_removed_from_panel: function() {
           
        if (this._loopId) {
            GLib.source_remove(this._loopId);
            this._loopId = 0;
        }

        Applet.TextApplet.prototype.on_applet_removed_from_panel.call(this);
    }

};

function main(metadata, orientation, panelHeight, instanceId) {
    let myApplet = new MyApplet(metadata, orientation, panelHeight, instanceId);
    return myApplet;
}
