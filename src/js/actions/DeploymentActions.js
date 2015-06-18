var oboe = require("oboe");

var config = require("../config/config");
var AppDispatcher = require("../AppDispatcher");
var DeploymentEvents = require("../events/DeploymentEvents");

var DeploymentActions = {
  requestDeployments: function () {
    this.request({
      url: config.apiURL + "v2/deployments"
    })
    .start(function (status) {
      this.status = status;
    })
    .done(function (deployments) {
      if (this.status !== 200) {
        return;
      }
      AppDispatcher.dispatch({
        actionType: DeploymentEvents.REQUEST,
        data: deployments
      });
    })
    .fail(function (error) {
      AppDispatcher.dispatch({
        actionType: DeploymentEvents.REQUEST_ERROR,
        data: error
      });
    });
  },
  revertDeployment: function (deploymentID) {
    this.request({
      method: "DELETE",
      url: config.apiURL + "v2/deployments/" + deploymentID
    })
    .start(function (status) {
      this.status = status;
    })
    .done(function (deployment) {
      if (this.status !== 200) {
        return;
      }
      AppDispatcher.dispatch({
        actionType: DeploymentEvents.REVERT,
        data: deployment,
        deploymentId: deploymentID
      });
    })
    .fail(function (error) {
      AppDispatcher.dispatch({
        actionType: DeploymentEvents.REVERT_ERROR,
        data: error
      });
    });
  },
  stopDeployment: function (deploymentID) {
    this.request({
      method: "DELETE",
      url: config.apiURL + "v2/deployments/" + deploymentID + "?force=true"
    })
    .start(function (status) {
      this.status = status;
    })
    .done(function (deployment) {
      if (this.status !== 202) {
        return;
      }
      AppDispatcher.dispatch({
        actionType: DeploymentEvents.STOP,
        data: deployment,
        deploymentId: deploymentID
      });
    })
    .fail(function (error) {
      AppDispatcher.dispatch({
        actionType: DeploymentEvents.STOP_ERROR,
        data: error
      });
    });
  },
  request: oboe
};

module.exports = DeploymentActions;
