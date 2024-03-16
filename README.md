# EthyrMC

Current version: 1.0

A console-based minecraft launcher written in javascript

## Building

Simply run ``` npm install ``` command to install all the dependencies

## Running

Run ``` node index.js ``` while being in project root.

## Usage

The launcher offers command-line interface. There are some command here:
1. install -> available only after running setversion, installs minecraft version you specified.
2. username -> sets username for minecraft.
3. setversion -> sets version of minecraft to work with. Warning: you should specify it by yourself, for more info: [look at version_manifest.json](<https://piston-meta.mojang.com/mc/game/version_manifest.json>)
4. setuuid -> sets UUID for minecraft
5. validate -> checks if all libraries are correct and can be used. Doesnt work for natives
6. clear -> clears install data. DOESNT CLEAR /ASSETS! DELETE IT YOURSELF!
7. launch -> starts minecraft process.
8. quit -> quits the program without saving settings.
