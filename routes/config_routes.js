const indexR = require("./index");
const usersR = require("./users");
const rentalR = require("./rentalCars");
const saleR = require("./saleCars");
const salesOrderR = require("./saleOrder");
const rentalOrderR = require("./rentalOrder");
const categoriesRentalR = require("./categoriesRental");
const categoriesSaleR = require("./categoriesSale");
const cooperativeR = require("./cooperative");

exports.corsAccessControl = (app) => {
  app.all('*', function (req, res, next) {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,auth-token,x-api-key');
    next();
  });
}

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users", usersR);
  app.use("/rental", rentalR);
  app.use("/sale", saleR);
  app.use("/saleOrder", salesOrderR);
  app.use("/rentalOrder", rentalOrderR);
  app.use("/categoriesRental", categoriesRentalR);
  app.use("/categoriesSale", categoriesSaleR);
  app.use("/cooperative", cooperativeR);
  app.use((req,res) => {
    res.status(404).json({msg_error:"Url not found , 404!"})
  })
}