const app = require("express")();

const adminRoutes = require("./admin/admin.routes");
const roleRoutes = require("./roles/roles.routes");
const propertyRoutes = require("./property/property.routes");
const contactRoutes = require("./contact/contact.routes");
const appraisalRoutes = require("./appraisal/appraisal.routes");
const searchReqRoutes = require("./search-request/searchRequest.routes");
const managePropertyRoutes = require("./manage-property/manageProperty.routes");
const licensePartnerRoutes = require("./license-partner/licensePartner.routes");
const dropEmail = require("./contact/dropEmail.routes")
const company = require("./company/company.routes")
const static = require("./static/static.routes")

app.get("/", (req, res) => {
  res.send("Welcome to Property Management APIs!");
});

app.use("/v1/admin", adminRoutes);
app.use("/v1/role", roleRoutes);
app.use("/v1/property", propertyRoutes)
app.use("/v1/contact", contactRoutes)
app.use("/v1/appraisal", appraisalRoutes)
app.use("/v1/search", searchReqRoutes)
app.use("/v1/manage-property", managePropertyRoutes)
app.use("/v1/license-partner", licensePartnerRoutes)
app.use("/v1/drop-mail", dropEmail)
app.use("/v1/company", company)
app.use("/v1/static", static)


module.exports = app;
