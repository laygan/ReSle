function auth() {
    var uname = document.getElementById("in-uname").value;
    var passwd = document.getElementById("passwd").value;
    
    if (passwd != "" && uname != "") {
        document.getElementById("passwd").value="rgt4hyjuk8j7uj65h4tyju54hg3htjyruk6r5j;6hetyrku5j46hertejysku5e7j64";
        var path = convert(uname, passwd);
        window.alert(path);
        make_hidden('pass', path, 'signin');
        return true;
        exit(0);
    } else {
        window.alert("ユーザ名またはパスワードが入力されていません。");
    }
    return false;
}

function append() {
    var uname = document.getElementById("up-uname").value;
    var pass0 = document.getElementById("passwd0").value;
    var pass1 = document.getElementById("passwd1").value;
    
    if (uname == "" || pass0 == "" || document.getElementById("lname").value=="" || document.getElementById("fname").value=="") {
        window.alert("すべての項目を埋めてください。");
    } else if (isZen(uname)) {
        window.alert("Usernameに全角文字を使用することはできません。");
    } else {
        if (pass0 == pass1) {
            document.getElementById("passwd0").value="rgt4hyjuk8j7uj65h4tyju54hg3htjyruk6r5j;6hetyrku5j46hertejysku5e7j64";
            document.getElementById("passwd1").value="k9l8o7ki6j5h4thyukilo;7p:-0p9oi7w46u3a5ehtjyrkutil6r76857jryku6il8r";
            var path = convert(uname, pass1);
            make_hidden('pass', path, 'add');
            return true;
            exit(0);
        } else {
            window.alert("入力された２つのパスワードが一致していません。");
        }
    }
    return false;
}

function isZen(str){
    for(var i=0; i<str.length; i++){
        /* 1文字ずつ文字コードをエスケープし、その長さが4文字以上なら全角 */
        var len=escape(str.charAt(i)).length;
        if(len>=4){
            return true;
        }
    }
    return false;
}

function convert(input, pass) {
    var out;

    out = des_cbc_encrypt(pass, input);
    out = base64encode(out);
    
    return out;
}

function make_hidden( name, value, formname ){
    var q = document.createElement('input');
    q.type = 'hidden';
    q.name = name;
    q.value = value;
    if (formname){ document.forms[formname].appendChild(q); }
    else{ document.forms[0].appendChild(q); }
}