var fs = require('fs');
var moment = require('moment')

// Les logs sont enregistrés dans 2 fichiers distincts : ERROR.log et logs_[mois]-[année]

module.exports = {
    // LogError permet d'enregistrer les erreurs serveur (err 500) et n'affiche pas l'IP de la requête
    LogError : function(code, string){
    var date =new Date();
    var output = "";
    output = getDateLog();
    output += "; ERROR "+ code +" : " + string;
    WriteInFile("./LogsAPI/ERROR.log", output);
    WriteInFile("./LogsAPI/logs_" + (date.getMonth() + 1).toString() + "-" + date.getFullYear().toString() + ".log", output);
    },
    // LogErrorIP permet d'enregistrer les erreurs et affiche l'IP de la requête
    LogErrorIP : function(req, code, string){
        var ip = req.headers['x-forwarded-for'] || 
            req.connection.remoteAddress || 
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);
        var date =new Date();
        var output = "";
        output = getDateLog();
        output += "; " + ip + " received ERROR "+ code +" : " + string;
        WriteInFile("./LogsAPI/ERROR.log", output);
        WriteInFile("./LogsAPI/logs_" + (date.getMonth() + 1).toString() + "-" + date.getFullYear().toString() + ".log", output);
        },
    // LogSuccessIP permet d'enregistrer les commandes réussies et l'IP de la requête
    LogSuccessIP : function(req, code, string){
        var ip = req.headers['x-forwarded-for'] || 
            req.connection.remoteAddress || 
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);
        var date =new Date();
        var output = "";
        output = getDateLog();
        output += "; " + ip + " received "+ code +" : " + string;
        WriteInFile("./LogsAPI/logs_" + (date.getMonth() + 1).toString() + "-" + date.getFullYear().toString() + ".log", output);
    },
    // Get logs from a date (month-year)
    GetLogsFromDate : function(date){
        var logs = "err";
        try {
            var contents = fs.readFileSync('./LogsAPI/logs_' + date + ".log" , 'utf8');
            logs = contents;
        }
        catch (err)
        {
            this.LogError("500", "GetLogsFromDate : " + err);
        }
        return (logs);
    }
}

function getDateLog() {
    return (moment().format("DD/MM | HH:mm:ss"))
}

function WriteInFile(path, output){
    try { fs.mkdirSync("./LogsAPI") }
    catch (err) {
        if (err.code !== 'EEXIST') 
            throw err 
        }
    var options = {flags: 'a+'}
    var wstream = fs.createWriteStream(path, options);
    wstream.write(output + '\r\n');
    wstream.end();
}