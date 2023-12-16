
var express = require('express');
var app = express();
var ldap = require('ldapjs');

app.listen(3000, function(){
    console.log("server up")
})

function authenticationDN(username, password){
    var client = ldap.createClient({
        url: 'ldap://127.0.0.1:10389'
    });

    client.bind(username, password, function(err){
    if(err){
        console.log("error in new connection" + err)
    }else{
        console.log("success")
    }
    });
}

authenticationDN("uid=admin, ou=system", "secret")