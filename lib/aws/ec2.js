/**
 * Created by sonal.ojha on 7/18/2016.
 */
var inherits = require('util').inherits;
var FlowController = require('../flow_controller');
var AWS = require('aws-sdk');

function AWSEC2() {

    FlowController.call(this);

    var me = this;

    me.findService = function(input) {
        var params = {region:input.region};
        if (input.creds)  params.credentials = input.creds;
        else if (input.profile) {
            var credentials = new AWS.SharedIniFileCredentials({profile: input.profile});
            AWS.config.credentials = credentials;
        }
        var ec2 = new AWS.EC2(params);
        return ec2;
    }

    me.securityGroupHasRules = function(input, callback) {
        params = {
            DryRun: false,
            Filters: [
                {
                    Name: 'vpc-id',
                    Values: [
                        input.vpcId /* required */
                    ]
                },
                {
                    Name: 'group-name',
                    Values: [
                        input.groupName /* required */
                    ]
                }
            ]
        };
        var self = arguments.callee;

        if (callback) {
            var ec2 = me.findService(input);
            ec2.describeSecurityGroups(params, callback);
            return;
        }

        self.callbackFind = function(data) {
            if (data.SecurityGroups.length !== 0) {
                for( var item in data.SecurityGroups) {
                    var permissions = data.SecurityGroups[item].IpPermissions;
                    console.log("Inbound Rules");
                    for ( var it in permissions) {
                        console.log(data.SecurityGroups[item].IpPermissions[it]);
                    }
                    var permissionsEgress = data.SecurityGroups[item].IpPermissionsEgress;
                    console.log("Outbound Rules");
                    for ( var it2 in permissionsEgress) {
                        console.log(data.SecurityGroups[item].IpPermissionsEgress[it2]);
                    }
                }
                console.log("Found Security group rules");
                return true;
            }
            else {
                console.log("No Security group rules found");
                return false;
            }
        }

        var configService = me.preRun(self, input);
        configService.describeSecurityGroups(params, me.callbackFind);
    }
}

module.exports = AWSEC2
