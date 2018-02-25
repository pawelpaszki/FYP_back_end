#!/bin/bash  

declare -a names=("long-term-vuln-node-app" "single-medium-vuln-node" "single-low-vuln-node" "multi-vuln-node" "vuln-demo-1-node" "vuln-demo-2-node" "vuln-demo-3-node" "vuln-demo-4-node"  "vuln-demo-10-node");

declare -a ids

for name in "${names[@]}";
do
  echo vulnerability check 'for' "$name"
  CONTAINER_ID="$(ts-node src/vuln-cli.ts createContainer pawelpaszki/$name)"
  ts-node src/vuln-cli.ts startContainer $CONTAINER_ID
  ts-node src/vuln-cli.ts extractContainer $CONTAINER_ID pawelpaszki/"$name"
  ts-node src/vuln-cli.ts checkForVuln pawelpaszki/"$name"
  sudo rm -rf imagesTestDir/*
  ids+=($CONTAINER_ID)
done

for id in "${ids[@]}";
do
  docker container stop $id > /dev/null
  docker container rm $id > /dev/null
done

echo finished!
