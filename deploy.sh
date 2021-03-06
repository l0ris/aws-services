#!/bin/bash

account="442294194136"
regions=("us-east-1" "us-west-2" "ap-southeast-1" "ap-southeast-2" "ap-northeast-1" "eu-central-1" "eu-west-1")

awsconfig="awsconfig/build.f/particles-awsconfig/config/default.js"
awsconfigrules="awsconfigrules/build.f/particles-awsconfigrules/config/default.js"

tLen=${#regions[@]}

for (( i=0; i<${tLen}; i++ ));
do
	echo $account
	echo ${regions[$i]}
	export AWS_REGION=${regions[$i]}
	sed -i "/region: /c\        region: '${regions[$i]}'," $awsconfig
	sed -i "/bucket: /c\        bucket: 'sgas.particles-awsconfig.$account.${regions[$i]}'" $awsconfig
	sed -i "/region: /c\        region: '${regions[$i]}'," $awsconfigrules
	sed -i "/bucket: /c\        bucket: 'sgas.test.particles-awsconfigrules.$account.${regions[$i]}'" $awsconfigrules
	make build
done

