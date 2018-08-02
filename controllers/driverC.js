const DriverModel = require('../models/driverModel');

module.exports = {

  // getDriverResponse(req,res){
  //   res.send({ hi:'there?'});
  // },

  homepage(req,res){
      res.render("homepage.ejs",{status: req.flash('status')} );
  },

  create(req,res,next){
    /*  Wrong Logic
    DriverModel.create( req.body )
        .then(function (err) {
            if (err){
              req.flash('status' , err.toString() );
            }else{
              req.flash('status' , 'Success!' );
            }

            res.render("homepage.ejs",{status: req.flash('status')} );
        });
    */

    DriverModel.create(req.body)
        .then((rslt)=>{
            res.send(rslt);
        })
        .catch(next)


      // let joe = new DriverModel({email:req.body.email});
      // joe.save(function(err){
      //     if(err)
      //         req.flash('status' , err.toString());
      //     else
      //         req.flash('status' , "Success!!");
      //
      //     res.render("homepage.ejs",{status: req.flash('status')} );
      // });


  }



};