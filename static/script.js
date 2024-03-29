var sentences = [];
var actions = [];
var spool = false

/*

 Remember that player actions are executed imediantly 

 Thus, arrives into text out of order

 List should be organised after sentences and player actions is just on to add

 List of sentences (being processed) should hold tuple (text, className) so

 the are formatted correctly.

*/

function log(text,delta="classic",animate=true){
        obj = document.getElementById("logger");
        if(obj)
            obj.innerHTML += "<p class='tester "+delta+"'>"+text+"</p>";
            //obj.scrollTop = obj.scrollHeight-obj.offsetHeight -1;
            //setTimeout(removeAnimation,1000)
        if (animate) {
                elements = obj.getElementsByTagName("p");
                for (i=0;i<elements.length-1;i++) {
                   elements[i].className = elements[i].className.replace('tester',"");
                }

                last = elements[elements.length-1];
                last.addEventListener("webkitAnimationEnd", myEndFunction);
            }
        //last.setAttribute("line",idx)
        obj.scrollTop = obj.scrollHeight-obj.offsetHeight -1;
        return last
    } 

function receiveNewActions() {
    //obj = document.getElementById("logger");
    //obj.style.height = (body.style.height);
    obj = document.getElementById("dialogue_box");
    obj.innerHTML = "<p> Actions available </p>";
    for (k=0;k<actions.length;k++) {
        action = actions[k];
        obj.innerHTML += "<div class='actionElement' onclick='doAction(\""+action["tag"]+"\",\""+action["result"]+"\")'>"+action["discription"]+"</div>";
    }
    sentence = sentences.shift();
    if (sentence) addSentence(sentence);
}

function emptySentences(){
    //alert("pushing");
    //removeAnimation();
    spool = true;
    /*
    sentence = sentences.shift();
    while (sentence) {
        addSentence(sentence,false);
        sentence = sentences.shift();
    }
    */
}

function hideit2() {
    alert("j");
    obj = document.getElementById("dialogue_box");
    obj.style.display = "none";
}


function viewActions() {
    obj = document.getElementById("dialogue_box")
    obj.style.display = "block";
    obj.style.opacity = "1";
    /*
    if (obj.style.display == "block") {
    } else {
        //obj.style.opacity = "0";
        //obj.addEventListener("webkitAnimationEnd", hideit2);
        obj.style.display = "none";
    }
    */
    /*
    if (obj.style.display == "none") {
        obj.style.display = "block";
    } else {
        obj.style.display = "block";

    }
    */
}

function doAction(tag, result) {
        obj = document.getElementById("dialogue_box")
        obj.style.opacity = "0";
        obj.style.display = "none";
        //obj.addEventListener("webkitAnimationEnd", hideit2);

        sentences.push([result,"italic",tag])
        sentence = sentences.shift();
        if (sentence) addSentence(sentence);
        //log(result,"italic")
        /*
        obj = document.getElementById("dialogue_box")
        obj.style.opacity = "0";
        data = JSON.stringify({"message":"getmore","response":tag});
        url = "http://localhost:5003/load";
        //url = "http://pcl21388.dn.lan/sha256";
        if (ajax(url,data,receiveStory));
        */
}

function removeAnimation() {
    obj = document.getElementById("logger");
    elements = obj.getElementsByTagName("p");
    for (i=0;i<elements.length;i++) {
       elements[i].className = elements[i].className.replace('tester',"");
       //elements[i].removeEventListener("webkitAnimationEnd", myEndFunction);
    }
}

function addSentence(sentence,animate=true){
    log(sentence[0],sentence[1],animate);
    if (sentence[1] == "italic"){
            obj = document.getElementById("dialogue_box")
            //obj.style.opacity = "0";
            //obj.style.display="none";
            data = JSON.stringify({"message":"getmore","response":sentence[2]});
            url = "http://localhost:5003/load";
            //url = "http://pcl21388.dn.lan/sha256";
            if (ajax(url,data,receiveStory));
    }
}

function myEndFunction() {
    this.className = this.className.replace('tester',"")
    sentence = sentences.shift()
    if (spool){
        while (sentence){
            addSentence(sentence,false)
            sentence = sentences.shift()
        }
    } else {
        if (sentence) { 
            addSentence(sentence);
        }
    }
    
}


