function auth() {
    var uname = document.getElementById("in-uname").value;
    var passwd = document.getElementById("passwd").value;
    
    if (passwd != "" && uname != "") {
        var path = convert(uname, passwd);
        make_hidden('pass', path, 'signin');
        ocument.getElementById("passwd").value="";
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
    
    if (uname == "" || pass0 == "") {
        window.alert("ユーザ名またはパスワードが入力されていません。");
    } else {
        if (pass0 == pass1) {
            var path = convert(uname, pass1);
            window.alert(path);
            make_hidden('pass', path, 'signup');
            document.getElementById("passwd0").value="";
            document.getElementById("passwd1").value="";
            return true;
            exit(0);
        } else {
            window.alert("入力された２つのパスワードが一致していません。");
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