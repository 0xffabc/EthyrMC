![i](https://shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=000&style=flat-square) ![GitHub Repo stars](https://img.shields.io/github/stars/0xffabc/EthyrMC) ![GitHub forks](https://img.shields.io/github/forks/0xffabc/EthyrMC)

# EthyrMC

Current version: 1.0

A console-based minecraft launcher written in javascript

## Requirements

- Set natives folder as you need, by default it's for windows here.
- Install [OpenAL](<https://www.openal.org/downloads/>)
- Install [NodeJS](<https://nodejs.org/en>).

## Building

Simply run ``` npm install ``` command to install all the dependencies

## Running

Run ``` node index.js ``` while being in project root.

## Usage

The list below are commands available in the launcher
1. install -> available only after running setversion, installs minecraft version you specified.
2. username -> sets username for minecraft.
3. setversion -> sets version of minecraft to work with. Warning: you should specify it by yourself, for more info: [look at version_manifest.json](<https://piston-meta.mojang.com/mc/game/version_manifest.json>)
4. setuuid -> sets UUID for minecraft
5. validate -> checks if all libraries are correct and can be used. Doesnt work for natives
6. clear -> clears install data. DOESNT CLEAR /ASSETS! DELETE IT YOURSELF!
7. launch -> starts minecraft process.
8. setjavap -> sets path for java. There's a little reminder: use JDK 8 if you want to use other versions than vanilla (forge / quirt / fabric modpacks and optifine especially).
9. quit -> quits the program, meanwhile saving your settings

Another reminder: *if you want to save settings of the launcher, use "quit" command.*

More reminder: the launcher doesn't automatically parse paths when specifying path to java. This is made for you to be able to put just "java.exe" or "javaw.exe" to setjavap command, so if the path has spaces in it, add quotes (") in it. For example:
  Wrong: ```
         setjavap
         C:\Program Files\java\bin\java.exe
         ```
  Correct: ```
           setjavap
           "C:\Program Files\java\bin\java.exe"
           ```

# Not added features

The launcher doesn't support mojang accounts and sometimes is specific to graphics card, sometimes if your gpu is outdated, newer versions of minecraft (>=1.13) will not start because of hardware.

# Common bugs and issues

If you see some issues in the code, report it in issues tab.
