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

              'data': JSON.stringify($emails),

              updatedData : req.flash('updatedData'),
              tag : req.flash('tag'),

              deletedData: req.flash('deletedData'),

              nearDriver: req.flash('nearDriver')
          });
      });
  },

    create(req,res,next){
      /*            PUT         */
      if(req.body._method === 'put'){
          const driverId = req.body.email;
          const driverName = req.body.name;
          const driverDriving = req.body.driving;
          const driverLongitude = req.body.lng;
          const driverLatitude = req.body.lat;

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
                  // console.log(typeof driver.driving.toString(),typeof driverDriving);
                  // console.log(driver.geometry.coordinates);
                  // console.log(driver.geometry.coordinates[0]);console.log(driver.geometry.coordinates[1]);

                  if (driver.driving.toString() !== driverDriving) {
                      driver.set('driving', driverDriving);
                      $tag.push('driving');
                  }
                  if (driver.name !== driverName) {
                      driver.set('name', driverName);
                      $tag.push('name');
                  }
                  if (driver.geometry.coordinates[0].toString() !== driverLongitude ||
                      driver.geometry.coordinates[1].toString() !== driverLatitude ) {

                      let $arr = [parseFloat(driverLongitude),parseFloat(driverLatitude)];
                      driver.set('geometry.coordinates',$arr );
                      $tag.push('coordinates');
                  }

                  driver.save()
                      .then((savedRecord) => {
                          req.flash('updatedData', driver);
                          req.flash('tag', $tag);
                          // console.log('tag:',$tag);
                          // console.log(savedRecord);
                          res.redirect('/');
                      })
              }).catch(next);


      }else if(req.body._method === 'delete'){
            const driverId = req.body.id;

            DriverModel.findByIdAndDelete(driverId)
                .then( driver => {
                    req.flash('deletedData', driver);
                    res.redirect('/');
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
                  const name = req.body.name;
                  const email = req.body.email;
                  const longitude = req.body.lng;
                  const latitude = req.body.lat;

                  let joe = new DriverModel({
                      name: name,
                      email: email,
                      geometry: {type: 'Point', coordinates: [longitude,latitude]}
                  });
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

    // PUT request
    // Editing of data
    edit(req,res,next){
      // Params are the value assigned via Wildcard
        const driverId = req.params.id ;

        // console.log('ID:',driverId);
        // console.log('Body:',req.body);
        // console.log('Param:',req.params);

        // DriverModel.findOneAndUpdate({_id:driverId},req.body)
        DriverModel.findByIdAndUpdate(driverId,req.body)
            .then( (data)=>{
                // console.log(data)    // Previous data
                return DriverModel.findById({ _id: driverId})
            }).then( driver =>{
                // Updated Data
            // console.log('Driver',driver);
                res.send(driver);
            }).catch(next);

    },

    delete(req,res,next){



    },

    // For all GET request
    // Get drivers near to specific coordinates
    index(req,res,next){
        // hhtp://google.com?lng=0&lat=20
        const {lng,lat} = req.query;

        // DriverModel.geoNear(
        //     {type: 'Point', coordinates: [parseFloat(lng),parseFloat(lat)] },
        //     {spherical: true, maxDistance: 200000}//2,00,000m
        // )
        DriverModel.aggregate([
            { $geoNear:{
                    near: { type: "Point", coordinates: [ parseFloat(lng),parseFloat(lat) ] },
                    distanceField: "dist",
                    spherical: true,
                    maxDistance: 200000
                }
            }
        ])
        // .then(drivers=>(JSON.stringify(drivers)))
        .then( result => {
            // console.log(result.toString() === '',result);
            if (result.toString() !== '')
                req.flash('nearDriver', result);
            else
                req.flash('nearDriver',{name:"No Driver Found!"});
            // console.log('driverC:',result);
            res.redirect('/');
        })
        .catch(next);
    }



};