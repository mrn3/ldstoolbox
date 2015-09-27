Meteor.methods({
  insertSignup: function(signup){
    signup._id = signupCollection.insert(signup);
    return signup;
  },
  removeSignup: function(signup){
    //remove associated data
    volunteerCollection.remove({signupId: signup._id});
    signupCollection.remove(signup._id);
  }
});
