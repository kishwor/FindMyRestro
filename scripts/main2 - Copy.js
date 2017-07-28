
'use strict';
var userrr;
var count=0;
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
FindMyRestaurant.prototype.initFirebase = function() {
    // Shortcuts to Firebase SDK features.
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();

    // alert("init");
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));

};
FindMyRestaurant.prototype.onAuthStateChanged = function(user) {
    if (user) {
        //  alert(++count);

        //  alert(user.displayName);

        var profilePicUrl = user.photoURL;
        var userName = user.displayName;
        userrr=user;
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
        ref.on("value", function(snapshot) {
            snapshot.forEach(function (data) {
                //  alert(JSON.stringify(data.val()));
                //alert(++count);
                var node = document.createElement("div");
                
                var imgrul=data.val().imageUrl;
                console.log(data.key);

                firebase.storage().refFromURL(data.val().imageUrl).getMetadata().then(function(metadata) {
                    imgrul = metadata.downloadURLs[0];
                    if(data.val().restaurantname){node.innerHTML="<div class='col-md-12 col-sm-12 col-xs-12 all-padding-zero rbox'>" +
                        "<div class='col-md-4 col-sm-4 col-xs-12'>"+
                        " <img src="+imgrul+" class='img-responsive img-rounded ht img-thumbnail'>"+
                        "  </div>"+
                        "  <div class='col-md-8 col-sm-8 col-xs-12'>"+
                        "  <h3 class='mp'>"+data.val().restaurantname+"</h3>"+
                        "   <h5 class='mb'>"+data.val().address+"</h5>"+

                        "    <div class='col-md-6 col-sm-6 col-xs-12 mp20'>"+
                        "        <button class='btn  btn-block'><i class='fa fa-phone' aria-hidden='true'>"+
                        "      </i> Call :"+data.val().contact+"</button>"+
                        "  </div>"+
                        "   </div>"+
                        "  <div class='col-md-12 col-sm-12 col-xs-12'>"+
                        "      <hr>"+
                        "       <div class='col-md-12 col-sm-12 col-xs-12'><p><small class='s5'>CUISINES: </small>"+
                        "   <small class='s6'>"+data.val().cuisines+"</small></p>"+

                        "     <p><small class='s5'>HOURS: </small><small class='s6'>"+data.val().timings+"</small>"+
                        "    </p>"+
                        "    <p><small class='s5'>FEATURED IN: </small><small class='s6'>"+data.val().featured+"</small></p>"+
                        "    </div>"+
                        "  <hr>"+
                        " <div class='col-md-3 col-sm-3 col-xs-12 mp20'>"+
                        "   <button id='"+data.key+"' class='btn  btn-block' onclick='getId(this)'><i class='fa fa-thumbs-up' aria-hidden='true'></i> Like:"+data.val().likes.length+" </button>"+
                        "    </div>"+

                        " <div class='col-md-5 col-sm-5 col-xs-12  style='float:left'>" +

                        "   <textarea id='txt" + data.key + "' class='form-control' placeholder='Enter Comment' rows='3' cols='50' ></textarea>" +


                        "    </div>" +

                        " <div class='col-md-3 col-sm-3 col-xs-12  style='float:left'>" +


                        "   <button style='float:left' id=" + data.key + " class='btn  btn-block' onclick='commentSave(this)'>Comment</button>" +
                        "    </div>" +

                        "</div>"+
						"  <div class='col-md-12 col-sm-12 col-xs-12'>"+
                        "<h3>Reviews</h3>"+
                        "<div class='tabbable-panel'>"+
                            "<div class='tabbable-line'>"+
                                "<ul class='nav nav-tabs'>"+
                                    "<li class='active'>"+
                                        "<a href='#tab_default_1' data-toggle='tab'>"+
                                        "Popular (5) "+
                                        "</a>"+
                                    "</li>"+
                                    "<li>"+
                                        "<a href='#tab_default_2' data-toggle='tab'>"+
                                        "All Reviews (255)"+ 
                                        "</a>"+
                                    "</li>"+
                                "</ul>"+
                               "<div class='tab-content'>"+
                                "<div class='tab-pane active' id='tab_default_1'>"+
                                "<p>"+
                                " Howdy, I'm in Tab 2."+
                                "</p>"+
                            "<p>"+
                            "Duis autem eum iriure dolor in hendrerit in vulputate velit esse molestie consequat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat."+
                            "</p>"+
                            "<p>"+
                                "<a class='btn btn-success' href='#'>"+
                                "Learn more..."+
                                "</a>"+
                            "</p>"+
                        "</div>"+
                        "<div class='tab-pane' id='tab_default_2'>"+
                            "<p>"+
                               " Howdy, I'm in Tab 2."+
                            "</p>"+
                            "<p>"+
                                "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat. Ut wisi enim ad minim veniam, quis nostrud exerci tation."+
                            "</p>"+
                            "<p>"+
                                "<a class='btn btn-warning' href='#'>"+
                                    "Click for more features..."+
                                "</a>"+
                            "</p>"+
                        "</div>"+

                    "</div>"+
                "</div>"+
            "</div>"+
                        "</div>"+

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
FindMyRestaurant.prototype.signIn = function() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
};
// Signs-out of Friendly Chat.
FindMyRestaurant.prototype.signOut = function() {
    // Sign out of Firebase.
    this.auth.signOut();
};
FindMyRestaurant.prototype.likeIn = function() {
    // Sign out of Firebase.
    //   alert("likein");
};
// Checks that the Firebase SDK has been correctly setup and configured.
FindMyRestaurant.prototype.checkSetup = function() {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions and make ' +
            'sure you are running the codelab using `firebase serve`');
    }
};
window.onload = function() {
    //  alert("load");
    window.FindMyRestaurant = new FindMyRestaurant();
};



function  getId(e)
{var likecount;
    //e.preventDefault();
    var btnID= e.id;
    if(userrr){
        var ref = firebase.database().ref('messages/restaurant').child(btnID);
        ref.on("value", function(snapshot2) {
            //snapshot.forEach(function (data) {
          
            likecount= snapshot2.val().likes;
        });
        // ref.off('value', function(){});
        var x=likecount.indexOf(userrr.email);
        //alert(x);
        if(likecount.indexOf(userrr.email)>0)
        {
            alert("You already liked it");
            return;
        }
        likecount.push(userrr.email);
        console.log(likecount);
        ref.update({likes:likecount});
        alert("You liked it");
    }
    else
    {
        this.signIn();
    }

    location.reload(true);
}

function commentSave(e)
{ //var refcmt = firebase.database().ref('messages/comments');
    var ref = firebase.database().ref('messages/comments');
//alert(refcmt);

    var btnID= e.id;
    var txtID= 'txt'+e.id;
    var txtmsg=document.getElementById(txtID).value;


    if(userrr.displayName){

        var restoObj = {
            userid:userrr.uid,
            username:displayName,
            restId:btnID,
            comment:txtmsg
        };
        alert(userrr.displayName);
        ref.push(restoObj);
        alert("record added");
    }
    else
    {
        this.signIn();
    }

    document.getElementById(txtID).value='';
}

