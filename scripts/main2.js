'use strict';
var userrr;
var commentsnapmain = [];
var count = 0;
// Initializes FriendlyChat.
function FindMyRestaurant() {
    this.checkSetup();
    // this.userPic = document.getElementById('user-pic');
    //this.userName = document.getElementById('user-name');
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');
    this.signInButton = document.getElementById('sign-in');
    this.signOutButton = document.getElementById('sign-out');
    this.signInSnackbar = document.getElementById('must-signin-snackbar');
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.signInButton.addEventListener('click', this.signIn.bind(this));

    this.initFirebase();
}
// Sets up shortcuts to Firebase features and initiate firebase auth.
FindMyRestaurant.prototype.initFirebase = function () {
    // Shortcuts to Firebase SDK features.
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();

    // alert("init");
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));

};
FindMyRestaurant.prototype.onAuthStateChanged = function (user) {
    if (user) {
        //  alert(++count);

        //  alert(user.displayName);

        var profilePicUrl = user.photoURL;
        var userName = user.displayName;
        userrr = user;
        // Set the user's profile pic and name.
        this.userName.textContent = userName;
        // Show user's profile and sign-out button.
        this.userName.removeAttribute('hidden');
        this.userPic.removeAttribute('hidden');
        this.signOutButton.removeAttribute('hidden');
        // Hide sign-in button.
        this.signInButton.setAttribute('hidden', 'true');
        //this.msgref = this.database.ref('messages');
     
        var ref = firebase.database().ref('messages/restaurant');
        var refcomments = firebase.database().ref('messages/comments');
        refcomments.on("value", function (commentsnap) {
            console.log(commentsnap.val());
            commentsnapmain=(commentsnap.val());
        });
        //console.log(commentsnapmain);
        ref.on("value", function (snapshot) {
            snapshot.forEach(function (data) {
                //  alert(JSON.stringify(data.val()));
                //alert(++count);
                var node = document.createElement("div");
             
                var imgrul = data.val().imageUrl;
                //console.log(data.key);

                firebase.storage().refFromURL(data.val().imageUrl).getMetadata().then(function (metadata) {
                    imgrul = metadata.downloadURLs[0];
                    if (data.val().restaurantname) {
						//var cmmt=getComments(data.key);
                        node.innerHTML = "<div class='col-md-12 col-sm-12 col-xs-12 all-padding-zero rbox'>" +
                            "<div class='col-md-4 col-sm-4 col-xs-12'>" +
                            " <img src=" + imgrul + " class='img-responsive img-rounded ht img-thumbnail'>" +
                            "  </div>" +
                            "  <div class='col-md-8 col-sm-8 col-xs-12'>" +
                            "  <h3 class='mp'>" + data.val().restaurantname + "</h3>" +
                            "   <h5 class='mb'>" + data.val().address + "</h5>" +

                            "    <div class='col-md-6 col-sm-6 col-xs-12 mp20'>" +
                            "        <button class='btn  btn-block'><i class='fa fa-phone' aria-hidden='true'>" +
                            "      </i> Call :" + data.val().contact + "</button>" +
                            "  </div>" +
                            "   </div>" +
                            "  <div class='col-md-12 col-sm-12 col-xs-12'>" +
                            "      <hr>" +
                            "       <div class='col-md-12 col-sm-12 col-xs-12'><p><small class='s5'>CUISINES: </small>" +
                            "   <small class='s6'>" + data.val().cuisines + "</small></p>" +

                            "     <p><small class='s5'>HOURS: </small><small class='s6'>" + data.val().timings + "</small>" +
                            "    </p>" +
                            "    <p><small class='s5'>FEATURED IN: </small><small class='s6'>" + data.val().featured + "</small></p>" +
                            "    </div>" +
                            "  <hr>" +
                            " <div class='col-md-3 col-sm-3 col-xs-12 mp20'>" +
                            "   <button id='" + data.key + "' class='btn  btn-block' onclick='getId(this)'><i class='fa fa-thumbs-up' aria-hidden='true'></i>"+ "Like:" + data.val().likes.length + " </button>" +
                            "    </div>" +

                            " <div class='col-md-7 col-sm-7 col-xs-12  style='float:left'>" +

                            "   <input id='txt" + data.key + "' class='form-control comment' placeholder='Enter Comment'>"+
							"<i class='fa fa-pencil' aria-hidden='true'></i></input>" +


                            "    </div>" +

                            " <div class='col-md-2 col-sm-3 col-xs-12  style='float:left'>" +


                            "   <button style='float:left' id=" + data.key + " class='btn  btn-warning commentbtn' onclick='commentSave(this)'>Comment</button>" +
                            "    </div>" +

                            "</div>" +
							"<div class='col-md-12 col-sm-12 col-xs-12'>"+
							"<h3>Reviews</h3>" +
                            "<div class='tabbable-panel'>" +
                            "<div class='tabbable-line'>" +
                            "<ul class='nav nav-tabs'>" +
                            "<li class='active'>" +
                            "<a href='#tab_default_1' data-toggle='tab'>" +
                            "Popular" +
                            "</a>" +
                            "</li>" +
                            "</ul>" +
							"<div id='commentpanel' class='tab-content'>"+getComments(data.key);+
							"</div>"+
							"</div></div></div>"+

                            "<hr>";
							
                        document.getElementById("restaurantDtl").appendChild(node);


                    }
                });
            });


        });
        //
        //   console.log(snapshot.val());

    }

    else { // User is signed out!
        // Hide user's profile and sign-out button.
        this.userName.setAttribute('hidden', 'true');
        this.userPic.setAttribute('hidden', 'true');
        this.signOutButton.setAttribute('hidden', 'true');
        // Show sign-in button.
        this.signInButton.removeAttribute('hidden');
    }
};

