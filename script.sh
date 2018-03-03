#!/bin/bash  

declare -a names=("long-term-vuln-node-app" "single-medium-vuln-node" "single-low-vuln-node" "multi-vuln-node" "vuln-demo-1-node" "vuln-demo-2-node" "vuln-demo-3-node" "vuln-demo-4-node"  "vuln-demo-10-node" "docker-vuln-manager");
declare -a toUpdate=("vuln-demo-1-node" "docker-vuln-manager")
declare -a ids

TOKEN=$(ts-node src/vuln-cli.ts login admin password)
if [ "$TOKEN" == "Unable to login" ]; then
  TOKEN=$(ts-node src/vuln-cli.ts register admin password)
fi

for name in "${names[@]}";
do
  echo vulnerability check 'for' "$name"
  ts-node src/vuln-cli.ts pullImage $TOKEN pawelpaszki/"$name":latest
  CONTAINER_ID="$(ts-node src/vuln-cli.ts createContainer $TOKEN pawelpaszki/$name)"
  ts-node src/vuln-cli.ts startContainer $TOKEN $CONTAINER_ID
  ts-node src/vuln-cli.ts extractContainer $TOKEN $CONTAINER_ID pawelpaszki/"$name"
  # check if update is required
  if [[ " ${toUpdate[@]} " =~ " ${name} " ]]; then
    result="$(ts-node src/vuln-cli.ts checkForVuln $TOKEN pawelpaszki/"$name" true)"
    echo "$result" > "results.json"
    sed -e "s/'/\"/g" -e "s/updates:/\"updates\":/g" results.json > parsedOutput.json
    jq -r '.[]' parsedOutput.json > updates.txt
    readarray updates < updates.txt
    # if updates available ...
    if [ "${#updates[@]}" -gt 0 ] ; then
      for package in "${updates[@]}";
      do
        echo updating $package in $name
        ts-node src/vuln-cli.ts updateComponent $TOKEN pawelpaszki/"$name" $package
      done
    fi
    # check tag and increment
    tag="$(ts-node src/vuln-cli.ts checkTag $TOKEN pawelpaszki/"$name")"
    echo "$tag" > "results.json"
    sed -e "s/'/\"/g" -e "s/major:/\"major\":/g" -e "s/minor:/\"minor\":/g" -e "s/patch:/\"patch\":/g" results.json > parsedOutput.json
    jq '.[]' parsedOutput.json > tagValues.txt
    sed -e "s/\"//g" tagValues.txt > tagValuesInt.txt
    readarray tagValues < tagValuesInt.txt
    tag="${tagValues[0]}"."${tagValues[1]}"."$((${tagValues[2]} + 1))"
    tagNoSpaces="$(echo $tag | tr -d ' ')"
    echo building new image
    ts-node src/vuln-cli.ts buildImage $TOKEN pawelpaszki/"$name)""$tagNoSpaces"
    echo pushing pawelpaszki/"$name" to Docker Hub
    ts-node src/vuln-cli.ts pushImage $TOKEN pawelpaszki/"$name)"
  fi
  echo vulnerability check details "for" $name
  ts-node src/vuln-cli.ts persistVulnCheck $TOKEN pawelpaszki/"$name"
   
  sudo rm -rf imagesTestDir/*
  sudo rm -rf parsedOutput.json
  sudo rm -rf results.json
  sudo rm -rf updates.txt
  sudo rm -rf results1.json
  sudo rm -rf tagValues.txt
  sudo rm -rf tagValuesInt.txt
  ids+=($CONTAINER_ID)
done

for id in "${ids[@]}";
do
  ts-node src/vuln-cli.ts stopContainer $TOKEN $CONTAINER_ID
  ts-node src/vuln-cli.ts removeContainer $TOKEN $CONTAINER_ID
done

echo finished!
