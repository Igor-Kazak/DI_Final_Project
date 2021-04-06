function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value
    });
}

define("SERVERURL", "https://ppltest.herokuapp.com");
define("SALTROUNDS", 10);
define("PORT", 5000);
define("MAILHOST", "smtp.mail.ru");
define("MAILPORT", 465);
define("MAILUSER", "ppl.test.final.project@mail.ru");
define("MAILPASS", "project_2021_developers_2021");
define("TIMELIMIT", 30);
define("TOTALQUEST", 20);
define("PERCENTCORRECT", 75);