function getStory() {
        data = JSON.stringify({"message":"getmore","response":"INIT"});
        url = "http://localhost:5003/load";
        //url = "http://pcl21388.dn.lan/sha256";
        if (ajax(url,data,receiveStory));
}

function receiveStory(req) {
    if (req.status==200){
            message = JSON.parse(req.responseText);
            for (msg in message["content"]){
                sentences.push([message["content"][msg],"classic"]);
            }
            //sentences = sentences.concat(message["content"]);
            actions = message["actions"];
            spool = false;
            //obj.value = message["hashkey"];
            //updatesaved(message["hashkey"]);
            receiveNewActions();
    }
    else {
        alert("Error Message Code:"+req.status+", "+req.statusText);
    }
}


function hashit() {
        obj = document.getElementById("cleartext");
        message = "empty";
        if (obj){
                message = obj.value;
        }
        data = JSON.stringify({"message":message});
        url = "http://localhost:5000/sha256";
        //url = "http://pcl21388.dn.lan/sha256";
        if (ajax(url,data,receiveHash))
         ;
   }


function addOnChange(obj,func) {
        if (obj.addEventListener) {  // all browsers except IE before version 9
            obj.addEventListener ("change", func, false);
        }
        else {
            if (obj.attachEvent) {   // IE before version 9
                obj.attachEvent ("onchange", func);
            }
        }
    }

function init(){
    savedhash = document.getElementById("hashkey_saved");
    //addOnChange(savedhash,verify)
    cleartext = document.getElementById("cleartext");         
    //addOnChange(cleartext,hashit)
    }

function ajax(url,data,callback) {
        var req = false;
        try{
                req = new XMLHttpRequest();
                }
        catch(e) {
                try {
                        req = new ActiveXObject("Msxml2.XMLHTTP");
                        }
                catch(e) {
                        try{
                                req = new ActiceXObject("Microsoft.XMLHTTP");
                                }
                        catch(e) {
                                // browser does not support AJAX
                                return false;
                                }
                        }
                }
        req.open("POST",url,true);
        req.setRequestHeader("Content-Type","application/json");
        req.onreadystatechange = function() {
                if (req.readyState == 4) callback(req);
                    }
        req.send(data);
        return true;
        }
/*        
function log(text){
        obj = document.getElementById("logger");
        if(obj)
            obj.innerHTML += "<p>"+text+"</p>";
            obj.scrollTop = obj.scrollHeight-obj.offsetHeight -1;
        }        
*/        
function receiver(req){
        if (req.status==200){
                message = JSON.parse(req.responseText);
                log(message["message"])
                }
        else {
            alert("Error Message Code:"+req.status+", "+req.statusText);
                
                }
        
        }
/*        
function test() {
    savedhash = document.getElementById("hashkey_saved");
    obj = document.getElementById("hashkey");
    savedhash.value = obj.value;
    updatesaved(obj.value);
    }

function test2(){
        data = JSON.stringify({"message":"Hello"});
        url = "http://localhost:5000/json";
        //url = "http://pcl21388.dn.lan/json";
        //alert(data);
        if (ajax(url,data,receiver))
         //alert("ajax was sent")
         ;
      }
*/
function updatesaved(newhash) {
    savedhash = document.getElementById("hashkey_saved");
    if (savedhash) {
            if (savedhash.value.trim().toUpperCase() == newhash.trim().toUpperCase()) {
                    savedhash.classList.remove("red");
                    savedhash.classList.add("green");                                
            } else {
                    savedhash.classList.remove("green");
                    savedhash.classList.add("red");                                
                }
            } else alert("error cannot find savedhash");
            
    }
            
function verify(){
    obj = document.getElementById("hashkey");
    updatesaved(obj.value);
    }

function receiveHash(req) {
    if (req.status==200){
            message = JSON.parse(req.responseText);
            obj = document.getElementById("hashkey");
            obj.value = message["hashkey"];
            updatesaved(message["hashkey"]);
            }
    else {
        alert("Error Message Code:"+req.status+", "+req.statusText);
            }
    }

