# Compact per-section layer summary for one breakpoint: python3 summarize.py <bp> <section-regex> [maxdepth]
import json,sys,re
bp=sys.argv[1]; rx=re.compile(sys.argv[2]); md=int(sys.argv[3]) if len(sys.argv)>3 else 6
import os; L=json.load(open(os.path.join(os.environ.get('EXTRACT_DIR','docs/extraction'),bp,'layers.json')))
seen=set()
def short(s):
    o=[]
    pad=[s.get(k,'0px') for k in ('paddingTop','paddingRight','paddingBottom','paddingLeft')]
    if any(p!='0px' for p in pad): o.append('pad '+' '.join(p.replace('px','') for p in pad))
    if 'gap' in s and s['gap'] not in ('normal',): o.append('gap '+s['gap'])
    if s.get('display')=='flex': o.append('flex-'+('col' if s.get('flexDirection')=='column' else 'row')+(' '+s.get('justifyContent','')+'/'+s.get('alignItems','') ))
    if s.get('display')=='grid': o.append('grid '+s.get('gridTemplateColumns',''))
    for k,lab in (('borderRadius','r'),('backgroundColor','bg'),('position','pos'),('top','top'),('maxWidth','maxw'),('transform','tf'),('opacity','op'),('boxShadow','shadow'),('backdropFilter','blur'),('borderTopWidth','bw'),('borderTopColor','bc')):
        v=s.get(k)
        if v and not (k=='position' and v=='relative') and not (k=='opacity' and v=='1') and not (k=='top' and s.get('position') not in ('sticky','fixed','absolute')):
            if k=='borderTopColor' and 'borderTopWidth' not in s: continue
            o.append(f'{lab} {v}')
    return ' | '.join(o)
for r in L:
    p=r['path']
    if not rx.search(p): continue
    depth=p.count('>')
    if depth>md: continue
    s=r['style']
    t=r.get('text')
    key=(p,r['tag'],r['box']['w'],r['box']['h'],t)
    if key in seen: continue
    seen.add(key)
    b=r['box']
    line=f"{'  '*depth}{p.split(' > ')[-1] if p else r['tag']} <{r['tag']}> [{b['x']},{b['y']} {b['w']}x{b['h']}] {short(s)}"
    if t and r['tag'] in ('h1','h2','h3','h4','p','a'):
        ff=s.get('fontFamily','').split(',')[0].replace('\"','')
        line+=f" || \"{t[:50]}\" {ff} {s.get('fontSize')}/{s.get('lineHeight')} ls {s.get('letterSpacing','0')} var {s.get('fontVariationSettings','')} c {s.get('color')} al {s.get('textAlign','')}"
    if r['tag']=='img': line+=f" src {r.get('src','').split('/')[-1][:30]} alt={r.get('alt')!r}"
    print(line)