// Signs-in Friendly Chat.
FindMyRestaurant.prototype.signIn = function () {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
	location.reload(true);
};
// Signs-out of Friendly Chat.
FindMyRestaurant.prototype.signOut = function () {
    // Sign out of Firebase.
    this.auth.signOut();
	location.reload(true);
};
FindMyRestaurant.prototype.likeIn = function () {
    // Sign out of Firebase.
    //   alert("likein");
};
// Checks that the Firebase SDK has been correctly setup and configured.
FindMyRestaurant.prototype.checkSetup = function () {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions and make ' +
            'sure you are running the codelab using `firebase serve`');
    }
};
window.onload = function () {
    //  alert("load");
    window.FindMyRestaurant = new FindMyRestaurant();
};


function getId(e) {
    var likecount;
    //e.preventDefault();
    var btnID = e.id;
    if (userrr) {
        var ref = firebase.database().ref('messages/restaurant').child(btnID);
        ref.on("value", function (snapshot2) {
            //snapshot.forEach(function (data) {
            //alert(JSON.stringify(snapshot2.val().likes));
            likecount = snapshot2.val().likes;
        });
        // ref.off('value', function(){});
        var x = likecount.indexOf(userrr.email);
        //alert(x);
        if (likecount.indexOf(userrr.email) > 0) {
            alert("You already liked it");
            return;
        }
        likecount.push(userrr.email);
        console.log(likecount);
        ref.update({likes: likecount});
        alert("You liked it");
    }
    else {
        this.signIn();
    }

    location.reload(true);
}

function commentSave(e) { //var refcmt = firebase.database().ref('messages/comments');
    var ref = firebase.database().ref('messages/comments');
    //alert(ref);

    var btnID = e.id;
    var txtID = 'txt' + e.id;
    var txtmsg = document.getElementById(txtID).value;
//alert(userrr.displayName);

    if (userrr.displayName) {

        var restoObj = {
            userid: userrr.uid,
            username: userrr.displayName,
            restId: btnID,
            comment: txtmsg,
			timetosave:firebase.database.ServerValue.TIMESTAMP
        };
        //alert(userrr.displayName);
        ref.push(restoObj);
        alert("record added");
    }
    else {
        this.signIn();
    }

    document.getElementById(txtID).value = '';
    location.reload(true);
}

function getComments(rsid)
{
	var commentstring="";
	//console.log(JSON.stringify(commentsnapmain));
	$.each(commentsnapmain,function(k,v){
		   var node2 = document.createElement("div");
		if(v.restId==rsid)
		{
			commentstring +="<div class='tab-content'>" +
                            "<div class='tab-pane active' id='tab_default_1'>" +
                            "<p><span style='background-colo:green'>" +v.username+" :</span> "+v.comment+
                            "</p>" +
                           "</div>";
							document.getElementById("commentpanel").appendChild(node2);
							
							//alert(node2);
		}
		
	});
   /* commentsnapmain.forEach(function (data) {
		alert(data.restId);
		if(data.restId==rsid)
		{console.log("checked"+data);}
		
	});   */ 
	return(commentstring);
}
