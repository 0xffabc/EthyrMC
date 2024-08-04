
function getLauncherArg(string) {
    return string += " -XX:+DisableExplicitGC -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:+UseStringDeduplication  -Xmx256m -Xms4096m -XX:+PerfDisableSharedMem -XX:+AlwaysPreTouch -XX:MaxGCPauseMillis=266 -XX:G1HeapRegionSize=16m";
}

module.exports = getLauncherArg;
