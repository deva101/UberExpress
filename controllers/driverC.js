const DriverModel = require('../models/driverModel');

module.exports = {

  // getDriverResponse(req,res){
  //   res.send({ hi:'there?'});
  // },

  homepage(req,res){
    // Send All EmailId of drivers
      let promise = DriverModel.find({}).exec();
      promise.then(function (arrayOfEmail) {
          // array of people ... do what you want here...
          let $emails = [];
          arrayOfEmail.forEach(function (data) {
              $emails.push(data);
          });

          res.render("homepage.ejs", {
              status: req.flash('status'),
              code: req.flash('code'),
              'data': $emails,
              updatedData : req.flash('updatedData'),
              tag : req.flash('tag')
          });

      });
  },
  create(req,res,next){
      /*            PUT         */
      if(req.body._method === 'put'){
          const driverId = req.body.email;
          const driverName = req.body.name;
          const driverDriving = req.body.driving;

          /*
          DriverModel.findOneAndUpdate({_id:driverId},{driving: driverDriving, name: driverName})
          // DriverModel.findOneAndUpdate({_id:driverId},req.body)
              .then( () => DriverModel.findById(driverId) )
              .then( (driver) => {
                  let $tag = [];
                  if (driver.driving !== driverDriving)
                      $tag.push('driving');
                  if (driver.name !== driverName )
                      $tag.push('name');
                  console.log('DriverC:',$tag);

                  req.flash('updatedData' , driver);
                  req.flash('tag' , $tag);
                  res.redirect('/');
              })
              .catch(next);
          */
          DriverModel.findOne({_id:driverId})
              .then( (driver)=> {
                  var $tag = ['none'];
                  console.log(typeof driver.driving.toString(),typeof driverDriving);
                  console.log(driver.name,driverName);

                  if (driver.driving.toString() !== driverDriving) {
                      driver.set('driving', driverDriving);
                      $tag.push('driving');
                  }
                  if (driver.name !== driverName) {
                      driver.set('name', driverName);
                      $tag.push('name');
                  }

                  driver.save()
                      .then((savedRecord) => {
                          req.flash('updatedData', driver);
                          req.flash('tag', $tag);
                          res.redirect('/');
                      })
              }).catch(next);


      }else{
      /*            POST          */

          /*  Wrong Logic
          DriverModel.create( req.body )
              .then(function (err) {
                  if (err){
                    req.flash('status' , err.toString() );
                  }else{
                    req.flash('status' , 'Success!' );
                  };

                  res.render("homepage.ejs",{status: req.flash('status')} );
              });
          */

          // DriverModel.create(req.body)
          //     .then((rslt)=>{
          //         res.send(rslt);
          //     })
          //     .catch(next)

          // Unique email
          DriverModel.findOne({'email':req.body.email}, function(err, user){
              if(err){
                  req.flash('status' ,err.toString());
                  res.redirect("/");
                  next() ;
              }

              if(user){
                  req.flash('status' ,'email already exist!');
                  res.redirect("/");
                  next() ;
              } else {
                  // Register the user
                  // let joe = new DriverModel({email:req.body.email});
                  let joe = new DriverModel(req.body);
                  joe.save(function(err){
                      if(err){
                          req.flash('status' , err.toString());
                      }else{
                          req.flash('status' , "Success!!");
                          req.flash('code' , "success") ;
                      }
                      res.redirect("/");

                  });
              }
          })

      }


  },


    edit(req,res,next){
      // Params are the value assigned via Wildcard
        const driverId = req.params.id ;

        console.log('ID:',driverId);
        console.log('Body:',req.body);
        console.log('Param:',req.params);

        // DriverModel.findOneAndUpdate({_id:driverId},req.body)
        // // DriverModel.findByIdAndUpdate(driverId,req.body)
        //     .then( (data)=>{
        //         req.flash('status' , "Changes Saved!!");
        //         req.flash('code' , "success");
        //
        //         res.redirect('/');
        //
        //         // console.log(data)    // Previous data
        //     }).catch(next);

    }





};