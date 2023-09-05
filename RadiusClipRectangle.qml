// SPDX-FileCopyrightText: 2023 Martin Bříza <m@rtinbriza.cz>
//
// SPDX-License-Identifier: MIT

import QtQuick

ShaderEffect {
    id: rectRoot

    // The shader needs to be compiled to qsb first, CMake/Qt handles this with qt6_add_shaders
    fragmentShader: "qrc:/RoundedClippingRectangle.frag.qsb"

    // Enabled by default, it doesn't really make sense to use this without it
    clip: true
    // Some basic Rectangle properties
    property real radius: 0
    readonly property RadiusClipRectangleBorder border: RadiusClipRectangleBorder { id: _border }
    property color color: "white"

    // If this property is set, the border will be rendered over the clipped content, inside the boundaries
    property bool drawBorderOnTop: false

    // Expose the border to the shader
    property alias _borderWidth: _border.width
    property alias _borderColor: _border.color

    // The actual content of the rectangle is contained in the item below
    default property alias content: contentItem.children
    readonly property var source: contentItem
    readonly property size sourceSize: Qt.size(rectRoot.width, rectRoot.height)

    Item {
        id: contentItem
        anchors.fill: parent
        visible: false
        layer.enabled: true
    }
}
