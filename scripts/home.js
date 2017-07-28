

        'use strict';
var likespush = [''];
var RestArray = [];
// Initializes FriendlyChat.
function FindMyRestaurant() {
    this.checkSetup();
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');
   // this.main_user=document.getElementById('mainuser');
    this.signInButton = document.getElementById('sign-in');
    this.signOutButton = document.getElementById('sign-out');
    this.signInSnackbar = document.getElementById('must-signin-snackbar');
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.signInButton.addEventListener('click', this.signIn.bind(this));

    this.imgname = document.getElementById('imgname');
    this.restname = document.getElementById('restname');
    this.restabout = document.getElementById('restabout');

    this.initFirebase();
}
// Sets up shortcuts to Firebase features and initiate firebase auth.
FindMyRestaurant.prototype.initFirebase = function() {
    // Shortcuts to Firebase SDK features.

    //alert("init");
    var dwnldurl = [];
    var imgurl;
    var restkey, x = [];
    var rkey;

    var restvalue;
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
    var likeCountRef = firebase.database().ref('messages/restaurant').orderByChild('likes');
    likeCountRef.on("value", function(snapshot) {
        //console.log(snapshot.val());
        snapshot.forEach(function(data) {
            //console.log(data.val());
            var node2 = document.createElement("div");
            restvalue = data.val().likes.length;
            rkey = data.key;
            //x[rkey]=restvalue;
            x.push({
                id: rkey,
                likes: restvalue,
                restname: data.val().restaurantname,
                abtrestro: (data.val().aboutrestro).substring(0, 250),
                img: imgurl
            });
            //likespush[data.key] = restvalue;
            firebase.storage().refFromURL(data.val().imageUrl).getMetadata().then(function(metadata) {
                imgurl = metadata.downloadURLs[0];
                node2.innerHTML = '<a href="" style="text-decoration:none;color:black"><div  class="col-md-10 col-sm-10 col-xs-12 border-box" style="background-color:#dff0d8;margin-top:5px">' +
                        '<div  class="col-md-3 col-sm-3 col-xs-5 all-padding-zero ">' +
                        '<img id="restimg" src="' + imgurl + '" class="img-responsive border-left-right" style="width:100px;height:100px" /> </div>' +
                        '<div  class="col-md-8 col-sm-8 col-xs-8 box8">' +
                        '<h4 id="restname" class="collection-heading">' + data.val().restaurantname + '</h4>' +
                        '<h5 id="restabout" class="collection-subheading text-justify" style="">' + (data.val().aboutrestro).substring(0, 250) + '.....</h5></div></div></a>';
                document.getElementById("restid").appendChild(node2);
            });
        });
        /* var nobj = x.sort(function(a, b){
         return a.likes < b.likes;
         }); */
        var objdata = x.sort(function(a, b) {
            return a.likes < b.likes;
        });
    });
    //var topUserPostsRef = firebase.database().ref('user-posts/' + myUserId)
    //alert(likeCountRef);
//console.log(likespush);


};

FindMyRestaurant.prototype.onAuthStateChanged = function(user) {
    if (user) {
        var uniqarray = [];
        // alert(user.displayName);
        var profilePicUrl = user.photoURL;
        // alert(profilePicUrl);
        var userName = user.displayName;
        // Set the user's profile pic and name.
        this.userPic.style.backgroundImage = 'url(' + (profilePicUrl || '/images/profile_placeholder.png') + ')';
        // document.getElementById('user-pic').innerHTML='<img src='+profilePicUrl+'/>';
        this.userName.textContent = userName;
        // Show user's profile and sign-out button.
        this.userName.removeAttribute('hidden');
        this.userPic.removeAttribute('hidden');
        this.signOutButton.removeAttribute('hidden');
        // Hide sign-in button.
        this.signInButton.setAttribute('hidden', 'true');
        console.log(user.uid);
       
/*	   if(user.uid==='w5fsHTTeR6RNVA5qIdFc4ynTtbg1')
        {
            document.getElementById('mainuser').removeAttribute('hidden');
        }
       */   
        
        var ref = firebase.database().ref('messages/userlikes/' + user.uid);
        var loggedUserLikes = firebase.database().ref('messages/restaurant').orderByChild('likes');
        loggedUserLikes.on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                //console.log(data.val().likes);
                if ((data.val().likes).indexOf(user.email) > 0)
                {
                    RestArray.push({
                        rest_id: data.key,
                        rest_cuisine: data.val().cuisines[0],
                        user_email: data.val().likes[1],
                    });
                    uniqarray.push(data.val().cuisines[0]);
                }
            });

            var EmilFreq = [];
            var count = 1, len = 0;
            ;
            var cusin;
            var result = [];

            uniqarray = uniqarray.sort();

            var unq = [];
            var pos1 = 0, pos2 = 0;
            for (var i = 0; i < uniqarray.length; i++)
            {
                //find the length of the specific cusine 
                pos2 = uniqarray.lastIndexOf(uniqarray[i]);
                pos1 = uniqarray.indexOf(uniqarray[i]);
                len = (pos2 - pos1) + 1;
                //console.log("length"+(pos2-pos1),uniqarray[i]);
                unq.push(len, uniqarray[i]);
                i = pos2;

                EmilFreq.push({cusin: uniqarray[i],
                    cuisinesCount: len
                });


            }
            var objdata = EmilFreq.sort(function(a, b) {
                return a.cuisinesCount < b.cuisinesCount;
            });
            ref.set(objdata);

           // console.log(objdata);

            //objdata.forEach(recnode)

            var cn = 0;
            snapshot.forEach(function(Recdata) {
                var recnode = document.createElement("div");
                for (var i = 0; i < objdata.length; i++)
                {
                    if ((Recdata.val().cuisines[0]) == objdata[0].cusin)
                    {
                        //console.log(Recdata.val().restaurantname);
                        recnode.innerHTML = '<div class="col-md-12 col-sm-12 col-xs-12 res" style="margin-top:5px">' +
                                '<div class="col-md-2 col-sm-2 col-xs-2 all-padding-zero">' +
                                '+<i class="fa fa-2x fa-cutlery" aria-hidden="true"></i></div>' +
                                '<div class="col-md-10 col-sm-10 col-xs-10  "><h4 class="collection-heading1">' + Recdata.val().restaurantname + '</h4>' +
                                '<h5 class="collection-subheading">' + Recdata.val().aboutrestro.substring(0, 100) + '</h5></div></div><br>';
                        document.getElementById("recommended").appendChild(recnode);

                    }
                    cn++;

                }


            });
           // console.log(snapshot.val());
            //console.log(objdata);




        });


    }

    else { // User is signed out!
        // Hide user's profile and sign-out button.
        this.userName.setAttribute('hidden', 'true');
        this.userPic.setAttribute('hidden', 'true');
        this.signOutButton.setAttribute('hidden', 'true');
        this.signInButton.removeAttribute('hidden');
        // Show sign-in .removeAttribute('hidden');

    }
};


/*
 FindRestaurants(){
 var arr=[];
 snapshot.forEach(function (data){
 arr.push(data.val().likes);
 });
 }
 */


FindMyRestaurant.prototype.signIn = function() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
      this.initFirebase();
	  //location.reload(true);
};
// Signs-out of Friendly Chat.
FindMyRestaurant.prototype.signOut = function() {
    // Sign out of Firebase.
    this.auth.signOut();
    location.reload(true);
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
    window.FindMyRestaurant = new FindMyRestaurant();
};
