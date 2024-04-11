# EthyrMC

Current version: 1.0

A console-based minecraft launcher written in javascript

## Requirements

- Set natives folder as you need, by default it's for windows here.
- Install [OpenAL](<https://www.openal.org/downloads/>)
- Install [NodeJS](<https://nodejs.org/en>), Use latest! It will allow faster downloading speed!

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
           This suffering is made because of windows "peculiarities"

# ToDo List

1. Support >1.12.2 versions
2. Support mojang accounts
3. Add fancy setversions command, or a new command that shows every version
4. Add mods auto-update (forge and fabric especially)

# Common bugs and issues

1. Module not found
   There are 2 variants of what happend: This is probably a bug of launcher, you didn't install modules through ```npm install``` command, or you're in weing directory (you should run this command in the project root, obviously)
2. Weird JDK-Related errors
   Install JDK-8.
3. Command (path)java(-w/"").exe not found
   Set path or command that leads to java.exe or javaw.exe by using setjavap command

# Is the launcher safe?

The launcher itself doesn't collect your passwords, nor your minecraft license or discord account, and doesn't have viruses in it. Launcher uses only trusted and open-source libraries, which doesn't have viruses too.
If you want to check if the launcher have viruses or not, check the code in /src, /patches and /parsers directories.
