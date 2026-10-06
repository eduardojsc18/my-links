"""Render the site-native EJ. monogram from real font outlines, without font dependencies in SVG."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

destination = Path(__file__).resolve().parent.parent / 'src/assets/brand'
destination.mkdir(parents=True, exist_ok=True)
font_path = Path('C:/Windows/Fonts/georgiab.ttf')
font = TTFont(font_path)
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
scale = 38 / font['head'].unitsPerEm
paths = []
for letter, x in [('E', 7), ('J', 30)]:
    pen = SVGPathPen(glyphs)
    glyphs[cmap[ord(letter)]].draw(pen)
    paths.append(f'<path transform="translate({x} 47) scale({scale} {-scale})" d="{pen.getCommands()}"/>')

themes = {'casual':('#234c43','#f7f6f2','#ed737a'), 'gamer':('#191619','#f7f6f2','#ed737a'), 'business':('#eeeae3','#252825','#454d43')}
for name, (background, ink, accent) in themes.items():
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>Eduardo José — EJ.</title><rect width="64" height="64" rx="14" fill="{background}"/><g fill="{ink}">{"".join(paths)}</g><circle cx="55" cy="46" r="3" fill="{accent}"/></svg>'
    (destination / f'favicon-{name}.svg').write_text(svg, encoding='utf-8')

# Raster fallbacks use the same glyphs and placement as the vector mark.
factor = 16
image = Image.new('RGBA', (64*factor,64*factor))
draw = ImageDraw.Draw(image)
background, ink, accent = themes['casual']
draw.rounded_rectangle((0,0,64*factor-1,64*factor-1), radius=14*factor, fill=background)
render_font = ImageFont.truetype(str(font_path),38*factor)
for letter, x in [('E',7),('J',30)]:
    draw.text((x*factor,47*factor),letter,font=render_font,fill=ink,anchor='ls')
draw.ellipse((52*factor,43*factor,58*factor,49*factor),fill=accent)
for size, filename in [(32,'favicon-32.png'),(180,'apple-touch-icon.png'),(512,'ej-icon.png')]:
    image.resize((size,size),Image.Resampling.LANCZOS).save(destination/filename)
image.save(destination/'favicon.ico',format='ICO',sizes=[(16,16),(32,32),(48,48),(64,64)])
print('Created vector icons and PNG/ICO fallbacks:', destination)
