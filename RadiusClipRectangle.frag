// SPDX-FileCopyrightText: 2023 Martin Bříza <m@rtinbriza.cz>
//
// SPDX-License-Identifier: MIT

#version 440
layout(location = 0) in vec2 qt_TexCoord0;
layout(location = 0) out vec4 fragColor;
layout(std140, binding = 0) uniform buf {
    mat4 qt_Matrix;
    float qt_Opacity;
    vec2 sourceSize;
    float radius;
    vec4 color;
    vec4 _borderColor;
    float _borderWidth;
    // bools don't seem to be supported
    int drawBorderOnTop;
    int clip;
    // TODO
    int antialiasing;
};
layout(binding = 1) uniform sampler2D source;

void main() {
    vec2 pixelCoord = qt_TexCoord0 * sourceSize;
    vec4 textureColor = texture(source, qt_TexCoord0);
    vec4 contentColor = mix(color, textureColor, textureColor.a);

    float clippedRadius = min(min(radius, sourceSize.x * 0.5),
                              min(radius, sourceSize.y * 0.5)
                             );

    vec2 topLeft = vec2(clippedRadius,
                        clippedRadius);
    vec2 topRight = vec2(sourceSize.x - clippedRadius,
                         clippedRadius);
    vec2 bottomLeft = vec2(clippedRadius,
                           sourceSize.y - clippedRadius);
    vec2 bottomRight = vec2(sourceSize.x - clippedRadius,
                            sourceSize.y - clippedRadius);

    if (pixelCoord.x >= clippedRadius && pixelCoord.x <= bottomRight.x) {
        if (pixelCoord.y <= _borderWidth || pixelCoord.y >= sourceSize.y - _borderWidth) {
            if (clip == 0 && drawBorderOnTop == 0)
                fragColor = mix(_borderColor, textureColor, textureColor.a);
            else
                fragColor = _borderColor;
        }
        else if (pixelCoord.x <= _borderWidth || pixelCoord.x >= sourceSize.x - _borderWidth) {
            if (clip == 0 && drawBorderOnTop == 0)
                fragColor = mix(_borderColor, textureColor, textureColor.a);
            else
                fragColor = _borderColor;
        }
        else {
            fragColor = contentColor;
        }

        fragColor.a *= qt_Opacity;
    }
    else if (pixelCoord.y >= clippedRadius && pixelCoord.y <= bottomRight.y) {
        if (pixelCoord.x <= _borderWidth  || pixelCoord.x >= sourceSize.x - _borderWidth) {
            if (clip == 0 && drawBorderOnTop == 0)
                fragColor = mix(_borderColor, textureColor, textureColor.a);
            else
                fragColor = _borderColor;
        }
        else if (pixelCoord.y <= _borderWidth || pixelCoord.y >= sourceSize.y - _borderWidth) {
            if (clip == 0 && drawBorderOnTop == 0)
                fragColor = mix(_borderColor, textureColor, textureColor.a);
            else
                fragColor = _borderColor;
        }
        else {
            fragColor = contentColor;
        }

        fragColor.a *= qt_Opacity;
    }
    else {
        float minimum = min(
            min(distance(pixelCoord, topLeft),
                distance(pixelCoord, topRight)
            ),
            min(distance(pixelCoord, bottomLeft),
                distance(pixelCoord, bottomRight)
            )
        );

        if (minimum <= clippedRadius) {
            if (minimum > clippedRadius - _borderWidth) {
                vec4 radiusColor = _borderColor;
                if (clip == 0 && drawBorderOnTop == 0) {
                    fragColor = mix(radiusColor, textureColor, textureColor.a);
                }
                else {
                    fragColor = radiusColor;
                }
            }
            else {
                fragColor = contentColor;
            }

            fragColor.a *= qt_Opacity;
        }
        else {
            if (clip == 0)
                fragColor = textureColor;
            else
                fragColor = vec4(0, 0, 0, 0);

            fragColor.a *= qt_Opacity;
        }
    }
}
