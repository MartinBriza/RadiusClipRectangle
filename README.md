# RadiusClipRectangle

QML ShaderEffect Rectangle component that clips inside its radius boundaries.

![Example](https://github.com/MartinBriza/RadiusClipRectangle/raw/main/example.png)

This project is just a toy for now. A few basic Rectangle properties are implemented (`radius`, `border`, `color`) and it can contain other elements and clip them to contain them inside its boundaries, expecially when `radius` is not 0. I'll probably add `antialiasing` and `gradient` eventually.

I wrote it with Qt 6.5 on Linux. There's no buildsystem integration for now but you can just take it all and drop inside your build folder if you want to try it.

The performance is probably not great because I don't really know GLSL but if you want to crop an image here or there, it could be fine. I'm planning to use this in [Lith](https://github.com/LithApp/Lith) eventually.
