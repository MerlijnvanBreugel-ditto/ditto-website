# Build labelled contact sheets from capture screenshots.
import sys, glob, os
from PIL import Image, ImageDraw
def sheet(files, out, cols, scale):
    ims=[Image.open(f) for f in files]
    w=int(ims[0].width*scale); h=int(ims[0].height*scale)
    rows=(len(ims)+cols-1)//cols
    S=Image.new('RGB',(cols*(w+8)+8, rows*(h+26)+8),'white')
    d=ImageDraw.Draw(S)
    for i,(im,f) in enumerate(zip(ims,files)):
        x=8+(i%cols)*(w+8); y=8+(i//cols)*(h+26)
        S.paste(im.resize((w,h)),(x,y+18))
        d.text((x,y+2),os.path.basename(f),fill='black')
    S.save(out,quality=80)
src=sys.argv[1]; pattern=sys.argv[2]; out=sys.argv[3]; cols=int(sys.argv[4]); scale=float(sys.argv[5])
files=sorted(glob.glob(os.path.join(src,pattern)))
start=int(sys.argv[6]) if len(sys.argv)>6 else 0; n=int(sys.argv[7]) if len(sys.argv)>7 else len(files)
sheet(files[start:start+n],out,cols,scale)
print(out, len(files[start:start+n]))
