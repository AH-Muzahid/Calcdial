import cv2
import numpy as np
import os
from PIL import Image

def build_vector_logo():
    src = r'C:/Users/Muzahid/.gemini/antigravity/brain/96a3c346-8c60-45f4-b5a7-82818d22c5a5/.user_uploaded/media_1795179854586_3ab1fd00.jpg'
    img = cv2.imread(src)
    h, w, _ = img.shape

    b, g, r = img[:,:,0], img[:,:,1], img[:,:,2]

    # Threshold outer background
    whiteness = np.minimum(np.minimum(r, g), b)
    color_diff = np.maximum(np.maximum(np.abs(r - g), np.abs(g - b)), np.abs(b - r))
    is_bg = (whiteness > 230) & (color_diff < 20)

    # Floodfill outside background
    mask = is_bg.astype(np.uint8)
    h_m, w_m = mask.shape
    cv2.floodFill(mask, None, (0, 0), 255)
    cv2.floodFill(mask, None, (w_m-1, 0), 255)
    cv2.floodFill(mask, None, (0, h_m-1), 255)
    cv2.floodFill(mask, None, (w_m-1, h_m-1), 255)
    outer_bg = (mask == 255)

    blue_mask = ((b > 175) & (r < 70) & (~outer_bg)).astype(np.uint8) * 255
    navy_mask = ((~is_bg) & (blue_mask == 0) & (~outer_bg)).astype(np.uint8) * 255

    kernel = np.ones((3, 3), np.uint8)
    blue_clean = cv2.morphologyEx(blue_mask, cv2.MORPH_CLOSE, kernel)
    navy_clean = cv2.morphologyEx(navy_mask, cv2.MORPH_CLOSE, kernel)

    # Build SVG paths
    def contours_to_svg_path(contours, hierarchy=None):
        path_strs = []
        for i, c in enumerate(contours):
            if cv2.contourArea(c) < 300:
                continue
            # Smooth contour slightly with approxPolyDP
            epsilon = 0.0015 * cv2.arcLength(c, True)
            approx = cv2.approxPolyDP(c, epsilon, True)
            pts = approx.reshape(-1, 2)
            if len(pts) < 3:
                continue
            cmd = f"M {pts[0][0]} {pts[0][1]} " + " ".join([f"L {p[0]} {p[1]}" for p in pts[1:]]) + " Z"
            path_strs.append(cmd)
        return " ".join(path_strs)

    # Blue contours
    cnts_blue, _ = cv2.findContours(blue_clean, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_TC89_KCOS)
    blue_path = contours_to_svg_path(cnts_blue)

    # Navy contours (with holes, e.g. center hole in needle)
    cnts_navy, hier_navy = cv2.findContours(navy_clean, cv2.RETR_TREE, cv2.CHAIN_APPROX_TC89_KCOS)
    navy_path = contours_to_svg_path(cnts_navy)

    # Brand colors from DESIGN.md:
    # Navy: #010918 or #061A40
    # Electric Blue: #2B5CFD
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="100%" height="100%">
  <!-- Navy Components (fill-rule evenodd handles inner hole in needle ring) -->
  <path d="{navy_path}" fill="#061a40" fill-rule="evenodd" />
  
  <!-- Electric Blue Component -->
  <path d="{blue_path}" fill="#2b5cfd" />
</svg>'''

    svg_path = 'public/calcdial-vector.svg'
    with open(svg_path, 'w') as f:
        f.write(svg_content)
    
    art_svg = r'C:/Users/Muzahid/.gemini/antigravity/brain/96a3c346-8c60-45f4-b5a7-82818d22c5a5/calcdial-vector.svg'
    with open(art_svg, 'w') as f:
        f.write(svg_content)

    print('Saved SVG to', svg_path)

if __name__ == '__main__':
    build_vector_logo()
